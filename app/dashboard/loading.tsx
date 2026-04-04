export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 pb-12 pt-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-7 w-40 animate-pulse rounded bg-white/10" />
          <div className="mt-1.5 h-3 w-24 animate-pulse rounded bg-white/10" />
        </div>
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
              <div className="h-4 w-48 rounded bg-white/10" />
              <div className="mt-2 h-3 w-24 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
