// Converte originais mantidos em source-images/ para public/media/, preservando as pastas.
// Estrutura esperada: source-images/Natal/foto.jpg -> public/media/Natal/foto.webp
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const inputRoot = path.resolve('source-images');
const outputRoot = path.resolve('media');
const supported = new Set(['.png', '.jpg', '.jpeg']);

async function walk(dir) {
  try { return await fs.readdir(dir, { withFileTypes: true }); } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}
async function convert(dir = inputRoot) {
  for (const entry of await walk(dir)) {
    const source = path.join(dir, entry.name);
    if (entry.isDirectory()) { await convert(source); continue; }
    if (!supported.has(path.extname(entry.name).toLowerCase())) continue;
    const relative = path.relative(inputRoot, source);
    const destination = path.join(outputRoot, relative.replace(/\.(png|jpe?g)$/i, '.webp'));
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await sharp(source).webp({ quality: 82, effort: 4 }).toFile(destination);
    console.log(`${relative} -> ${path.relative(outputRoot, destination)}`);
  }
}
await convert();
console.log('Conversão WebP concluída.');

