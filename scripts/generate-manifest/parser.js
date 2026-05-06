/**
 * Parsea el contenido de un archivo meta.txt.
 *
 * Formato esperado:
 *   name=Nombre del Producto
 *   category=Categoria
 *   tags=Tag1, Tag2, Tag3
 *   images=Image_1.png, Image_2.png   (opcional)
 */
function parseMetaTxt(content) {
  const result = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes('=')) continue;
    const eqIndex = trimmed.indexOf('=');
    const key = trimmed.slice(0, eqIndex).trim().toLowerCase();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (key === 'tags' || key === 'images') {
      result[key] = value.split(',').map(v => v.trim()).filter(Boolean);
    } else {
      result[key] = value;
    }
  }
  return result;
}

module.exports = { parseMetaTxt };
