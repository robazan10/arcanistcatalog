import type { Metadata, Viewport } from 'next';
import { Nunito, Staatliches } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import CTAButtons from '@/components/CTAButtons';
import { SITE } from '@/lib/config';

const display = Staatliches({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

const sans = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.name,
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: 'es_SV',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: SITE.description,
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#1F2170',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans text-white min-h-screen">
        <Header />
        {children}
        <CTAButtons />
        <footer className="border-t-1.5 border-brand-line mt-16 pt-8 pb-28 sm:pb-10 text-center px-4">
          <p className="font-display text-lg tracking-[0.02em]">
            Arcanist&apos;s Dice &copy; {new Date().getFullYear()}
          </p>
          <p className="text-brand-lavender text-xs mt-1">
            El Salvador &middot; Dados artesanales de resina pintados a mano
          </p>
        </footer>
      </body>
    </html>
  );
}
