'use client';

import { useState, useMemo } from 'react';
import type { ProductSummary, Category } from '@/lib/types';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { SearchIcon } from './icons';

interface Props {
  products: ProductSummary[];
  categories: Category[];
}

export default function CatalogClient({ products, categories }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(null);

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(tag => tag.toLowerCase().includes(q));

      const matchesCategory =
        activeCategory === 'todos' ||
        categories.find(c => c.id === activeCategory)?.productIds.includes(p.id);

      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory, categories]);

  const isFiltering = search || activeCategory !== 'todos';

  const chipClass = (active: boolean) =>
    `flex-shrink-0 rounded-full px-3.5 py-2 text-sm font-bold border-1.5 transition-colors duration-150 ${
      active
        ? 'bg-brand-gradient text-brand-indigo border-transparent'
        : 'bg-white/[0.07] text-brand-lavender border-brand-line hover:border-brand-mint'
    }`;

  return (
    <>
      {/* Hero */}
      <div className="text-center pt-2 pb-2 sm:pt-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-dark-bg.svg"
          alt="Arcanist's Dice"
          width={118}
          height={158}
          className="mx-auto mb-2.5 w-[118px] sm:w-[150px] h-auto"
        />
        <h1 className="text-gradient text-[44px] sm:text-5xl leading-none">Catálogo</h1>
        <p className="text-brand-lavender text-sm sm:text-base mt-1.5">
          Dados artesanales hechos con resina y pintados a mano
        </p>
      </div>

      {/* Busqueda */}
      <label className="mt-5 flex items-center gap-2 bg-brand-field border-1.5 border-brand-line rounded-card px-3.5 text-brand-lavender transition-colors duration-150 focus-within:border-brand-mint">
        <SearchIcon className="w-[18px] h-[18px] flex-shrink-0 opacity-70" />
        <span className="sr-only">Buscar producto</span>
        <input
          type="search"
          placeholder="Buscar producto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-transparent py-3 text-[16px] text-white placeholder-brand-lavender/70 focus:outline-none focus-visible:outline-none"
        />
      </label>

      {/* Chips de categoria */}
      <div className="flex gap-2 overflow-x-auto mt-3.5 -mx-4 px-4 pb-1 scrollbar-hide" role="group" aria-label="Categorías">
        <button
          onClick={() => setActiveCategory('todos')}
          aria-pressed={activeCategory === 'todos'}
          className={chipClass(activeCategory === 'todos')}
        >
          Todos <span className="font-extrabold opacity-70 ml-0.5">{products.length}</span>
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            aria-pressed={activeCategory === cat.id}
            className={chipClass(activeCategory === cat.id)}
          >
            {cat.name} <span className="font-extrabold opacity-70 ml-0.5">{cat.productIds.length}</span>
          </button>
        ))}
      </div>

      {/* Contador de resultados */}
      {isFiltering && (
        <p className="text-brand-lavender text-sm mt-4" aria-live="polite">
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado
          {filteredProducts.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Grid de productos */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mt-4">
          {filteredProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              // Checkerboard on the 2-column phone grid
              alt={(i + Math.floor(i / 2)) % 2 === 1}
              onClick={setSelectedProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-brand-lavender">
          <div className="text-5xl mb-4">🎲</div>
          <p className="font-display text-xl text-white tracking-[0.02em]">No se encontraron productos</p>
          <p className="text-sm mt-2">Intenta con otros términos o filtros</p>
        </div>
      )}

      {/* Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
}
