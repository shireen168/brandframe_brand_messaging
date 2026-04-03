import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkRateLimit } from '@/lib/rateLimit';
import { isRedisConfigured } from '@/lib/redis';
import { sanitizeInputs, validateInputs } from '@/lib/sanitize';
import {
  buildSystemPrompt,
  buildUserPrompt,
  parseBrandOutputs,
} from '@/lib/brandPrompt';
import { createClient } from '@/lib/supabase-server';

const MAX_TOKENS = 2000;

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function POST(req: NextRequest) {
  // Hard-block if Upstash is not configured
  if (!isRedisConfigured()) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable. Please try again later.' },
      { status: 503 }
    );
  }

  // Determine if user is authenticated
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Apply rate limiting
  try {
    const identifier = user ? user.id : getClientIP(req);
    const type = user ? 'user' : 'guest';
    const rl = await checkRateLimit(identifier, type);

    if (!rl.allowed) {
      return NextResponse.json(
        {
          error: `Daily limit reached. You have ${rl.limit} generation${rl.limit !== 1 ? 's' : ''} per day.`,
          remaining: 0,
          resetInSeconds: rl.resetInSeconds,
        },
        { status: 429 }
      );
    }
  } catch (err) {
    console.error('[generate] Rate limit error:', err);
    return NextResponse.json(
      { error: 'Service temporarily unavailable.' },
      { status: 503 }
    );
  }

  // Parse + sanitise inputs
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const inputs = sanitizeInputs(body);
  const validationError = validateInputs(inputs);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  // Call Claude API
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: MAX_TOKENS,
      system: buildSystemPrompt(),
      messages: [{ role: 'user', content: buildUserPrompt(inputs) }],
    });

    const rawText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    const outputs = parseBrandOutputs(rawText);

    return NextResponse.json({ outputs, inputs }, { status: 200 });
  } catch (err) {
    console.error('[generate] Claude API error:', err);
    return NextResponse.json(
      { error: 'Generation failed. Please try again.' },
      { status: 500 }
    );
  }
}
