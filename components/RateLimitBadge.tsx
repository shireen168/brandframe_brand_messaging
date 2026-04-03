'use client';

type Props = {
  remaining: number;
  limit: number;
  type: 'guest' | 'user';
};

export function RateLimitBadge({ remaining, limit, type }: Props) {
  const isLow = remaining <= 1;
  const isEmpty = remaining === 0;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition ${
        isEmpty
          ? 'border-red-500/40 bg-red-500/10 text-red-400'
          : isLow
          ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
          : 'border-white/10 bg-white/5 text-white/50'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isEmpty ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
        }`}
      />
      {isEmpty
        ? 'Daily limit reached'
        : `${remaining} of ${limit} generation${limit !== 1 ? 's' : ''} remaining`}
      {type === 'guest' && !isEmpty && (
        <span className="text-white/30">· Sign in for more</span>
      )}
    </div>
  );
}
