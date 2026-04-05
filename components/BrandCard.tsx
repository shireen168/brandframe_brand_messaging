'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  title: string;
  children: React.ReactNode;
  delay?: number;
  copyText?: string;
  onRegenerate?: () => Promise<void>;
  isRegenerating?: boolean;
};

function ClipboardIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function RefreshIcon({ spinning }: { spinning?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={spinning ? 'animate-spin' : ''}>
      <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

export function BrandCard({ title, children, delay = 0, copyText, onRegenerate, isRegenerating }: Props) {
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();

  function handleCopy() {
    if (!copyText) return;
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={reduced ? {} : { scale: 1.005 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:border-violet-500/30 hover:shadow-[0_0_24px_rgba(139,92,246,0.1)]"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-violet-300">{title}</h3>
        <div className="flex items-center gap-1.5">
          {onRegenerate && (
            <motion.button
              onClick={onRegenerate}
              disabled={isRegenerating}
              title="Regenerate (uses 1 credit)"
              whileHover={reduced ? {} : { scale: 1.1 }}
              whileTap={reduced ? {} : { scale: 0.9 }}
              className="rounded-md p-1.5 text-white/30 transition hover:text-violet-400 disabled:opacity-40"
            >
              <RefreshIcon spinning={isRegenerating} />
            </motion.button>
          )}
          {copyText && (
            <motion.button
              onClick={handleCopy}
              aria-label={copied ? 'Copied' : 'Copy to clipboard'}
              whileHover={reduced ? {} : { scale: 1.1 }}
              whileTap={reduced ? {} : { scale: 0.9 }}
              className="rounded-md p-1.5 text-white/30 transition hover:text-violet-400"
            >
              {copied ? <CheckIcon /> : <ClipboardIcon />}
            </motion.button>
          )}
        </div>
      </div>
      <div className="text-base leading-relaxed text-white/90">{children}</div>
    </motion.div>
  );
}

export function BrandPillList({ items }: { items: string[] }) {
  const reduced = useReducedMotion();
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <motion.li
          key={i}
          whileHover={reduced ? {} : { scale: 1.05 }}
          className="cursor-default rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-200 transition hover:border-violet-500/70"
        >
          {item}
        </motion.li>
      ))}
    </ul>
  );
}

export function BrandTaglineList({ taglines }: { taglines: string[] }) {
  return (
    <ol className="space-y-3">
      {taglines.map((t, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600/30 text-xs font-bold text-violet-300">
            {i + 1}
          </span>
          <span className="text-base italic text-white/90">&ldquo;{t}&rdquo;</span>
        </li>
      ))}
    </ol>
  );
}

export function PersonaCard({
  persona, delay,
}: {
  persona: { name: string; role: string; pain_points: string[]; what_they_need: string };
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-xl border border-white/10 bg-white/5 p-4"
    >
      <div className="mb-2">
        <span className="text-base font-semibold text-white">{persona.name}</span>
        <span className="ml-2 text-sm text-white/50">{persona.role}</span>
      </div>
      <ul className="mb-2 space-y-1">
        {persona.pain_points.map((p, i) => (
          <li key={i} className="flex gap-2 text-sm text-white/70">
            <span className="text-red-400">•</span> {p}
          </li>
        ))}
      </ul>
      <p className="text-sm text-emerald-300">
        <span className="font-semibold">Needs: </span>{persona.what_they_need}
      </p>
    </motion.div>
  );
}
