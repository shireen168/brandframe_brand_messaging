import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { SavedBrandDocs } from '@/components/SavedBrandDocs';
import { BrandOutputs } from '@/lib/brandPrompt';

type BrandDoc = {
  id: string;
  company_name: string;
  created_at: string;
  outputs: BrandOutputs;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/generate');
  }

  const { data: docs, error } = await supabase
    .from('brand_docs')
    .select('id, company_name, created_at, outputs')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[dashboard] Supabase fetch error:', error.message);
  }

  const typedDocs: BrandDoc[] = (docs ?? []).map((d) => ({
    id: d.id as string,
    company_name: d.company_name as string,
    created_at: d.created_at as string,
    outputs: d.outputs as BrandOutputs,
  }));

  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 pb-12 pt-24">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-violet-400">Dashboard</p>
          <h1 className="mt-1 text-2xl font-bold text-white">Saved Brand Docs</h1>
          <p className="mt-1 text-sm text-white/30">
            {typedDocs.length} document{typedDocs.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <SavedBrandDocs docs={typedDocs} />
      </div>
    </main>
  );
}
