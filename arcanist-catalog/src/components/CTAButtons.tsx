'use client';

import { whatsappLink } from '@/lib/config';
import { useSelectedType } from '@/lib/useSelectedType';
import { getDictionary, type Lang } from '@/i18n/dictionaries';
import { WhatsAppMark } from './icons';

export default function CTAButtons({ lang }: { lang: Lang }) {
  const t = getDictionary(lang);
  // In a section with its own message (Dice), the chat starts with it
  const type = useSelectedType();
  return (
    <div className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 sm:left-auto sm:right-6 sm:bottom-6">
      <a
        href={whatsappLink(t.whatsappTypeMessages[type] ?? t.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-main py-3 shadow-[0_8px_24px_rgba(10,10,50,0.45)]"
      >
        <WhatsAppMark />
        {t.whatsappCta}
      </a>
    </div>
  );
}
