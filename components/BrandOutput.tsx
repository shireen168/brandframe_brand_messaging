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
  onReset?: () => void;
};

const TABS = ['Positioning', 'Voice & Tone', 'Personas', 'Taglines', 'Elevator Pitches', 'Voice in Action'] as const;
type Tab = (typeof TABS)[number];

export function BrandOutput({ outputs, companyName, inputs, onSave, isSaved, onReset }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Positioning');
  const [localOutputs, setLocalOutputs] = useState<BrandOutputs>(outputs);
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

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

  function handleReset() {
    setIsExiting(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: isExiting ? 0.3 : 0.5 }}
      onAnimationComplete={() => { if (isExiting && onReset) onReset(); }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Brand Messaging for</p>
          <h2 className="text-2xl font-bold text-white">{companyName}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleCopyAll}
            className="group relative overflow-hidden rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white">
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 ease-in-out group-hover:translate-x-full" />
            <span className="relative">{copiedAll ? '✓ Copied!' : 'Copy All'}</span>
          </button>
          {onSave && (
            <AnimatePresence mode="wait">
              {isSaved ? (
                <motion.button key="saved" disabled
                  initial={{ borderColor: 'rgba(16,185,129,0.8)', color: 'rgb(110,231,183)' }}
                  animate={{ borderColor: 'rgba(139,92,246,0.5)', color: 'rgb(221,214,254)' }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium opacity-60">
                  <motion.svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <motion.path d="M2 7l3.5 3.5L12 3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </motion.svg>
                  Saved
                </motion.button>
              ) : (
                <motion.button key="save" onClick={onSave}
                  className="rounded-full border border-violet-500/50 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20">
                  Save to Dashboard
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Tab nav */}
      <div className="scrollbar-hide flex gap-1 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}>
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-violet-500"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
          <BrandTabContent activeTab={activeTab} outputs={localOutputs} inputs={inputs}
            regenerating={regenerating} onRegenerate={handleRegenerate} />
        </motion.div>
      </AnimatePresence>

      {/* Generate another */}
      {onReset && (
        <button onClick={handleReset}
          className="mt-2 w-full rounded-2xl border border-white/15 py-3 text-sm font-medium text-white/40 transition hover:border-white/30 hover:text-white/70">
          Generate another
        </button>
      )}
    </motion.div>
  );
}
