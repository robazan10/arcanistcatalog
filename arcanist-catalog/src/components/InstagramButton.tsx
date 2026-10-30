'use client';

import { SOCIAL } from '@/lib/config';
import { track } from '@/lib/analytics';
import { InstagramIcon } from './icons';

// The header's Instagram button; a client component only to count its clicks
export default function InstagramButton({ label }: { label: string }) {
  return (
    <a
      href={SOCIAL.instagram}
      onClick={() => track('instagram_click')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid place-items-center w-11 h-11 flex-shrink-0 rounded-card border-1.5 border-brand-line bg-white/[0.07] text-brand-lavender transition-colors duration-150 hover:border-brand-mint hover:text-white"
    >
      <InstagramIcon className="w-[18px] h-[18px]" />
    </a>
  );
}
