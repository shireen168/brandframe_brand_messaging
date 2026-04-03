import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { BrandOutputs } from '@/lib/brandPrompt';
import { BrandFormInputs } from '@/lib/sanitize';

type SaveRequestBody = {
  inputs: BrandFormInputs;
  outputs: BrandOutputs;
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  let body: SaveRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { inputs, outputs } = body;

  if (!inputs?.company_name || !outputs?.positioning_statement) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('brand_docs')
    .insert({
      user_id: user.id,
      company_name: inputs.company_name,
      inputs,
      outputs,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[save] Supabase error:', error.message);
    return NextResponse.json({ error: 'Failed to save.' }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}
