'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandOutputs } from '@/lib/brandPrompt';
import { BrandFormInputs } from '@/lib/sanitize';
import { BrandTabContent } from './BrandTabContent';

type Props = {
  outputs: BrandOutputs;
  companyName: string;
  inputs?: BrandFormInputs;
  onSave?: () => void;
  isSaved?: boolean;
};

const TABS = ['Positioning', 'Voice & Tone', 'Personas', 'Taglines', 'Elevator Pitches', 'Voice in Action'] as const;
type Tab = (typeof TABS)[number];

export function BrandOutput({ outputs, companyName, inputs, onSave, isSaved }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Positioning');
  const [localOutputs, setLocalOutputs] = useState<BrandOutputs>(outputs);
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  async function handleRegenerate(section: string) {
    if (!inputs) return;
    setRegenerating(section);
    try {
      const res = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, inputs }),
      });
      if (res.ok) {
        const json = await res.json();
        setLocalOutputs((prev) => ({ ...prev, [section]: json.value }));
      }
    } finally {
      setRegenerating(null);
    }
  }

  function handleCopyAll() {
    const o = localOutputs;
    const lines = [
      `BRAND MESSAGING: ${companyName.toUpperCase()}`,
      '',
      `POSITIONING STATEMENT\n${o.positioning_statement}`,
      '',
      `BRAND PROMISE\n${o.brand_promise}`,
      '',
      `BRAND PILLARS\n${o.brand_pillars.map((p) => `• ${p}`).join('\n')}`,
      '',
      `TONE TRAITS\n${o.voice_tone_profile.traits.map((t) => `• ${t}`).join('\n')}`,
      '',
      `DO\n${o.voice_tone_profile.do.map((d) => `✓ ${d}`).join('\n')}`,
      `DON'T\n${o.voice_tone_profile.dont.map((d) => `✗ ${d}`).join('\n')}`,
      '',
      `TAGLINES\n${o.taglines.map((t, i) => `${i + 1}. "${t}"`).join('\n')}`,
      '',
      `ELEVATOR PITCHES\nShort: ${o.elevator_pitches.short}\nMedium: ${o.elevator_pitches.medium}\nLong: ${o.elevator_pitches.long}`,
    ];
    if (o.voice_examples) {
      lines.push('', `VOICE EXAMPLES\nLinkedIn: ${o.voice_examples.linkedin}\nInstagram: ${o.voice_examples.instagram}\nEmail Subject: ${o.voice_examples.email_subject}`);
    }
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Brand Messaging for</p>
          <h2 className="text-2xl font-bold text-white">{companyName}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCopyAll}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
          >
            {copiedAll ? '✓ Copied!' : 'Copy All'}
          </button>
          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaved}
              className="rounded-full border border-violet-500/50 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20 disabled:opacity-40"
            >
              {isSaved ? 'Saved' : 'Save to Dashboard'}
            </button>
          )}
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-violet-600 text-white'
                : 'border border-white/15 text-white/50 hover:border-white/30 hover:text-white/80'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          <BrandTabContent
            activeTab={activeTab}
            outputs={localOutputs}
            inputs={inputs}
            regenerating={regenerating}
            onRegenerate={handleRegenerate}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
