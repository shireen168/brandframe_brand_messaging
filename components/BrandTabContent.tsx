'use client';

import { BrandOutputs } from '@/lib/brandPrompt';
import { BrandFormInputs } from '@/lib/sanitize';
import { BrandCard, BrandPillList, BrandTaglineList, PersonaCard } from './BrandCard';
import { VoiceInAction } from './VoiceInAction';

type Tab = 'Positioning' | 'Voice & Tone' | 'Personas' | 'Taglines' | 'Elevator Pitches' | 'Voice in Action';

type Props = {
  activeTab: Tab;
  outputs: BrandOutputs;
  inputs?: BrandFormInputs;
  regenerating: string | null;
  onRegenerate: (section: string) => Promise<void>;
};

export function BrandTabContent({ activeTab, outputs, inputs, regenerating, onRegenerate }: Props) {
  const regen = (section: string) => inputs ? () => onRegenerate(section) : undefined;
  const isRegen = (section: string) => regenerating === section;

  if (activeTab === 'Positioning') return (
    <div className="space-y-4">
      <BrandCard title="Positioning Statement" delay={0} copyText={outputs.positioning_statement}
        onRegenerate={regen('positioning_statement')} isRegenerating={isRegen('positioning_statement')}>
        <p>{outputs.positioning_statement}</p>
      </BrandCard>
      <BrandCard title="Brand Promise" delay={0.05} copyText={outputs.brand_promise}
        onRegenerate={regen('brand_promise')} isRegenerating={isRegen('brand_promise')}>
        <p>{outputs.brand_promise}</p>
      </BrandCard>
      <BrandCard title="Brand Pillars" delay={0.1} copyText={outputs.brand_pillars.join('\n')}
        onRegenerate={regen('brand_pillars')} isRegenerating={isRegen('brand_pillars')}>
        <BrandPillList items={outputs.brand_pillars} />
      </BrandCard>
    </div>
  );

  if (activeTab === 'Voice & Tone') return (
    <div className="space-y-4">
      <BrandCard title="Tone Traits" delay={0} copyText={outputs.voice_tone_profile.traits.join('\n')}
        onRegenerate={regen('voice_tone_profile')} isRegenerating={isRegen('voice_tone_profile')}>
        <BrandPillList items={outputs.voice_tone_profile.traits} />
      </BrandCard>
      <BrandCard title="Do" delay={0.05} copyText={outputs.voice_tone_profile.do.map(d => `✓ ${d}`).join('\n')}
        isRegenerating={isRegen('voice_tone_profile')}>
        <ul className="space-y-2">
          {outputs.voice_tone_profile.do.map((d, i) => (
            <li key={i} className="flex gap-2"><span className="text-emerald-400 font-bold">✓</span>{d}</li>
          ))}
        </ul>
      </BrandCard>
      <BrandCard title="Don't" delay={0.1} copyText={outputs.voice_tone_profile.dont.map(d => `✗ ${d}`).join('\n')}
        isRegenerating={isRegen('voice_tone_profile')}>
        <ul className="space-y-2">
          {outputs.voice_tone_profile.dont.map((d, i) => (
            <li key={i} className="flex gap-2"><span className="text-red-400 font-bold">✗</span>{d}</li>
          ))}
        </ul>
      </BrandCard>
    </div>
  );

  if (activeTab === 'Personas') return (
    <div className="grid gap-4 sm:grid-cols-2">
      {outputs.personas.map((p, i) => (
        <PersonaCard key={i} persona={p} delay={i * 0.1} />
      ))}
    </div>
  );

  if (activeTab === 'Taglines') return (
    <BrandCard title="Tagline Options" copyText={outputs.taglines.join('\n')}
      onRegenerate={regen('taglines')} isRegenerating={isRegen('taglines')}>
      <BrandTaglineList taglines={outputs.taglines} />
    </BrandCard>
  );

  if (activeTab === 'Elevator Pitches') return (
    <div className="space-y-4">
      <BrandCard title="Short (under 20 words)" delay={0} copyText={outputs.elevator_pitches.short}
        onRegenerate={regen('elevator_pitches')} isRegenerating={isRegen('elevator_pitches')}>
        <p className="text-lg italic text-white">&ldquo;{outputs.elevator_pitches.short}&rdquo;</p>
      </BrandCard>
      <BrandCard title="Medium (under 60 words)" delay={0.05} copyText={outputs.elevator_pitches.medium}
        isRegenerating={isRegen('elevator_pitches')}>
        <p>{outputs.elevator_pitches.medium}</p>
      </BrandCard>
      <BrandCard title="Long (under 120 words)" delay={0.1} copyText={outputs.elevator_pitches.long}
        isRegenerating={isRegen('elevator_pitches')}>
        <p>{outputs.elevator_pitches.long}</p>
      </BrandCard>
    </div>
  );

  if (activeTab === 'Voice in Action') return (
    <VoiceInAction
      outputs={outputs}
      onRegenerate={regen('voice_examples')}
      isRegenerating={isRegen('voice_examples')}
    />
  );

  return null;
}
