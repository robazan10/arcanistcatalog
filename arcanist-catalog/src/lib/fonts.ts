import { Nunito, Staatliches } from 'next/font/google';

export const displayFont = Staatliches({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

export const sansFont = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sans',
});
