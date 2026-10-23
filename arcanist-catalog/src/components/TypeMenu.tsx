'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { MenuType } from '@/lib/types';
import { writeTypeToUrl } from '@/lib/productType';
import { useSelectedType } from '@/lib/useSelectedType';
import { getDictionary, typeName, type Lang } from '@/i18n/dictionaries';
import { DieIcon, FigureIcon, GridIcon, KeycapIcon, MenuIcon } from './icons';

const TYPE_ICONS: Record<string, typeof GridIcon> = { figures: FigureIcon, keycaps: KeycapIcon, dice: DieIcon };

interface Props {
  types: MenuType[];
  total: number;
  lang: Lang;
}

// Menu button in the header and the side panel it opens: "Todo" plus each product type
export default function TypeMenu({ types, total, lang }: Props) {
  const t = getDictionary(lang);
  const selected = useSelectedType();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const current = types.find(type => type.id === selected);
  const currentName = current ? typeName(t, current.id, current.name) : undefined;

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  // While open: the page behind doesn't scroll, focus stays in the panel, Escape closes it
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('button');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const choose = (type: string) => {
    writeTypeToUrl(type);
    setOpen(false);
    window.scrollTo({ top: 0 });
    buttonRef.current?.focus();
  };

  const item = (id: string, label: string, Icon: typeof GridIcon, count: number | null) => {
    const active = selected === id || (!id && !current);
    return (
      <button
        key={id || 'all'}
        onClick={() => choose(id)}
        aria-current={active ? 'page' : undefined}
        className={`flex items-center gap-3 w-full rounded-card border-1.5 px-3 py-3 text-left transition-colors duration-150 ${
          active ? 'bg-brand-mint/[0.12] border-brand-mint text-brand-mint' : 'border-transparent hover:border-brand-line'
        }`}
      >
        <span
          className={`grid place-items-center w-[34px] h-[34px] flex-shrink-0 rounded-[10px] border-1.5 bg-white/[0.07] ${
            active ? 'border-brand-mint' : 'border-brand-line text-brand-lavender'
          }`}
        >
          <Icon />
        </span>
        <span className="font-display text-[22px] leading-none tracking-[0.03em]">{label}</span>
        {count === null ? (
          <span className="badge-mint ml-auto">{t.typeSoon}</span>
        ) : (
          <span className={`ml-auto text-sm font-extrabold ${active ? '' : 'text-brand-lavender'}`}>{count}</span>
        )}
      </button>
    );
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen(true)}
        aria-label={t.menuLabel(currentName)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="relative grid place-items-center w-9 h-9 flex-shrink-0 rounded-card border-1.5 border-brand-line bg-white/[0.07] text-brand-lavender transition-colors duration-150 hover:border-brand-mint hover:text-white"
      >
        <MenuIcon />
        {current && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand-mint border-2 border-brand-deep" aria-hidden="true" />
        )}
      </button>

      {/* In <body>, not the header: the header's backdrop blur would trap a fixed panel inside it */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-50" onClick={close}>
            <div className="absolute inset-0 bg-[rgba(11,12,44,0.62)] backdrop-blur-sm" aria-hidden="true" />
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="type-menu-title"
              onClick={e => e.stopPropagation()}
              className="absolute inset-y-0 left-0 w-[300px] max-w-[85vw] flex flex-col bg-brand-field border-r-1.5 border-brand-line shadow-[12px_0_32px_rgba(10,10,50,0.5)] motion-safe:animate-slide-in"
            >
              <div className="flex items-center gap-2.5 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3.5 border-b-1.5 border-brand-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/isotype-white.svg" alt="" className="w-[30px] h-auto" />
                <p id="type-menu-title" className="font-display text-2xl leading-none tracking-[0.02em]">
                  {t.menuTitle}
                </p>
                <button
                  ref={closeRef}
                  onClick={close}
                  aria-label={t.close}
                  className="ml-auto grid place-items-center w-9 h-9 rounded-card border-1.5 border-brand-line bg-white/[0.07] text-xl leading-none transition-colors duration-150 hover:border-brand-mint"
                >
                  &times;
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-2.5 overflow-y-auto">
                {item('', t.allTypes, GridIcon, total)}
                {types.map(type =>
                  item(
                    type.id,
                    typeName(t, type.id, type.name),
                    TYPE_ICONS[type.id] ?? GridIcon,
                    type.count > 0 ? type.count : null
                  )
                )}
              </nav>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
