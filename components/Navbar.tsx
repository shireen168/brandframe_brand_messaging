'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useReducedMotion } from 'framer-motion';
import { AuthButton } from './AuthButton';
import { useUser } from '@/hooks/useUser';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const reduced = useReducedMotion();
  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Link href={href} className="hidden text-sm text-white/50 transition hover:text-white sm:block">
        {children}
      </Link>
      {!reduced && (
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-violet-500 origin-left"
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ width: '100%' }}
        />
      )}
    </div>
  );
}

export function Navbar() {
  const { user } = useUser();
  const { scrollY } = useScroll();
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (v) => setScrolled(v > 10));
  }, [scrollY]);

  return (
    <motion.nav
      animate={reduced ? {} : {
        borderBottomColor: scrolled ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.05)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(12px)',
      }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80"
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <motion.span
              className="h-2 w-2 rounded-full bg-violet-500"
              animate={reduced ? {} : { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="text-sm font-semibold text-white">BrandFrame</span>
          </div>
          <span className="pl-4 text-[10px] text-white/20">Built by Shireen · Powered by Claude Code</span>
        </Link>

        <div className="flex items-center gap-4">
          <NavLink href="/generate">Generate</NavLink>
          {user && <NavLink href="/dashboard">Dashboard</NavLink>}
          <AuthButton />
        </div>
      </div>
    </motion.nav>
  );
}
