export const FIELD_LIMITS = {
  company_name: 80,
  industry: 80,
  what_you_do: 300,
  target_audience: 300,
  values: 400,
  competitors: 200,
  tone: 30,
} as const;

export type FieldName = keyof typeof FIELD_LIMITS;

export type BrandFormInputs = {
  company_name: string;
  industry: string;
  what_you_do: string;
  target_audience: string;
  values: string;
  competitors: string;
  tone: string;
};

export const TONE_OPTIONS = [
  'Professional',
  'Friendly',
  'Bold',
  'Innovative',
] as const;

export type ToneOption = (typeof TONE_OPTIONS)[number];

function sanitizeField(value: string, field: FieldName): string {
  if (typeof value !== 'string') return '';
  return value
    .trim()
    .replace(/<[^>]*>/g, '')                        // strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // strip control chars
    .slice(0, FIELD_LIMITS[field]);
}

export function sanitizeInputs(raw: Record<string, unknown>): BrandFormInputs {
  return {
    company_name: sanitizeField(String(raw.company_name ?? ''), 'company_name'),
    industry: sanitizeField(String(raw.industry ?? ''), 'industry'),
    what_you_do: sanitizeField(String(raw.what_you_do ?? ''), 'what_you_do'),
    target_audience: sanitizeField(
      String(raw.target_audience ?? ''),
      'target_audience'
    ),
    values: sanitizeField(String(raw.values ?? ''), 'values'),
    competitors: sanitizeField(String(raw.competitors ?? ''), 'competitors'),
    tone: sanitizeField(String(raw.tone ?? ''), 'tone'),
  };
}

export function validateInputs(inputs: BrandFormInputs): string | null {
  if (!inputs.company_name.trim()) return 'Company name is required.';
  if (!inputs.industry.trim()) return 'Industry is required.';
  if (!inputs.what_you_do.trim()) return 'Please describe what you do.';
  if (!inputs.target_audience.trim()) return 'Target audience is required.';
  if (!inputs.values.trim()) return 'Core values / differentiators are required.';
  if (!inputs.tone.trim()) return 'Tone preference is required.';
  if (!TONE_OPTIONS.includes(inputs.tone as ToneOption)) {
    return 'Invalid tone preference.';
  }
  return null;
}
