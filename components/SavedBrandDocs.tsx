'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandOutputs } from '@/lib/brandPrompt';

type BrandDoc = {
  id: string;
  company_name: string;
  created_at: string;
  outputs: BrandOutputs;
};

type Props = {
  docs: BrandDoc[];
};

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-widest text-violet-400">{label}</p>
      {children}
    </div>
  );
}

function PillRow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <span key={i} className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs text-violet-300">
          {item}
        </span>
      ))}
    </div>
  );
}

export function SavedBrandDocs({ docs }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (docs.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
        <p className="text-sm text-white/30">No saved brand docs yet.</p>
        <a href="/generate" className="mt-3 inline-block text-xs text-violet-400 hover:underline">
          Generate your first one
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {docs.map((doc, i) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
        >
          <button
            onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/5"
          >
            <div>
              <p className="font-semibold text-white">{doc.company_name}</p>
              <p className="mt-0.5 text-xs text-white/30">
                {new Date(doc.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </p>
            </div>
            <span className={`text-lg text-white/30 transition-transform ${expandedId === doc.id ? 'rotate-180' : ''}`}>
              ↓
            </span>
          </button>

          <AnimatePresence>
            {expandedId === doc.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 border-t border-white/5 px-5 py-4"
              >
                <Section label="Positioning Statement">
                  <p className="text-sm text-white/70">{doc.outputs.positioning_statement}</p>
                </Section>
                <Section label="Brand Promise">
                  <p className="text-sm text-white/70">{doc.outputs.brand_promise}</p>
                </Section>
                <Section label="Brand Pillars">
                  <PillRow items={doc.outputs.brand_pillars} />
                </Section>
                <Section label="Tone Traits">
                  <PillRow items={doc.outputs.voice_tone_profile.traits} />
                </Section>
                <Section label="Do">
                  <ul className="space-y-1">
                    {doc.outputs.voice_tone_profile.do.map((d, j) => (
                      <li key={j} className="flex gap-2 text-sm text-white/60">
                        <span className="text-emerald-400">✓</span>{d}
                      </li>
                    ))}
                  </ul>
                </Section>
                <Section label="Don't">
                  <ul className="space-y-1">
                    {doc.outputs.voice_tone_profile.dont.map((d, j) => (
                      <li key={j} className="flex gap-2 text-sm text-white/60">
                        <span className="text-red-400">✗</span>{d}
                      </li>
                    ))}
                  </ul>
                </Section>
                <Section label="Personas">
                  <div className="space-y-2">
                    {doc.outputs.personas.map((p, j) => (
                      <div key={j} className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="text-sm font-semibold text-white">{p.name} <span className="text-xs font-normal text-white/40">{p.role}</span></p>
                        <p className="mt-1 text-xs text-emerald-400/80"><span className="font-medium">Needs: </span>{p.what_they_need}</p>
                      </div>
                    ))}
                  </div>
                </Section>
                <Section label="Taglines">
                  <ul className="space-y-1">
                    {doc.outputs.taglines.map((t, j) => (
                      <li key={j} className="text-xs italic text-white/50">&ldquo;{t}&rdquo;</li>
                    ))}
                  </ul>
                </Section>
                <Section label="Elevator Pitches">
                  <div className="space-y-2">
                    <p className="text-xs text-white/30 uppercase tracking-wider">Short</p>
                    <p className="text-sm italic text-white/60">&ldquo;{doc.outputs.elevator_pitches.short}&rdquo;</p>
                    <p className="text-xs text-white/30 uppercase tracking-wider">Medium</p>
                    <p className="text-sm text-white/60">{doc.outputs.elevator_pitches.medium}</p>
                    <p className="text-xs text-white/30 uppercase tracking-wider">Long</p>
                    <p className="text-sm text-white/60">{doc.outputs.elevator_pitches.long}</p>
                  </div>
                </Section>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
