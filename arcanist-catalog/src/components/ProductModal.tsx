'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { SOCIAL } from '@/lib/config';
import { ArrowIcon, InstagramIcon, WhatsAppMark } from './icons';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // The gallery is a scroll-snap strip; its scroll position is the source of truth for the index
  const indexFromScroll = () => {
    const el = galleryRef.current;
    return el ? Math.round(el.scrollLeft / el.clientWidth) : 0;
  };

  const goTo = useCallback((i: number) => {
    const el = galleryRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const lastIndex = product.images.length - 1;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goTo(Math.min(indexFromScroll() + 1, lastIndex));
      if (e.key === 'ArrowLeft') goTo(Math.max(indexFromScroll() - 1, 0));
    };
    window.addEventListener('keydown', handleKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = overflow;
    };
  }, [product, onClose, goTo]);

  if (!product) return null;

  const whatsappUrl = `${SOCIAL.whatsapp}?text=${encodeURIComponent(
    `Hola! Me interesa el producto: ${product.name}`
  )}`;
  const hasMany = product.images.length > 1;

  const onGalleryScroll = () => setCurrentIndex(indexFromScroll());

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-6 bg-[rgba(15,16,60,0.6)] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
        className="w-full md:max-w-4xl max-h-[92dvh] overflow-y-auto bg-brand-field border-t-1.5 md:border-1.5 border-brand-line rounded-t-[20px] md:rounded-[20px] md:flex"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-[5px] w-10 rounded-full bg-brand-line mx-auto my-2 md:hidden" aria-hidden="true" />

        {/* Galeria */}
        <div className="relative md:w-3/5 flex-shrink-0">
          <div
            key={product.id}
            ref={galleryRef}
            onScroll={onGalleryScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-brand-deep"
          >
            {product.images.map((img, i) => (
              <div key={img.filename} className="relative aspect-square w-full flex-none snap-center">
                <Image
                  src={img.url}
                  alt={`${product.name} - imagen ${i + 1} de ${product.images.length}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-2.5 right-2.5 grid place-items-center w-9 h-9 rounded-card border-1.5 border-brand-line bg-brand-deep/80 text-xl leading-none transition-colors duration-150 hover:border-brand-mint"
          >
            &times;
          </button>

          {hasMany && (
            <>
              {currentIndex > 0 && (
                <button
                  onClick={() => goTo(currentIndex - 1)}
                  aria-label="Imagen anterior"
                  className="hidden md:grid absolute left-3 top-1/2 -translate-y-1/2 place-items-center w-10 h-10 rounded-full border-1.5 border-brand-line bg-brand-deep/80 transition-colors duration-150 hover:border-brand-mint"
                >
                  <ArrowIcon dir="left" />
                </button>
              )}
              {currentIndex < product.images.length - 1 && (
                <button
                  onClick={() => goTo(currentIndex + 1)}
                  aria-label="Imagen siguiente"
                  className="hidden md:grid absolute right-3 top-1/2 -translate-y-1/2 place-items-center w-10 h-10 rounded-full border-1.5 border-brand-line bg-brand-deep/80 transition-colors duration-150 hover:border-brand-mint"
                >
                  <ArrowIcon dir="right" />
                </button>
              )}
              <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-[5px]" aria-hidden="true">
                {product.images.map((img, i) => (
                  <span
                    key={img.filename}
                    className={`h-1.5 rounded-full transition-all duration-150 ${
                      i === currentIndex ? 'w-[18px] bg-brand-gradient' : 'w-1.5 bg-white/45'
                    }`}
                  />
                ))}
              </div>
              <p className="sr-only" aria-live="polite">
                Imagen {currentIndex + 1} de {product.images.length}
              </p>
            </>
          )}
        </div>

        {/* Informacion */}
        <div className="flex flex-col md:w-2/5 md:min-h-full">
          <div className="px-4 pt-3.5 md:p-5">
            <h2 id="product-title" className="text-[32px] leading-none">
              {product.name}
            </h2>
            <span className="badge mt-2">{product.category}</span>
            {product.brand !== product.category && (
              <p className="text-brand-lavender text-sm mt-2">
                Marca: <span className="text-white font-semibold">{product.brand}</span>
              </p>
            )}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {product.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs text-brand-lavender border-1.5 border-brand-line rounded-full px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-2.5 px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:p-5">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-main py-3">
              <WhatsAppMark />
              Consultar este producto
            </a>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <InstagramIcon className="w-[18px] h-[18px]" />
              Ver en Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
