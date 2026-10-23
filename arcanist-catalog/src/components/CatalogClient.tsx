'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import type { ProductSummary, Category, MenuType } from '@/lib/types';
import ProductCard from './ProductCard';
import ProductRow from './ProductRow';
import ProductModal from './ProductModal';
import { GridIcon, ListIcon, SearchIcon } from './icons';
import { normalize, readQueryFromUrl, writeQueryToUrl } from '@/lib/search';
import { writeTypeToUrl } from '@/lib/productType';
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

  // Start from ?q= in the address, and follow it when the visitor goes Back/Forward
  useEffect(() => {
    const syncFromUrl = () => {
      setSearch(readQueryFromUrl());
      setSelectedProduct(null);
    };
    setSearch(readQueryFromUrl());
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const updateSearch = (value: string, options?: { push?: boolean }) => {
    setSearch(value);
    writeQueryToUrl(value.trim(), options);
  };

  // Tapping a tag in the product view searches the whole catalog for it, leaving the selected type
  const searchTag = (tag: string) => {
    setSelectedProduct(null);
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

  const chipClass = (active: boolean) =>
    `flex-shrink-0 rounded-full px-3.5 py-2 text-sm font-bold border-1.5 transition-colors duration-150 ${
      active
        ? 'bg-brand-gradient bg-origin-border text-brand-indigo border-transparent'
        : 'bg-white/[0.07] text-brand-lavender border-brand-line hover:border-brand-mint'
    }`;

  return (
    <>
      {/* Hero: compact row on phones so the first products show on the first screen; big centered logo from sm up */}
      <div className="flex items-center gap-3 pt-1 sm:flex-col sm:gap-0 sm:pt-6 sm:pb-2 sm:text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-dark-bg.svg"
          alt="Arcanist's Dice"
          width={150}
          height={201}
          className="w-16 sm:w-[150px] sm:mb-2.5 h-auto flex-shrink-0"
        />
        <div className="min-w-0">
          <h1 className="text-gradient text-[32px] sm:text-5xl leading-none">{activeTypeName || t.heroTitle}</h1>
          <p className="text-brand-lavender text-[13px] leading-snug sm:text-base mt-1 sm:mt-1.5">
            {(activeType && t.typeSubtitles[activeType.id]) || t.heroSubtitle}
          </p>
        </div>
      </div>

      {/* A type with no products yet (Dice): a "coming soon" notice instead of search and results */}
      {activeType && activeType.count === 0 ? (
        <SectionSoon
          type={activeType.id}
          others={types.filter(type => type.count > 0)}
          onChoose={type => writeTypeToUrl(type)}
          t={t}
        />
      ) : (
        <>
          {/* Search */}
          <label
            ref={searchRef}
            className="mt-3 sm:mt-5 scroll-mt-20 flex items-center gap-2 bg-brand-field border-1.5 border-brand-line rounded-card px-3.5 text-brand-lavender transition-colors duration-150 focus-within:border-brand-mint">
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

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto mt-3.5 -mx-4 px-4 pb-1 scrollbar-hide" role="group" aria-label={t.categories}>
            <button
              onClick={() => setActiveCategory('todos')}
              aria-pressed={activeCategory === 'todos'}
              className={chipClass(activeCategory === 'todos')}
            >
              {t.all} <span className="font-extrabold opacity-70 ml-0.5">{typeProducts.length}</span>
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

          {/* Count and view toggle */}
          <div className="flex items-center justify-between gap-3 mt-4">
            <p className="text-brand-lavender text-sm" aria-live="polite">
              {t.productCount(filteredProducts.length, Boolean(isFiltering))}
            </p>
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
                <ProductRow key={product.id} product={product} alt={i % 2 === 1} t={t} onClick={setSelectedProduct} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mt-3">
              {filteredProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  t={t}
                  // Checkerboard on the 2-column phone grid
                  alt={(i + Math.floor(i / 2)) % 2 === 1}
                  onClick={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Product view */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onTagClick={searchTag}
        t={t}
      />
    </>
  );
}
