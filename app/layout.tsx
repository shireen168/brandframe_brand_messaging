import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: 'BrandFrame: AI Brand Messaging Generator',
  description:
    'Turn your business inputs into a complete brand messaging strategy. Positioning, voice, personas, taglines, and elevator pitches. Generated in seconds.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body className="min-h-screen bg-[#0a0a0f]">
        <AnimatedBackground />
        <div className="relative z-10">
        <Navbar />
        {children}
        <footer className="border-t border-white/5 py-5 text-center text-xs text-white/20">
          Built by{' '}
          <a
            href="https://github.com/shireen-mvps"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 transition hover:text-violet-400"
          >
            Shireen
          </a>
          {' · '}Powered by Claude Code
        </footer>
        </div>
      </body>
    </html>
  );
}
