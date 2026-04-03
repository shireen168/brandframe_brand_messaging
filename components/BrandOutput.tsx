'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandOutputs } from '@/lib/brandPrompt';
import {
  BrandCard,
  BrandPillList,
  BrandTaglineList,
  PersonaCard,
} from './BrandCard';

type Props = {
  outputs: BrandOutputs;
  companyName: string;
  onSave?: () => void;
  isSaved?: boolean;
};

const TABS = [
  'Positioning',
  'Voice & Tone',
  'Personas',
  'Taglines',
  'Elevator Pitches',
] as const;

type Tab = (typeof TABS)[number];

export function BrandOutput({ outputs, companyName, onSave, isSaved }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Positioning');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest">Brand Messaging for</p>
          <h2 className="text-xl font-bold text-white">{companyName}</h2>
        </div>
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaved}
            className="rounded-full border border-violet-500/40 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-300 transition hover:bg-violet-500/20 disabled:opacity-40"
          >
            {isSaved ? 'Saved' : 'Save to Dashboard'}
          </button>
        )}
      </div>

      {/* Tab nav */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
              activeTab === tab
                ? 'bg-violet-600 text-white'
                : 'border border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {activeTab === 'Positioning' && (
            <>
              <BrandCard title="Positioning Statement" delay={0}>
                <p>{outputs.positioning_statement}</p>
              </BrandCard>
              <BrandCard title="Brand Promise" delay={0.05}>
                <p>{outputs.brand_promise}</p>
              </BrandCard>
              <BrandCard title="Brand Pillars" delay={0.1}>
                <BrandPillList items={outputs.brand_pillars} />
              </BrandCard>
            </>
          )}
          {activeTab === 'Voice & Tone' && (
            <>
              <BrandCard title="Tone Traits" delay={0}>
                <BrandPillList items={outputs.voice_tone_profile.traits} />
              </BrandCard>
              <BrandCard title="Do" delay={0.05}>
                <ul className="space-y-1.5">
                  {outputs.voice_tone_profile.do.map((d, i) => (
                    <li key={i} className="flex gap-2"><span className="text-emerald-400">✓</span>{d}</li>
                  ))}
                </ul>
              </BrandCard>
              <BrandCard title="Don't" delay={0.1}>
                <ul className="space-y-1.5">
                  {outputs.voice_tone_profile.dont.map((d, i) => (
                    <li key={i} className="flex gap-2"><span className="text-red-400">✗</span>{d}</li>
                  ))}
                </ul>
              </BrandCard>
            </>
          )}
          {activeTab === 'Personas' && (
            <div className="grid gap-4 sm:grid-cols-2">
              {outputs.personas.map((p, i) => (
                <PersonaCard key={i} persona={p} delay={i * 0.1} />
              ))}
            </div>
          )}
          {activeTab === 'Taglines' && (
            <BrandCard title="Tagline Options">
              <BrandTaglineList taglines={outputs.taglines} />
            </BrandCard>
          )}
          {activeTab === 'Elevator Pitches' && (
            <>
              <BrandCard title="Short (under 20 words)" delay={0}>
                <p className="italic">&ldquo;{outputs.elevator_pitches.short}&rdquo;</p>
              </BrandCard>
              <BrandCard title="Medium (under 60 words)" delay={0.05}>
                <p>{outputs.elevator_pitches.medium}</p>
              </BrandCard>
              <BrandCard title="Long (under 120 words)" delay={0.1}>
                <p>{outputs.elevator_pitches.long}</p>
              </BrandCard>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
