import { SOCIAL } from '@/lib/config';
import { WhatsAppMark } from './icons';

export default function CTAButtons() {
  const whatsappUrl = `${SOCIAL.whatsapp}?text=${encodeURIComponent(SOCIAL.whatsappMessage)}`;

  return (
    <div className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 sm:left-auto sm:right-6 sm:bottom-6">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-main py-3 shadow-[0_8px_24px_rgba(10,10,50,0.45)]"
      >
        <WhatsAppMark />
        Escríbenos por WhatsApp
      </a>
    </div>
  );
}
