'use client';

import { createClient } from '@/lib/supabase-browser';
import { useUser } from '@/hooks/useUser';

export function AuthButton() {
  const { user, loading } = useUser();
  const supabase = createClient();

  async function handleSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  if (loading) {
    return (
      <div className="h-9 w-28 animate-pulse rounded-full bg-white/10" />
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-white/60 sm:block">
          {user.email}
        </span>
        <button
          onClick={handleSignOut}
          className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 transition hover:border-white/40 hover:text-white"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="group relative overflow-hidden rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-violet-500"
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 ease-in-out group-hover:translate-x-full" />
      Sign in with Google
    </button>
  );
}
