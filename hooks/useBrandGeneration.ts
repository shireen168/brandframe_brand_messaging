'use client';

import { useState } from 'react';
import { BrandFormInputs } from '@/lib/sanitize';
import { BrandOutputs } from '@/lib/brandPrompt';

type GenerationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: BrandOutputs }
  | { status: 'error'; message: string };

type UseBrandGenerationReturn = {
  state: GenerationState;
  generate: (inputs: BrandFormInputs) => Promise<void>;
  reset: () => void;
};

export function useBrandGeneration(): UseBrandGenerationReturn {
  const [state, setState] = useState<GenerationState>({ status: 'idle' });

  async function generate(inputs: BrandFormInputs) {
    setState({ status: 'loading' });

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });

      const json = await res.json();

      if (!res.ok) {
        setState({ status: 'error', message: json.error ?? 'Generation failed.' });
        return;
      }

      setState({ status: 'success', data: json.outputs as BrandOutputs });
    } catch {
      setState({
        status: 'error',
        message: 'Network error. Please try again.',
      });
    }
  }

  function reset() {
    setState({ status: 'idle' });
  }

  return { state, generate, reset };
}
