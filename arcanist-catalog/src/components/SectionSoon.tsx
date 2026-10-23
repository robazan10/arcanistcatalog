import type { MenuType } from '@/lib/types';
import { typeName, type Dictionary } from '@/i18n/dictionaries';

interface Props {
  type: string;
  // Types with products, offered as a way out
  others: MenuType[];
  onChoose: (type: string) => void;
  t: Dictionary;
}

// A type in the menu with no products yet (Dice): what's coming, and where to go meanwhile
export default function SectionSoon({ type, others, onChoose, t }: Props) {
  return (
    <div className="panel mt-4 p-4 text-center">
      <div className="bg-coming-soon relative h-[150px] rounded-[10px] grid place-items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/isotype-white.svg" alt="" className="w-[72px] h-auto opacity-30" />
        <span className="badge-mint absolute bottom-2 left-2">{t.sectionSoon}</span>
      </div>
      <h2 className="font-display text-2xl leading-tight tracking-[0.02em] mt-3.5">{t.sectionSoonTitle}</h2>
      <p className="text-brand-lavender text-sm leading-relaxed mt-1.5">
        {t.sectionSoonText[type] ?? t.sectionSoonFallback}
      </p>
      {others.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-3.5">
          {others.map(other => (
            <button key={other.id} onClick={() => onChoose(other.id)} className="btn-secondary">
              {t.seeType(typeName(t, other.id, other.name))}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
