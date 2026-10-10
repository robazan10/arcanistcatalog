// Every text the site writes, in Spanish and English. Product names, brands and tags come from Drive as they are.
export type Lang = 'es' | 'en';

export const LANGS: Lang[] = ['es', 'en'];

// Home page path of each language
export const HOME_PATH: Record<Lang, string> = { es: '/', en: '/en/' };

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

const es = {
  htmlLang: 'es',
  ogLocale: 'es_SV',
  meta: {
    description:
      'Catálogo de dados artesanales y accesorios impresos en resina y pintados a mano. El Salvador.',
  },
  tagline: 'Dados artesanales · El Salvador',
  footer: 'El Salvador · Dados artesanales de resina pintados a mano',
  languageSwitch: 'Idioma',
  instagramFollow: 'Seguir en Instagram',
  whatsappCta: 'Escríbenos por WhatsApp',
  whatsappMessage: 'Hola! Me interesa conocer más sobre sus productos.',
  whatsappProductMessage: (name: string) => `Hola! Me interesa el producto: ${name}`,
  heroTitle: 'Catálogo',
  heroSubtitle: 'Dados artesanales hechos con resina y pintados a mano',
  searchLabel: 'Buscar producto',
  searchPlaceholder: 'Buscar producto...',
  categories: 'Categorías',
  all: 'Todos',
  productCount: (n: number, filtering: boolean) =>
    `${n} ${plural(n, 'producto', 'productos')}${filtering ? ` ${plural(n, 'encontrado', 'encontrados')}` : ''}`,
  view: 'Vista',
  grid: 'Cuadrícula',
  list: 'Lista',
  noResults: 'No se encontraron productos',
  noResultsHint: 'Intenta con otros términos o filtros',
  photos: (n: number) => `${n} ${plural(n, 'foto', 'fotos')}`,
  comingSoon: 'Fotos pronto',
  comingSoonText: 'Aún no tenemos fotos de esta pieza. Escríbenos y te contamos los detalles.',
  close: 'Cerrar',
  previousImage: 'Imagen anterior',
  nextImage: 'Imagen siguiente',
  imageOf: (i: number, total: number) => `Imagen ${i} de ${total}`,
  brand: 'Marca',
  searchTag: (tag: string) => `Buscar "${tag}"`,
  moreTags: (n: number) => `Ver ${n} ${plural(n, 'etiqueta', 'etiquetas')} más`,
  askProduct: 'Consultar este producto',
  seeInstagram: 'Ver en Instagram',
};

export type Dictionary = typeof es;

const en: Dictionary = {
  htmlLang: 'en',
  ogLocale: 'en_US',
  meta: {
    description:
      'Catalog of handmade dice and accessories, resin printed and hand-painted. El Salvador.',
  },
  tagline: 'Handmade dice · El Salvador',
  footer: 'El Salvador · Handmade resin dice, hand-painted',
  languageSwitch: 'Language',
  instagramFollow: 'Follow on Instagram',
  whatsappCta: 'Message us on WhatsApp',
  whatsappMessage: "Hi! I'd like to know more about your products.",
  whatsappProductMessage: (name: string) => `Hi! I'm interested in: ${name}`,
  heroTitle: 'Catalog',
  heroSubtitle: 'Handmade resin dice, hand-painted',
  searchLabel: 'Search products',
  searchPlaceholder: 'Search products...',
  categories: 'Categories',
  all: 'All',
  productCount: (n: number, filtering: boolean) =>
    `${n} ${plural(n, 'product', 'products')}${filtering ? ' found' : ''}`,
  view: 'View',
  grid: 'Grid',
  list: 'List',
  noResults: 'No products found',
  noResultsHint: 'Try other words or filters',
  photos: (n: number) => `${n} ${plural(n, 'photo', 'photos')}`,
  comingSoon: 'Photos coming soon',
  comingSoonText: "We don't have photos of this piece yet. Message us and we'll tell you the details.",
  close: 'Close',
  previousImage: 'Previous image',
  nextImage: 'Next image',
  imageOf: (i: number, total: number) => `Image ${i} of ${total}`,
  brand: 'Brand',
  searchTag: (tag: string) => `Search "${tag}"`,
  moreTags: (n: number) => `Show ${n} more ${plural(n, 'tag', 'tags')}`,
  askProduct: 'Ask about this product',
  seeInstagram: 'See on Instagram',
};

const DICTIONARIES: Record<Lang, Dictionary> = { es, en };

export function getDictionary(lang: Lang): Dictionary {
  return DICTIONARIES[lang];
}
