import { BrandFormInputs } from './sanitize';

// ── Output shape ──────────────────────────────────────────────────────────────

export type VoiceToneProfile = {
  traits: string[];
  do: string[];
  dont: string[];
};

export type Persona = {
  name: string;
  role: string;
  pain_points: string[];
  what_they_need: string;
};

export type ElevatorPitches = {
  short: string;
  medium: string;
  long: string;
};

export type VoiceExamples = {
  linkedin: string;
  instagram: string;
  email_subject: string;
};

export type BrandOutputs = {
  positioning_statement: string;
  brand_promise: string;
  brand_pillars: string[];
  voice_tone_profile: VoiceToneProfile;
  personas: Persona[];
  taglines: string[];
  elevator_pitches: ElevatorPitches;
  voice_examples?: VoiceExamples;
};

// ── Prompt builders ───────────────────────────────────────────────────────────

export function buildSystemPrompt(): string {
  return (
    'You are an expert brand strategist and messaging consultant. ' +
    'You help businesses define their brand identity with clarity and precision. ' +
    'When competitors are mentioned, explicitly position the brand as the superior alternative ' +
    'by highlighting what the brand does differently or better. ' +
    'Your output must be valid JSON matching the specified schema exactly. ' +
    'Do not include markdown, code blocks, or any text outside the JSON object.'
  );
}

export function buildUserPrompt(inputs: BrandFormInputs): string {
  const competitorLine = inputs.competitors
    ? `Competitors to differentiate from: ${inputs.competitors}\n`
    : '';

  const positioningInstruction = inputs.competitors
    ? `"positioning_statement": "1-2 sentence statement that explicitly positions this brand as the better alternative to ${inputs.competitors}"`
    : `"positioning_statement": "1-2 sentence market position statement"`;

  return `Create a complete brand messaging document for this company.

Company: ${inputs.company_name}
Industry: ${inputs.industry}
What they do: ${inputs.what_you_do}
Target audience: ${inputs.target_audience}
Core values / differentiators: ${inputs.values}
${competitorLine}Tone preference: ${inputs.tone}

Return ONLY a JSON object with this exact structure:
{
  ${positioningInstruction},
  "brand_promise": "Core commitment to customers in 1 sentence",
  "brand_pillars": ["pillar 1", "pillar 2", "pillar 3", "pillar 4"],
  "voice_tone_profile": {
    "traits": ["trait 1", "trait 2", "trait 3", "trait 4"],
    "do": ["do guideline 1", "do guideline 2", "do guideline 3"],
    "dont": ["dont guideline 1", "dont guideline 2", "dont guideline 3"]
  },
  "personas": [
    {
      "name": "First name",
      "role": "Job title or description",
      "pain_points": ["pain 1", "pain 2", "pain 3"],
      "what_they_need": "What this persona needs from the brand"
    },
    {
      "name": "First name",
      "role": "Job title or description",
      "pain_points": ["pain 1", "pain 2"],
      "what_they_need": "What this persona needs from the brand"
    }
  ],
  "taglines": ["tagline 1", "tagline 2", "tagline 3", "tagline 4", "tagline 5"],
  "elevator_pitches": {
    "short": "1 sentence under 20 words",
    "medium": "2-3 sentences under 60 words",
    "long": "Full paragraph under 120 words"
  },
  "voice_examples": {
    "linkedin": "A LinkedIn post in the brand voice (3-4 sentences, professional, insight-led, no hashtags)",
    "instagram": "An Instagram caption in the brand voice (2-3 sentences, punchy, 3-5 relevant hashtags at the end)",
    "email_subject": "An email subject line in the brand voice (under 60 characters, compelling, drives opens)"
  }
}`;
}

export function parseBrandOutputs(raw: string): BrandOutputs {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  return JSON.parse(cleaned) as BrandOutputs;
}
