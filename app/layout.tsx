import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });

export const metadata: Metadata = {
  title: 'BrandFrame — AI Brand Messaging Generator',
  description:
    'Turn your business inputs into a complete brand messaging strategy. Positioning, voice, personas, taglines, and elevator pitches — generated in seconds.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body className="min-h-screen bg-[#0a0a0f]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
