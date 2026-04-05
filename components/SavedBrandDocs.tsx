'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { BrandOutputs } from '@/lib/brandPrompt';

type BrandDoc = { id: string; company_name: string; created_at: string; outputs: BrandOutputs };
type Props = { docs: BrandDoc[] };

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
        <span key={i} className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs text-violet-300">{item}</span>
      ))}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
}

export function SavedBrandDocs({ docs }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [localDocs, setLocalDocs] = useState<BrandDoc[]>(docs);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteErrorId, setDeleteErrorId] = useState<string | null>(null);
  const reduced = useReducedMotion();

  async function handleDelete(id: string) {
    setDeletingId(id);
    setDeleteErrorId(null);
    try {
      const res = await fetch('/api/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setLocalDocs((prev) => prev.filter((d) => d.id !== id));
        setConfirmingDeleteId(null);
        setExpandedId(null);
      } else {
        setDeleteErrorId(id);
      }
    } catch {
      setDeleteErrorId(id);
    } finally {
      setDeletingId(null);
    }
  }

  if (localDocs.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
        <p className="text-sm text-white/30">No saved brand docs yet.</p>
        <a href="/generate" className="mt-3 inline-block text-xs text-violet-400 hover:underline">Generate your first one</a>
      </div>
    );
  }

  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 300, damping: 30 };

  return (
    <AnimatePresence mode="popLayout">
      <div className="space-y-3">
        {localDocs.map((doc, i) => (
          <motion.div key={doc.id} layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, x: 60, transition: { duration: 0.25 } }}
            transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : i * 0.07 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            <button onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-white/5">
              <div>
                <p className="font-semibold text-white">{doc.company_name}</p>
                <p className="mt-0.5 text-xs text-white/30">
                  {new Date(doc.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <motion.span
                animate={{ rotate: expandedId === doc.id ? 180 : 0 }}
                transition={spring}
                className="inline-block text-lg text-white/30"
              >
                ↓
              </motion.span>
            </button>

            <AnimatePresence>
              {expandedId === doc.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={spring}
                  className="space-y-4 border-t border-white/5 px-5 py-4"
                >
                  <Section label="Positioning Statement">
                    <p className="text-sm text-white/70">{doc.outputs.positioning_statement}</p>
                  </Section>
                  <Section label="Brand Promise">
                    <p className="text-sm text-white/70">{doc.outputs.brand_promise}</p>
                  </Section>
                  <Section label="Brand Pillars"><PillRow items={doc.outputs.brand_pillars} /></Section>
                  <Section label="Tone Traits"><PillRow items={doc.outputs.voice_tone_profile.traits} /></Section>
                  <Section label="Do">
                    <ul className="space-y-1">
                      {doc.outputs.voice_tone_profile.do.map((d, j) => (
                        <li key={j} className="flex gap-2 text-sm text-white/60"><span className="text-emerald-400">✓</span>{d}</li>
                      ))}
                    </ul>
                  </Section>
                  <Section label="Don't">
                    <ul className="space-y-1">
                      {doc.outputs.voice_tone_profile.dont.map((d, j) => (
                        <li key={j} className="flex gap-2 text-sm text-white/60"><span className="text-red-400">✗</span>{d}</li>
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
                      <p className="text-xs uppercase tracking-wider text-white/30">Short</p>
                      <p className="text-sm italic text-white/60">&ldquo;{doc.outputs.elevator_pitches.short}&rdquo;</p>
                      <p className="text-xs uppercase tracking-wider text-white/30">Medium</p>
                      <p className="text-sm text-white/60">{doc.outputs.elevator_pitches.medium}</p>
                      <p className="text-xs uppercase tracking-wider text-white/30">Long</p>
                      <p className="text-sm text-white/60">{doc.outputs.elevator_pitches.long}</p>
                    </div>
                  </Section>

                  <div className="border-t border-white/5 pt-4">
                    {deleteErrorId === doc.id && (
                      <p className="mb-2 text-xs text-red-400">Failed to delete. Try again.</p>
                    )}
                    {confirmingDeleteId === doc.id ? (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-white/50">Delete this doc?</span>
                        <button onClick={() => handleDelete(doc.id)} disabled={deletingId === doc.id}
                          className="text-sm font-medium text-red-400 hover:text-red-300 disabled:opacity-40 transition">
                          {deletingId === doc.id ? 'Deleting...' : 'Confirm'}
                        </button>
                        <button onClick={() => { setConfirmingDeleteId(null); setDeleteErrorId(null); }}
                          className="text-sm text-white/30 hover:text-white/60 transition">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmingDeleteId(doc.id)}
                        className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition">
                        <TrashIcon />Delete
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}
