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
  tagline: 'Figuras, keycaps y dados · El Salvador',
  // Under the name on phones, where the full tagline doesn't fit
  taglineShort: 'El Salvador',
  footer: 'El Salvador · Dados artesanales de resina pintados a mano',
  languageSwitch: 'Idioma',
  instagramFollow: 'Seguir en Instagram',
  whatsappCta: 'Escríbenos por WhatsApp',
  // The WhatsApp pill on desktop
  whatsappCtaShort: 'Escríbenos',
  whatsappMessage: 'Hola! Me interesa conocer más sobre sus productos.',
  whatsappProductMessage: (name: string) => `Hola! Me interesa el producto: ${name}`,
  heroTitle: 'Catálogo',
  heroSubtitle: 'Figuras, keycaps y dados impresos en resina y pintados a mano',
  searchLabel: 'Buscar producto',
  searchPlaceholder: 'Buscar producto, serie o personaje...',
  categories: 'Categorías',
  all: 'Todos',
  allBrands: 'Todas',
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
  seeAllPhotos: (n: number) => `Ver las ${n} fotos`,
  thumbnails: 'Miniaturas',
  backToPhoto: 'Volver a la foto',
  gridHint: 'toca una para verla en grande',
  brand: 'Marca',
  searchTag: (tag: string) => `Buscar "${tag}"`,
  moreTags: (n: number) => `Ver ${n} ${plural(n, 'etiqueta', 'etiquetas')} más`,
  askProduct: 'Consultar este producto',
  seeInstagram: 'Ver en Instagram',
  // Side menu by type. Type ids come from the Drive type folders; a type missing here shows its folder name.
  menuLabel: (current?: string) => (current ? `Menú de productos, viendo ${current}` : 'Menú de productos'),
  menuTitle: 'Productos',
  allTypes: 'Todo',
  typeNames: { figures: 'Figuras', keycaps: 'Keycaps', dice: 'Dados', others: 'Otros' } as Record<string, string>,
  typeSubtitles: {
    figures: 'Figuras de anime, series y videojuegos, impresas en resina y pintadas a mano',
    keycaps: 'Teclas de anime, series y videojuegos para tu teclado',
    dice: 'Dados artesanales hechos con resina y pintados a mano',
  } as Record<string, string>,
  // One product's type on its card badge
  typeSingular: { figures: 'Figura', keycaps: 'Keycaps', dice: 'Dado', others: 'Otro' } as Record<string, string>,
  // Model-type tags from the Drive tag conventions (docs/drive-images-schema.md)
  modelTypes: {
    chibi: 'Chibi',
    toon: 'Toon',
    extra: 'Extra',
    bust: 'Busto',
    fullsize: 'Tamaño completo',
    diorama: 'Diorama',
  } as Record<string, string>,
  typeSoon: 'Pronto',
  searchIn: (type: string) => `Buscar en ${type}...`,
  sectionSoon: 'Próximamente',
  sectionSoonTitle: 'Estamos preparando esta sección',
  sectionSoonText: {
    dice: 'Escríbenos si buscas dados personalizados: te contamos colores, materiales y tiempos.',
  } as Record<string, string>,
  sectionSoonFallback: 'Escríbenos y te contamos lo que tenemos.',
  seeType: (type: string) => `Ver ${type}`,
  whatsappTypeMessages: { dice: 'Hola! Me interesan sus dados personalizados.' } as Record<string, string>,
};

export type Dictionary = typeof es;

const en: Dictionary = {
  htmlLang: 'en',
  ogLocale: 'en_US',
  meta: {
    description:
      'Catalog of handmade dice and accessories, resin printed and hand-painted. El Salvador.',
  },
  tagline: 'Figures, keycaps and dice · El Salvador',
  taglineShort: 'El Salvador',
  footer: 'El Salvador · Handmade resin dice, hand-painted',
  languageSwitch: 'Language',
  instagramFollow: 'Follow on Instagram',
  whatsappCta: 'Message us on WhatsApp',
  whatsappCtaShort: 'Message us',
  whatsappMessage: "Hi! I'd like to know more about your products.",
  whatsappProductMessage: (name: string) => `Hi! I'm interested in: ${name}`,
  heroTitle: 'Catalog',
  heroSubtitle: 'Figures, keycaps and dice, resin printed and hand-painted',
  searchLabel: 'Search products',
  searchPlaceholder: 'Search product, series or character...',
  categories: 'Categories',
  all: 'All',
  allBrands: 'All',
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
  seeAllPhotos: (n: number) => `See all ${n} photos`,
  thumbnails: 'Thumbnails',
  backToPhoto: 'Back to the photo',
  gridHint: 'tap one to see it large',
  brand: 'Brand',
  searchTag: (tag: string) => `Search "${tag}"`,
  moreTags: (n: number) => `Show ${n} more ${plural(n, 'tag', 'tags')}`,
  askProduct: 'Ask about this product',
  seeInstagram: 'See on Instagram',
  menuLabel: (current?: string) => (current ? `Product menu, showing ${current}` : 'Product menu'),
  menuTitle: 'Products',
  allTypes: 'All',
  typeNames: { figures: 'Figures', keycaps: 'Keycaps', dice: 'Dice', others: 'Others' },
  typeSubtitles: {
    figures: 'Anime, series and video game figures, resin printed and hand-painted',
    keycaps: 'Anime, series and video game keycaps for your keyboard',
    dice: 'Handmade resin dice, hand-painted',
  },
  typeSingular: { figures: 'Figure', keycaps: 'Keycaps', dice: 'Die', others: 'Other' },
  modelTypes: {
    chibi: 'Chibi',
    toon: 'Toon',
    extra: 'Extra',
    bust: 'Bust',
    fullsize: 'Full size',
    diorama: 'Diorama',
  },
  typeSoon: 'Soon',
  searchIn: (type: string) => `Search in ${type}...`,
  sectionSoon: 'Coming soon',
  sectionSoonTitle: "We're getting this section ready",
  sectionSoonText: {
    dice: "Message us if you're looking for custom dice: we'll tell you about colors, materials and timing.",
  },
  sectionSoonFallback: "Message us and we'll tell you what we have.",
  seeType: (type: string) => `See ${type}`,
  whatsappTypeMessages: { dice: "Hi! I'm interested in your custom dice." },
};

const DICTIONARIES: Record<Lang, Dictionary> = { es, en };

export function getDictionary(lang: Lang): Dictionary {
  return DICTIONARIES[lang];
}

// A type's name in the page's language; a type without a translation shows its Drive folder name
export function typeName(t: Dictionary, id: string, folderName: string): string {
  return t.typeNames[id] ?? folderName;
}
