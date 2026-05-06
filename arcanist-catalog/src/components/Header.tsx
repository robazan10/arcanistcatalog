import Image from 'next/image';
import { SITE } from '@/lib/config';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-arcane-bg/95 backdrop-blur-sm border-b border-arcane-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        <div className="relative w-10 h-10 flex-shrink-0">
          <Image
            src="/logo.jpg"
            alt="Arcanist's Dice logo"
            fill
            className="object-cover rounded-full ring-2 ring-teal/30"
            sizes="40px"
            priority
          />
        </div>
        <div>
          <h1 className="font-cinzel font-bold text-lg sm:text-xl text-white leading-tight">
            {SITE.name}
          </h1>
          <p className="text-teal text-xs hidden sm:block font-medium">{SITE.tagline}</p>
        </div>
      </div>
    </header>
  );
}
