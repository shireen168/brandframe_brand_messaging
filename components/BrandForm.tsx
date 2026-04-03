'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BrandFormInputs, FIELD_LIMITS, TONE_OPTIONS } from '@/lib/sanitize';

type Props = {
  onSubmit: (inputs: BrandFormInputs) => void;
  loading: boolean;
};

const EMPTY: BrandFormInputs = {
  company_name: '',
  industry: '',
  what_you_do: '',
  target_audience: '',
  values: '',
  competitors: '',
  tone: 'Professional',
};

export function BrandForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<BrandFormInputs>(EMPTY);

  function set(field: keyof BrandFormInputs, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30';
  const labelClass = 'block text-xs font-medium uppercase tracking-wider text-white/40 mb-1.5';
  const charHint = (val: string, max: number) => (
    <span className={`text-xs ${val.length > max * 0.9 ? 'text-amber-400' : 'text-white/20'}`}>
      {val.length}/{max}
    </span>
  );

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <div className="flex justify-between">
            <label className={labelClass}>Company name *</label>
            {charHint(form.company_name, FIELD_LIMITS.company_name)}
          </div>
          <input className={inputClass} value={form.company_name}
            onChange={(e) => set('company_name', e.target.value)}
            placeholder="Acme Inc." maxLength={FIELD_LIMITS.company_name} required />
        </div>
        <div>
          <div className="flex justify-between">
            <label className={labelClass}>Industry *</label>
            {charHint(form.industry, FIELD_LIMITS.industry)}
          </div>
          <input className={inputClass} value={form.industry}
            onChange={(e) => set('industry', e.target.value)}
            placeholder="SaaS / B2B Tech" maxLength={FIELD_LIMITS.industry} required />
        </div>
      </div>

      <div>
        <div className="flex justify-between">
          <label className={labelClass}>What you do *</label>
          {charHint(form.what_you_do, FIELD_LIMITS.what_you_do)}
        </div>
        <textarea className={`${inputClass} resize-none`} rows={2} value={form.what_you_do}
          onChange={(e) => set('what_you_do', e.target.value)}
          placeholder="We help marketing teams automate content distribution across channels."
          maxLength={FIELD_LIMITS.what_you_do} required />
      </div>

      <div>
        <div className="flex justify-between">
          <label className={labelClass}>Target audience *</label>
          {charHint(form.target_audience, FIELD_LIMITS.target_audience)}
        </div>
        <textarea className={`${inputClass} resize-none`} rows={2} value={form.target_audience}
          onChange={(e) => set('target_audience', e.target.value)}
          placeholder="Marketing directors at mid-size B2B companies (50–500 employees)"
          maxLength={FIELD_LIMITS.target_audience} required />
      </div>

      <div>
        <div className="flex justify-between">
          <label className={labelClass}>Core values / differentiators *</label>
          {charHint(form.values, FIELD_LIMITS.values)}
        </div>
        <textarea className={`${inputClass} resize-none`} rows={3} value={form.values}
          onChange={(e) => set('values', e.target.value)}
          placeholder="Speed of implementation, no-code setup, integrates with existing tools"
          maxLength={FIELD_LIMITS.values} required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <div className="flex justify-between">
            <label className={labelClass}>Competitors (optional)</label>
            {charHint(form.competitors, FIELD_LIMITS.competitors)}
          </div>
          <input className={inputClass} value={form.competitors}
            onChange={(e) => set('competitors', e.target.value)}
            placeholder="HubSpot, Hootsuite" maxLength={FIELD_LIMITS.competitors} />
        </div>
        <div>
          <label className={labelClass}>Tone preference *</label>
          <div className="grid grid-cols-2 gap-2">
            {TONE_OPTIONS.map((t) => (
              <button key={t} type="button"
                onClick={() => set('tone', t)}
                className={`rounded-xl border px-3 py-2 text-sm transition ${
                  form.tone === t
                    ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="w-full rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Generating your brand...' : 'Generate Brand Messaging'}
      </motion.button>
    </motion.form>
  );
}
