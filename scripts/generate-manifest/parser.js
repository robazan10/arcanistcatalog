/**
 * Parses the contents of a meta.txt file.
 *
 * Expected format (only name is required):
 *   name=Product Name
 *   tags=tag1,tag2,tag3
 *   images=Image_1.png, Image_2.png   (optional: only these images)
 *
 * Older files may also have category= and brand=; they're parsed, and the
 * script compares them with the brand folder.
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
