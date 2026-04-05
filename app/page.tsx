'use client';

import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

const HERO_WORDS = ['Your', 'brand', 'voice,'];
const TILES = [
  { label: 'Positioning', desc: 'Market position statement' },
  { label: 'Voice Profile', desc: 'Tone dos and donts' },
  { label: 'Personas', desc: '2 detailed buyer profiles' },
  { label: 'Taglines', desc: '5 options to choose from' },
  { label: 'Elevator Pitches', desc: '3 lengths, ready to use' },
];

const wordVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function Home() {
  const reduced = useReducedMotion();
  const dur = (n: number) => (reduced ? 0 : n);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="relative z-10 w-full max-w-2xl">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur(0.5) }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-400"
        >
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-violet-400"
            animate={reduced ? {} : { opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          AI Brand Strategist
        </motion.div>

        {/* Headline — word-by-word stagger */}
        <motion.h1
          className="mb-5 text-4xl font-bold leading-tight text-white sm:text-5xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: dur(0.06) } },
          }}
        >
          {HERO_WORDS.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              className="mr-[0.25em] inline-block"
            >
              {word}
            </motion.span>
          ))}
          <motion.span
            variants={wordVariant}
            className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent"
          >
            defined in seconds
          </motion.span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="mb-8 text-base text-white/50 sm:text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: dur(0.5), delay: dur(0.6) }}
        >
          BrandFrame turns your raw business inputs into a complete brand messaging
          strategy: positioning, brand promise, pillars, voice profile, personas,
          taglines, and elevator pitches.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur(0.5), delay: dur(0.75) }}
        >
          <div className="relative">
            {!reduced && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-violet-500/40"
                animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <Link
              href="/generate"
              className="relative inline-block overflow-hidden rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              Build my brand messaging
            </Link>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 px-8 py-3.5 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
          >
            View saved docs
          </Link>
        </motion.div>

        {/* Feature tiles */}
        <motion.div
          className="mt-12 grid grid-cols-2 gap-4 text-left sm:grid-cols-5"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: dur(0.1), delayChildren: dur(0.9) } },
          }}
        >
          {TILES.map((item) => (
            <motion.div
              key={item.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: dur(0.4) } },
              }}
              whileHover={reduced ? {} : { y: -2 }}
              className="cursor-default rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-violet-500/30 hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]"
            >
              <p className="mb-1 text-xs font-semibold text-violet-400">{item.label}</p>
              <p className="text-xs text-white/40">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
