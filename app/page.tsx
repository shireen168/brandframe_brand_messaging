import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] px-4 text-center">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/20 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-400">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          AI Brand Strategist
        </div>

        <h1 className="mb-5 text-4xl font-bold leading-tight text-white sm:text-5xl">
          Your brand voice,{' '}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            defined in seconds
          </span>
        </h1>

        <p className="mb-8 text-base text-white/50 sm:text-lg">
          BrandFrame turns your raw business inputs into a complete brand messaging
          strategy: positioning, brand promise, pillars, voice profile, personas,
          taglines, and elevator pitches.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/generate"
            className="rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            Build my brand messaging
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 px-8 py-3.5 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
          >
            View saved docs
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 text-left sm:grid-cols-4">
          {[
            { label: 'Positioning', desc: 'Market position statement' },
            { label: 'Voice Profile', desc: 'Tone dos and donts' },
            { label: 'Personas', desc: '2 detailed buyer profiles' },
            { label: 'Taglines', desc: '5 options to choose from' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 text-xs font-semibold text-violet-400">{item.label}</p>
              <p className="text-xs text-white/40">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
