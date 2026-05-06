import type { Metadata } from 'next';
import { Cinzel, Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import CTAButtons from '@/components/CTAButtons';
import { SITE } from '@/lib/config';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '600', '700', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: SITE.name,
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: 'es_SV',
    type: 'website',
    images: [{ url: `${SITE.url}/logo.jpg`, width: 1080, height: 1080 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.name,
    description: SITE.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${cinzel.variable} ${inter.variable} font-sans bg-arcane-bg text-white min-h-screen`}>
        <Header />
        {children}
        <CTAButtons />
        <footer className="border-t border-arcane-border mt-20 py-10 text-center">
          <p className="font-cinzel text-silver/70 text-sm">
            Arcanist&apos;s Dice &copy; {new Date().getFullYear()}
          </p>
          <p className="text-silver/40 text-xs mt-1">
            El Salvador &middot; Dados artesanales de resina pintados a mano
          </p>
        </footer>
      </body>
    </html>
  );
}
