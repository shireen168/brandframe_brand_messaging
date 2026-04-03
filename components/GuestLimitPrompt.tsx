'use client';

import { createClient } from '@/lib/supabase-browser';

export function GuestLimitPrompt() {
  async function handleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/auth/callback' },
    });
  }

  return (
    <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-6 text-center">
      <h3 className="mb-2 text-base font-semibold text-white">
        You&apos;ve used your free generations for today
      </h3>
      <p className="mb-5 text-sm text-white/50">
        Sign in with Google for 10 generations per day and save your brand docs to your dashboard.
      </p>
      <button
        onClick={handleSignIn}
        className="rounded-full bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
      >
        Sign in with Google
      </button>
    </div>
  );
}
