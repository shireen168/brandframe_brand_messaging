'use client';

import { motion } from 'framer-motion';

type Props = {
  title: string;
  children: React.ReactNode;
  delay?: number;
};

export function BrandCard({ title, children, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
    >
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-400">
        {title}
      </h3>
      <div className="text-sm leading-relaxed text-white/80">{children}</div>
    </motion.div>
  );
}

export function BrandPillList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <li
          key={i}
          className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-300"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export function BrandTaglineList({ taglines }: { taglines: string[] }) {
  return (
    <ol className="space-y-2">
      {taglines.map((t, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600/30 text-xs font-bold text-violet-300">
            {i + 1}
          </span>
          <span className="italic">&ldquo;{t}&rdquo;</span>
        </li>
      ))}
    </ol>
  );
}

export function PersonaCard({
  persona,
  delay,
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
        <span className="font-semibold text-white">{persona.name}</span>
        <span className="ml-2 text-xs text-white/40">{persona.role}</span>
      </div>
      <ul className="mb-2 space-y-1">
        {persona.pain_points.map((p, i) => (
          <li key={i} className="flex gap-2 text-xs text-white/60">
            <span className="text-red-400">•</span> {p}
          </li>
        ))}
      </ul>
      <p className="text-xs text-emerald-400/80">
        <span className="font-medium">Needs: </span>
        {persona.what_they_need}
      </p>
    </motion.div>
  );
}
