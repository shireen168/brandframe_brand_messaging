'use client';

import { BrandOutputs } from '@/lib/brandPrompt';
import { BrandCard } from './BrandCard';

type Props = {
  outputs: BrandOutputs;
  onRegenerate?: () => Promise<void>;
  isRegenerating?: boolean;
};

export function VoiceInAction({ outputs, onRegenerate, isRegenerating }: Props) {
  const ex = outputs.voice_examples;

  if (!ex) {
    return (
      <p className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/40">
        Voice examples are only available for newly generated brand docs. Re-generate to get them.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <BrandCard
        title="LinkedIn Post"
        copyText={ex.linkedin}
        onRegenerate={onRegenerate}
        isRegenerating={isRegenerating}
      >
        <p className="whitespace-pre-line">{ex.linkedin}</p>
      </BrandCard>

      <BrandCard title="Instagram Caption" copyText={ex.instagram}>
        <p className="whitespace-pre-line">{ex.instagram}</p>
      </BrandCard>

      <BrandCard title="Email Subject Line" copyText={ex.email_subject}>
        <p className="font-semibold text-white">{ex.email_subject}</p>
        <p className="mt-1 text-sm text-white/40">
          {ex.email_subject.length} characters
        </p>
      </BrandCard>
    </div>
  );
}
