'use client';

import { useState, useMemo } from 'react';
import type { Product, Category, Tag } from '@/lib/types';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

interface Props {
  products: Product[];
  categories: Category[];
  tags: Tag[];
}

export default function CatalogClient({ products, categories, tags }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        !search || p.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === 'todos' ||
        categories.find(c => c.id === activeCategory)?.productIds.includes(p.id);

      const matchesTags =
        activeTags.length === 0 || activeTags.some(tag => p.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [products, search, activeCategory, activeTags, categories]);

  function toggleTag(tagName: string) {
    setActiveTags(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    );
  }

  const isFiltering = search || activeTags.length > 0 || activeCategory !== 'todos';

  return (
    <>
      {/* Hero */}
      <div className="text-center py-10 mb-4">
        <h2 className="font-cinzel font-bold text-3xl sm:text-4xl text-white mb-2">
          Catalogo
        </h2>
        <p className="text-silver/60 text-sm sm:text-base">
          Dados artesanales impresos en resina y pintados a mano
        </p>
      </div>

      {/* Busqueda */}
      <div className="mb-5">
        <input
          type="search"
          placeholder="Buscar producto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-arcane-card border border-arcane-border rounded-xl px-4 py-3 text-white placeholder-silver/30 focus:outline-none focus:border-teal transition-colors"
        />
      </div>

      {/* Filtros por etiqueta */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.name)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeTags.includes(tag.name)
                  ? 'bg-teal text-arcane-bg border-teal font-semibold'
                  : 'bg-arcane-card text-silver/70 border-arcane-border hover:border-teal/50 hover:text-silver'
              }`}
            >
              {tag.name}
            </button>
          ))}
          {activeTags.length > 0 && (
            <button
              onClick={() => setActiveTags([])}
              className="text-xs px-3 py-1.5 rounded-full border border-red-500/40 text-red-400 hover:border-red-400 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      )}

      {/* Tabs de categoria */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('todos')}
          className={`flex-shrink-0 px-4 py-2 rounded-full font-cinzel text-sm font-semibold transition-colors ${
            activeCategory === 'todos'
              ? 'bg-teal text-arcane-bg'
              : 'bg-arcane-card text-silver border border-arcane-border hover:border-teal/50'
          }`}
        >
          Todos ({products.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-cinzel text-sm font-semibold transition-colors ${
              activeCategory === cat.id
                ? 'bg-teal text-arcane-bg'
                : 'bg-arcane-card text-silver border border-arcane-border hover:border-teal/50'
            }`}
          >
            {cat.name} ({cat.productIds.length})
          </button>
        ))}
      </div>

      {/* Contador de resultados */}
      {isFiltering && (
        <p className="text-silver/50 text-sm mb-4">
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado
          {filteredProducts.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Grid de productos */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onClick={setSelectedProduct} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-silver/40">
          <div className="text-5xl mb-4">🎲</div>
          <p className="font-cinzel text-lg">No se encontraron productos</p>
          <p className="text-sm mt-2">Intenta con otros terminos o filtros</p>
        </div>
      )}

      {/* Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  );
}
