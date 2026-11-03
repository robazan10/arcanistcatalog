const fs = require('fs');

// The catalog as it was before this run, by product id; null if there's none to compare with
function readPreviousProducts(catalogPath) {
  try {
    const { products } = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    return new Map(products.map(p => [p.id, p]));
  } catch (err) {
    console.warn(`\nWarning: no previous catalog to compare with (${err.message}); no product is marked as new`);
    return null;
  }
}

/**
 * The date a product became new on the site, or undefined. The site shows it as new for 30 days.
 * New means it first has photos: a product not in the previous catalog, or one that was "Fotos pronto".
 * More photos or a new cover on a product that already had photos don't count.
 */
function newSinceFor(product, previousProducts, today) {
  if (!previousProducts || product.images.length === 0) return undefined;
  const previous = previousProducts.get(product.id);
  return previous && previous.images.length > 0 ? previous.newSince : today;
}

module.exports = { readPreviousProducts, newSinceFor };
