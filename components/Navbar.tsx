'use client';

import Link from 'next/link';
import { AuthButton } from './AuthButton';
import { useUser } from '@/hooks/useUser';

export function Navbar() {
  const { user } = useUser();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-violet-500" />
          <span className="text-sm font-semibold text-white">BrandFrame</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/generate"
            className="hidden text-sm text-white/50 transition hover:text-white sm:block"
          >
            Generate
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="hidden text-sm text-white/50 transition hover:text-white sm:block"
            >
              Dashboard
            </Link>
          )}
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
