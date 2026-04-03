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
          className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
        >
          <button
            onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
            className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition"
          >
            <div>
              <p className="font-semibold text-white">{doc.company_name}</p>
              <p className="text-xs text-white/30 mt-0.5">
                {new Date(doc.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            <span className={`text-white/30 text-lg transition-transform ${expandedId === doc.id ? 'rotate-180' : ''}`}>
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
                className="border-t border-white/5 px-5 py-4 space-y-3"
              >
                <div>
                  <p className="text-xs uppercase tracking-widest text-violet-400 mb-1">Positioning</p>
                  <p className="text-sm text-white/70">{doc.outputs.positioning_statement}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-violet-400 mb-1">Brand Promise</p>
                  <p className="text-sm text-white/70">{doc.outputs.brand_promise}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-violet-400 mb-1">Taglines</p>
                  <ul className="space-y-1">
                    {doc.outputs.taglines.slice(0, 3).map((t, j) => (
                      <li key={j} className="text-xs italic text-white/50">&ldquo;{t}&rdquo;</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
