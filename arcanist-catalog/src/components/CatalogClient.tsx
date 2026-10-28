'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import type { ProductSummary, Category, MenuType } from '@/lib/types';
import ProductCard from './ProductCard';
import ProductRow from './ProductRow';
import ProductModal from './ProductModal';
import { CheckIcon, GridIcon, ListIcon, SearchIcon, ShareIcon } from './icons';
import { normalize, readQueryFromUrl, writeQueryToUrl } from '@/lib/search';
import { writeTypeToUrl } from '@/lib/productType';
import { currentViewLink, readProductFromUrl, shareLink, writeProductToUrl } from '@/lib/share';
import { useSelectedType } from '@/lib/useSelectedType';
import { getDictionary, typeName, type Lang } from '@/i18n/dictionaries';
import SectionSoon from './SectionSoon';

type View = 'grid' | 'list';

// Each visitor's choice of grid or list, remembered on their device
const VIEW_KEY = 'catalog-view';

interface Props {
  products: ProductSummary[];
  categories: Category[];
  // Types for the side menu, in menu order; empty with a catalog made before product types existed
  types: MenuType[];
  lang: Lang;
}

export default function CatalogClient({ products, categories, types, lang }: Props) {
  const t = getDictionary(lang);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(null);

  const [view, setView] = useState<View>('grid');
  const searchRef = useRef<HTMLLabelElement>(null);

  // The type chosen in the side menu (?type=); an unknown type shows everything
  const selectedType = useSelectedType();
  const activeType = types.find(type => type.id === selectedType);
  const activeTypeName = activeType ? typeName(t, activeType.id, activeType.name) : '';

  // A new type starts with all its brands and the search in the address (empty, or a tapped tag)
  useEffect(() => {
    setActiveCategory('todos');
    setSearch(readQueryFromUrl());
  }, [selectedType]);

  useEffect(() => {
    try {
      if (localStorage.getItem(VIEW_KEY) === 'list') setView('list');
    } catch {
      // Storage blocked (private mode): stay on the grid
    }
  }, []);

  const changeView = (next: View) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // Not remembered, but the view still changes
    }
  };

  // The open product lives in the address as ?p=, so a product link opens it directly
  const openProduct = (product: ProductSummary) => {
    setSelectedProduct(product);
    writeProductToUrl(product.id);
  };
  const closeProduct = () => {
    setSelectedProduct(null);
    writeProductToUrl('');
  };

  // Start from ?q= and ?p= in the address, and follow them when the visitor goes Back/Forward
  useEffect(() => {
    const syncFromUrl = () => {
      setSearch(readQueryFromUrl());
      const id = readProductFromUrl();
      const product = id ? products.find(p => p.id === id) : undefined;
      setSelectedProduct(product ?? null);
      // A link to a product that no longer exists just shows the catalog
      if (id && !product) writeProductToUrl('');
    };
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [products]);

  // "Enlace copiado" with the link, for a few seconds after a copy
  const [toast, setToast] = useState<{ url: string; ok: boolean } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const showCopied = (url: string, ok: boolean) => {
    setToast({ url, ok });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), ok ? 3000 : 8000);
  };
  const [searchCopied, setSearchCopied] = useState(false);
  const shareSearch = async () => {
    const url = currentViewLink();
    const result = await shareLink(url, "Arcanist's Dice");
    if (result === 'copied' || result === 'failed') showCopied(url, result === 'copied');
    if (result === 'copied') {
      setSearchCopied(true);
      setTimeout(() => setSearchCopied(false), 2000);
    }
  };

  const updateSearch = (value: string, options?: { push?: boolean }) => {
    setSearch(value);
    writeQueryToUrl(value.trim(), options);
  };

  // Tapping a tag in the product view searches the whole catalog for it, leaving the selected type
  const searchTag = (tag: string) => {
    closeProduct();
    setActiveCategory('todos');
    if (activeType) writeTypeToUrl('', tag);
    else updateSearch(tag, { push: true });
    requestAnimationFrame(() => searchRef.current?.scrollIntoView({ block: 'start' }));
  };

  // The products of the selected type, with their name, category and tags normalized once for search
  const typeProducts = useMemo(
    () =>
      products
        .filter(p => !activeType || p.type === activeType.id)
        .map(p => ({ product: p, text: normalize([p.name, p.category, ...p.tags].join('\n')) })),
    [products, activeType]
  );

  // Brand chips: only brands with products in the selected type, counted there, in menu order of their type
  const typeChips = useMemo(() => {
    const ids = new Set(typeProducts.map(({ product }) => product.id));
    const typeOf = new Map(products.map(p => [p.id, p.type]));
    const order = (c: Category) => {
      const i = types.findIndex(type => type.id === typeOf.get(c.productIds[0]));
      return i === -1 ? types.length : i;
    };
    return categories
      .map(c => ({ ...c, count: c.productIds.filter(id => ids.has(id)).length }))
      .filter(c => c.count > 0)
      .sort((a, b) => order(a) - order(b));
  }, [categories, products, typeProducts, types]);

  const filteredProducts = useMemo(() => {
    const q = normalize(search.trim());
    const categoryIds = categories.find(c => c.id === activeCategory)?.productIds;
    return typeProducts
      .filter(({ product, text }) => {
        const matchesSearch = !q || text.includes(q);
        const matchesCategory = activeCategory === 'todos' || categoryIds?.includes(product.id);
        return matchesSearch && matchesCategory;
      })
      .map(({ product }) => product);
  }, [typeProducts, search, activeCategory, categories]);

  const isFiltering = search || activeCategory !== 'todos';
  // A menu type with no products yet (Dice) shows a notice instead of search and results
  const isSoon = Boolean(activeType && activeType.count === 0);
  // Type chips on "Todo"; a catalog without types (made before October 2026) keeps the brand chips
  const showTypeChips = !activeType && types.length > 0;

  // The card badge: the type on "Todo" (Figura · Busto), the brand inside a type (Tanuki · Busto)
  const badgeFor = (p: ProductSummary) => {
    const models = p.tags
      .map(tag => tag.toLowerCase())
      .filter((tag, i, all) => t.modelTypes[tag] && all.indexOf(tag) === i)
      .map(tag => t.modelTypes[tag]);
    const type = types.find(ty => ty.id === p.type);
    const first = !type ? p.category : activeType ? p.brand : t.typeSingular[type.id] ?? typeName(t, type.id, type.name);
    return [first, models.join(' + ')].filter(Boolean).join(' · ');
  };

  const chipClass = (active: boolean) =>
    `flex-shrink-0 rounded-full px-3.5 py-2 text-sm font-bold border-1.5 transition-colors duration-150 ${
      active
        ? 'bg-brand-gradient bg-origin-border text-brand-indigo border-transparent'
        : 'bg-white/[0.07] text-brand-lavender border-brand-line hover:border-brand-mint'
    }`;

  return (
    <>
      {/* Top: logo, title and line; on desktop the search sits on the same row */}
      <div className="flex flex-wrap items-center md:items-end justify-between gap-x-6 gap-y-3 pt-1 sm:pt-4">
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-dark-bg.svg"
            alt="Arcanist's Dice"
            width={150}
            height={201}
            className="w-16 sm:w-[90px] h-auto flex-shrink-0"
          />
          <div className="min-w-0">
            <h1 className="text-gradient text-[32px] sm:text-5xl leading-none">{activeTypeName || t.heroTitle}</h1>
            <p className="text-brand-lavender text-[13px] leading-snug sm:text-base mt-1 sm:mt-1.5">
              {(activeType && t.typeSubtitles[activeType.id]) || t.heroSubtitle}
            </p>
          </div>
        </div>
        {!isSoon && (
          <label
            ref={searchRef}
            className="w-full md:w-auto md:flex-[0_1_420px] scroll-mt-20 flex items-center gap-2 bg-brand-field border-1.5 border-brand-line rounded-card px-3.5 text-brand-lavender transition-colors duration-150 focus-within:border-brand-mint"
          >
            <SearchIcon className="w-[18px] h-[18px] flex-shrink-0 opacity-70" />
            <span className="sr-only">{t.searchLabel}</span>
            <input
              type="search"
              placeholder={activeType ? t.searchIn(activeTypeName) : t.searchPlaceholder}
              value={search}
              onChange={e => updateSearch(e.target.value)}
              className="w-full bg-transparent py-3 text-[16px] text-white placeholder-brand-lavender/70 focus:outline-none focus-visible:outline-none"
            />
          </label>
        )}
      </div>

      {/* A type with no products yet (Dice): a "coming soon" notice instead of search and results */}
      {isSoon && activeType ? (
        <SectionSoon
          type={activeType.id}
          others={types.filter(type => type.count > 0)}
          onChoose={type => writeTypeToUrl(type)}
          t={t}
        />
      ) : (
        <>
          {/* Chips, then count and view toggle; one row from md up */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-x-4 gap-y-3.5 mt-3.5 md:mt-5">
            {/* On "Todo": the product types (same as the side menu). Inside a type: its brands, if more than one */}
            {showTypeChips ? (
              <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-hide md:mx-0 md:px-0 md:pb-0 md:flex-wrap md:overflow-visible" role="group" aria-label={t.menuTitle}>
                <button aria-pressed="true" className={chipClass(true)}>
                  {t.allTypes} <span className="font-extrabold opacity-70 ml-0.5">{products.length}</span>
                </button>
                {types.map(type => (
                  <button key={type.id} onClick={() => writeTypeToUrl(type.id)} aria-pressed="false" className={chipClass(false)}>
                    {typeName(t, type.id, type.name)}{' '}
                    {type.count > 0 ? (
                      <span className="font-extrabold opacity-70 ml-0.5">{type.count}</span>
                    ) : (
                      <span className="badge-mint ml-1">{t.typeSoon}</span>
                    )}
                  </button>
                ))}
              </div>
            ) : typeChips.length > 1 ? (
              <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-hide md:mx-0 md:px-0 md:pb-0 md:flex-wrap md:overflow-visible" role="group" aria-label={t.categories}>
                <button
                  onClick={() => setActiveCategory('todos')}
                  aria-pressed={activeCategory === 'todos'}
                  className={chipClass(activeCategory === 'todos')}
                >
                  {activeType ? t.allBrands : t.all} <span className="font-extrabold opacity-70 ml-0.5">{typeProducts.length}</span>
                </button>
                {typeChips.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    aria-pressed={activeCategory === cat.id}
                    className={chipClass(activeCategory === cat.id)}
                  >
                    {cat.name} <span className="font-extrabold opacity-70 ml-0.5">{cat.count}</span>
                  </button>
                ))}
              </div>
            ) : null}

            <div className="flex items-center justify-between md:justify-end gap-3">
              <p className="text-brand-lavender text-sm" aria-live="polite">
                {t.productCount(filteredProducts.length, Boolean(isFiltering))}
              </p>
              <div className="flex items-center gap-2">
                {/* Shares what's on screen: the type and the search */}
                <button
                  onClick={shareSearch}
                  aria-label={t.shareSearch}
                  className={`flex items-center gap-1.5 h-10 px-3 rounded-card border-1.5 text-[13px] font-bold transition-colors duration-150 ${
                    searchCopied
                      ? 'border-brand-mint text-brand-mint bg-brand-mint/[0.12]'
                      : 'border-brand-line bg-white/[0.07] text-white hover:border-brand-mint'
                  }`}
                >
                  {searchCopied ? <CheckIcon className="w-4 h-4" /> : <ShareIcon className="w-4 h-4" />}
                  {searchCopied ? t.copied : t.share}
                </button>
                <div className="flex gap-0.5 p-[3px] rounded-card border-1.5 border-brand-line bg-white/[0.07]" role="group" aria-label={t.view}>
                  {([
                    ['grid', t.grid, GridIcon],
                    ['list', t.list, ListIcon],
                  ] as const).map(([value, label, Icon]) => (
                    <button
                      key={value}
                      onClick={() => changeView(value)}
                      aria-pressed={view === value}
                      aria-label={label}
                      title={label}
                      className={`grid place-items-center w-[38px] h-8 rounded-[9px] transition-colors duration-150 ${
                        view === value ? 'bg-brand-gradient text-brand-indigo' : 'text-brand-lavender hover:text-white'
                      }`}
                    >
                      <Icon />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-brand-lavender">
              <div className="text-5xl mb-4">🎲</div>
              <p className="font-display text-xl text-white tracking-[0.02em]">{t.noResults}</p>
              <p className="text-sm mt-2">{t.noResultsHint}</p>
            </div>
          ) : view === 'list' ? (
            <div className="grid lg:grid-cols-2 gap-2 mt-3">
              {filteredProducts.map((product, i) => (
                <ProductRow key={product.id} product={product} badge={badgeFor(product)} alt={i % 2 === 1} t={t} onClick={openProduct} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mt-3">
              {filteredProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  badge={badgeFor(product)}
                  t={t}
                  // Checkerboard on the 2-column phone grid
                  alt={(i + Math.floor(i / 2)) % 2 === 1}
                  onClick={openProduct}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Product view */}
      <ProductModal
        product={selectedProduct}
        onClose={closeProduct}
        onTagClick={searchTag}
        onCopied={showCopied}
        t={t}
        lang={lang}
      />

      {/* At the top, so it never covers the WhatsApp buttons at the bottom */}
      {toast && (
        <div
          role="status"
          className="fixed left-1/2 -translate-x-1/2 top-[max(1rem,env(safe-area-inset-top))] z-[60] max-w-[calc(100vw-2rem)] flex items-center gap-2.5 rounded-card border-1.5 border-brand-mint bg-brand-deep px-4 py-2.5 shadow-[0_8px_24px_rgba(10,10,50,0.45)]"
        >
          {toast.ok && <CheckIcon className="w-[18px] h-[18px] flex-shrink-0 text-brand-mint" />}
          <span className="font-extrabold whitespace-nowrap">{toast.ok ? t.linkCopied : t.copyThisLink}</span>
          <span className="text-[13px] text-brand-lavender truncate select-all">{toast.ok ? toast.url.replace(/^https?:\/\/(www\.)?/, '') : toast.url}</span>
        </div>
      )}
    </>
  );
}
