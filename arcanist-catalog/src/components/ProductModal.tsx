'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import type { ProductSummary } from '@/lib/types';
import { SOCIAL, whatsappLink } from '@/lib/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { VIEWER_WIDTH, productDataUrl, sizedImage } from '@/lib/images';
import { ArrowIcon, InstagramIcon, WhatsAppMark } from './icons';

interface Props {
  product: ProductSummary | null;
  onClose: () => void;
  onTagClick: (tag: string) => void;
  t: Dictionary;
}

const VISIBLE_TAGS = 5;
// Above this many photos the dots don't fit; show a "3 / 24" counter instead
const MAX_DOTS = 8;

// Photo lists already fetched in this visit, by product id
const imageCache = new Map<string, string[]>();

export default function ProductModal({ product, onClose, onTagClick, t }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
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

  // Show the cover right away, then swap in the full photo list
  useEffect(() => {
    setCurrentIndex(0);
    setShowAllTags(false);
    if (!product?.cover) {
      setImages([]);
      return;
    }
    const cached = imageCache.get(product.id);
    setImages(cached ?? [product.cover]);
    if (cached || product.photoCount < 2) return;

    let cancelled = false;
    fetch(productDataUrl(product.id))
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { images: string[] }) => {
        imageCache.set(product.id, data.images);
        if (!cancelled) setImages(data.images);
      })
      .catch(() => {
        // Keep showing the cover alone
      });
    return () => {
      cancelled = true;
    };
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const lastIndex = images.length - 1;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goTo(Math.min(indexFromScroll() + 1, lastIndex));
      if (e.key === 'ArrowLeft') goTo(Math.max(indexFromScroll() - 1, 0));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [product, images, onClose, goTo]);

  if (!product) return null;

  const whatsappUrl = whatsappLink(t.whatsappProductMessage(product.name));
  const total = product.photoCount;
  const hasMany = total > 1;
  const hiddenTags = product.tags.length - VISIBLE_TAGS;
  const tags = showAllTags ? product.tags : product.tags.slice(0, VISIBLE_TAGS);

  const onGalleryScroll = () => setCurrentIndex(indexFromScroll());

  const closeButton = (
    <button
      ref={closeRef}
      onClick={onClose}
      aria-label={t.close}
      className="absolute top-2.5 right-2.5 grid place-items-center w-9 h-9 rounded-card border-1.5 border-brand-line bg-brand-deep/80 text-xl leading-none transition-colors duration-150 hover:border-brand-mint"
    >
      &times;
    </button>
  );

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
        {product.cover ? (
          <div className="relative md:w-3/5 flex-shrink-0">
            <div
              key={product.id}
              ref={galleryRef}
              onScroll={onGalleryScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-brand-deep"
            >
              {images.map((url, i) => (
                <div key={url} className="relative aspect-square w-full flex-none snap-center">
                  <Image
                    src={sizedImage(url, VIEWER_WIDTH)}
                    alt={`${product.name} - ${t.imageOf(i + 1, total)}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>

            {closeButton}

            {hasMany && (
              <>
                {currentIndex > 0 && (
                  <button
                    onClick={() => goTo(currentIndex - 1)}
                    aria-label={t.previousImage}
                    className="hidden md:grid absolute left-3 top-1/2 -translate-y-1/2 place-items-center w-10 h-10 rounded-full border-1.5 border-brand-line bg-brand-deep/80 transition-colors duration-150 hover:border-brand-mint"
                  >
                    <ArrowIcon dir="left" />
                  </button>
                )}
                {currentIndex < images.length - 1 && (
                  <button
                    onClick={() => goTo(currentIndex + 1)}
                    aria-label={t.nextImage}
                    className="hidden md:grid absolute right-3 top-1/2 -translate-y-1/2 place-items-center w-10 h-10 rounded-full border-1.5 border-brand-line bg-brand-deep/80 transition-colors duration-150 hover:border-brand-mint"
                  >
                    <ArrowIcon dir="right" />
                  </button>
                )}
                {total > MAX_DOTS ? (
                  <span
                    className="absolute bottom-2.5 right-2.5 rounded-full border border-brand-line bg-brand-deep/80 px-2.5 py-0.5 text-xs font-bold"
                    aria-hidden="true"
                  >
                    {currentIndex + 1} / {total}
                  </span>
                ) : (
                  <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-[5px]" aria-hidden="true">
                    {Array.from({ length: total }, (_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-150 ${
                          i === currentIndex ? 'w-[18px] bg-brand-gradient' : 'w-1.5 bg-white/45'
                        }`}
                      />
                    ))}
                  </div>
                )}
                <p className="sr-only" aria-live="polite">
                  {t.imageOf(currentIndex + 1, total)}
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="bg-coming-soon relative md:w-3/5 flex-shrink-0 aspect-[16/10] md:aspect-square grid place-items-center text-center px-6">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/isotype-white.svg" alt="" className="w-[110px] h-auto opacity-35 mx-auto mb-2.5" />
              <p className="font-display text-[22px] tracking-[0.02em]">{t.comingSoon}</p>
              <p className="text-brand-lavender text-sm max-w-[250px] mx-auto">
                {t.comingSoonText}
              </p>
            </div>
            {closeButton}
          </div>
        )}

        {/* Informacion */}
        <div className="flex flex-col md:w-2/5 md:min-h-full">
          <div className="px-4 pt-3.5 md:p-5">
            <h2 id="product-title" className="text-[32px] leading-none">
              {product.name}
            </h2>
            <span className="badge mt-2">{product.category}</span>
            {product.brand !== product.category && (
              <p className="text-brand-lavender text-sm mt-2">
                {t.brand}: <span className="text-white font-semibold">{product.brand}</span>
              </p>
            )}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => onTagClick(tag)}
                    aria-label={t.searchTag(tag)}
                    className="text-xs text-brand-lavender border-1.5 border-brand-line rounded-full px-2 py-0.5 transition-colors duration-150 hover:border-brand-mint hover:text-white"
                  >
                    {tag}
                  </button>
                ))}
                {hiddenTags > 0 && !showAllTags && (
                  <button
                    onClick={() => setShowAllTags(true)}
                    aria-label={t.moreTags(hiddenTags)}
                    className="text-xs font-bold text-brand-mint border-1.5 border-brand-mint rounded-full px-2 py-0.5"
                  >
                    +{hiddenTags}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-2.5 px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:p-5">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-main py-3">
              <WhatsAppMark />
              {t.askProduct}
            </a>
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <InstagramIcon className="w-[18px] h-[18px]" />
              {t.seeInstagram}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
