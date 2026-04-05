'use client';

import { motion, useReducedMotion } from 'framer-motion';

const ORBS = [
  {
    size: 600,
    color: 'bg-violet-700',
    opacity: 'opacity-[0.18]',
    style: { top: '-10%', left: '-10%' } as React.CSSProperties,
    animate: { x: [0, 30, -20, 0], y: [0, -25, 15, 0] },
    duration: 20,
  },
  {
    size: 400,
    color: 'bg-indigo-600',
    opacity: 'opacity-[0.15]',
    style: { bottom: '-5%', right: '-5%' } as React.CSSProperties,
    animate: { x: [0, -25, 20, 0], y: [0, 20, -15, 0] },
    duration: 15,
  },
  {
    size: 300,
    color: 'bg-violet-500',
    opacity: 'opacity-[0.12]',
    style: { top: '40%', right: '15%' } as React.CSSProperties,
    animate: { x: [0, 20, -30, 10, 0], y: [0, -20, 10, -5, 0] },
    duration: 25,
  },
];

export function AnimatedBackground() {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          animate={reduced ? {} : orb.animate}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
          className={`absolute rounded-full blur-[120px] ${orb.color} ${orb.opacity}`}
          style={{ width: orb.size, height: orb.size, ...orb.style }}
        />
      ))}
    </div>
  );
}
