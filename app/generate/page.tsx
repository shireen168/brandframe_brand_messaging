'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BrandForm } from '@/components/BrandForm';
import { BrandOutput } from '@/components/BrandOutput';
import { RateLimitBadge } from '@/components/RateLimitBadge';
import { GenerationProgress } from '@/components/GenerationProgress';
import { GuestLimitPrompt } from '@/components/GuestLimitPrompt';
import { useBrandGeneration } from '@/hooks/useBrandGeneration';
import { useUser } from '@/hooks/useUser';
import { BrandFormInputs } from '@/lib/sanitize';
import { BrandOutputs } from '@/lib/brandPrompt';

export default function GeneratePage() {
  const { state, generate } = useBrandGeneration();
  const { user } = useUser();
  const [lastInputs, setLastInputs] = useState<BrandFormInputs | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const searchParams = useSearchParams();
  const [authError, setAuthError] = useState(
    searchParams.get('error') === 'auth_failed'
  );

  useEffect(() => {
    if (!authError) return;
    const t = setTimeout(() => setAuthError(false), 5000);
    return () => clearTimeout(t);
  }, [authError]);

  const isRateLimitError =
    state.status === 'error' && state.message.includes('Daily limit');

  async function handleSubmit(inputs: BrandFormInputs) {
    setLastInputs(inputs);
    setIsSaved(false);
    await generate(inputs);
  }

  async function handleSave() {
    if (!lastInputs || state.status !== 'success') return;
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: lastInputs, outputs: state.data }),
    });
    if (res.ok) setIsSaved(true);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 pb-12 pt-28">
      {authError && (
        <div className="mx-auto mb-6 max-w-2xl flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <span className="text-sm text-amber-300">
            Sign-in failed. Please try again.
          </span>
          <button
            onClick={() => setAuthError(false)}
            className="ml-4 text-lg leading-none text-amber-400 hover:text-amber-200"
          >
            ×
          </button>
        </div>
      )}

      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-white">
            Build your brand messaging
          </h1>
          <p className="text-sm text-white/40">
            Fill in your brand details and get a complete messaging strategy in seconds.
          </p>

          {state.status === 'success' ? (
            <div className="mt-4 flex justify-center">
              <RateLimitBadge
                remaining={state.remaining}
                limit={state.limit}
                type={user ? 'user' : 'guest'}
              />
            </div>
          ) : (
            !user && (
              <p className="mt-4 text-xs text-white/30">
                2 free generations today
              </p>
            )
          )}
        </div>

        {state.status !== 'success' && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <BrandForm
              onSubmit={handleSubmit}
              loading={state.status === 'loading'}
            />
            {state.status === 'loading' && (
              <div className="mt-4">
                <GenerationProgress />
              </div>
            )}
            {state.status === 'error' &&
              (isRateLimitError && !user ? (
                <div className="mt-4">
                  <GuestLimitPrompt />
                </div>
              ) : (
                <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {state.message}
                </p>
              ))}
          </div>
        )}

        {state.status === 'success' && (
          <BrandOutput
            outputs={state.data as BrandOutputs}
            companyName={lastInputs?.company_name ?? ''}
            inputs={lastInputs ?? undefined}
            onSave={user ? handleSave : undefined}
            isSaved={isSaved}
          />
        )}
      </div>
    </main>
  );
}
