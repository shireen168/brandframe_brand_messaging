'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function AuthErrorBanner() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(
    searchParams.get('error') === 'auth_failed'
  );

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="mx-auto mb-6 max-w-2xl flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
      <span className="text-sm text-amber-300">Sign-in failed. Please try again.</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-4 text-lg leading-none text-amber-400 hover:text-amber-200"
      >
        ×
      </button>
    </div>
  );
}
