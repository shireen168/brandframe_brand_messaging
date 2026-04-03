import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { checkRateLimit } from '@/lib/rateLimit';
import { isRedisConfigured } from '@/lib/redis';
import { sanitizeInputs } from '@/lib/sanitize';
import { createClient } from '@/lib/supabase-server';

const MAX_TOKENS = 600;

const VALID_SECTIONS = [
  'positioning_statement',
  'brand_promise',
  'brand_pillars',
  'taglines',
  'elevator_pitches',
  'voice_tone_profile',
  'voice_examples',
] as const;

type Section = (typeof VALID_SECTIONS)[number];

const SECTION_SCHEMAS: Record<Section, string> = {
  positioning_statement: `"positioning_statement": "1-2 sentence market position statement"`,
  brand_promise: `"brand_promise": "Core commitment to customers in 1 sentence"`,
  brand_pillars: `"brand_pillars": ["pillar 1", "pillar 2", "pillar 3", "pillar 4"]`,
  taglines: `"taglines": ["tagline 1", "tagline 2", "tagline 3", "tagline 4", "tagline 5"]`,
  elevator_pitches: `"elevator_pitches": { "short": "under 20 words", "medium": "under 60 words", "long": "under 120 words" }`,
  voice_tone_profile: `"voice_tone_profile": { "traits": ["t1","t2","t3","t4"], "do": ["d1","d2","d3"], "dont": ["d1","d2","d3"] }`,
  voice_examples: `"voice_examples": { "linkedin": "LinkedIn post 3-4 sentences no hashtags", "instagram": "Instagram caption with 3-5 hashtags", "email_subject": "Subject line under 60 chars" }`,
};

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function POST(req: NextRequest) {
  if (!isRedisConfigured()) {
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let rlResult: { remaining: number; limit: number } | null = null;
  try {
    const identifier = user ? user.id : getClientIP(req);
    const type = user ? 'user' : 'guest';
    const rl = await checkRateLimit(identifier, type);
    rlResult = { remaining: rl.remaining, limit: rl.limit };

    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Daily limit reached. You have ${rl.limit} generation${rl.limit !== 1 ? 's' : ''} per day.`, remaining: 0 },
        { status: 429 }
      );
    }
  } catch (err) {
    console.error('[regenerate] Rate limit error:', err);
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const section = body.section as string;
  if (!VALID_SECTIONS.includes(section as Section)) {
    return NextResponse.json({ error: 'Invalid section.' }, { status: 400 });
  }

  const inputs = sanitizeInputs(body.inputs as Record<string, unknown>);
  const competitorLine = inputs.competitors
    ? `Competitors to differentiate from: ${inputs.competitors}\n`
    : '';

  const prompt = `Regenerate only the "${section}" for this brand. Return ONLY a JSON object with just this one field.

Company: ${inputs.company_name}
Industry: ${inputs.industry}
What they do: ${inputs.what_you_do}
Target audience: ${inputs.target_audience}
Core values: ${inputs.values}
${competitorLine}Tone: ${inputs.tone}

Return ONLY: { ${SECTION_SCHEMAS[section as Section]} }`;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: MAX_TOKENS,
      system: 'You are a brand strategist. Return only valid JSON with no markdown or extra text.',
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '';
    const cleaned = rawText
      .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(
      { section, value: result[section], remaining: rlResult?.remaining ?? 0 },
      { status: 200 }
    );
  } catch (err) {
    console.error('[regenerate] Claude API error:', err);
    return NextResponse.json({ error: 'Regeneration failed. Please try again.' }, { status: 500 });
  }
}
