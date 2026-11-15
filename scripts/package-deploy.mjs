// Gera o pacote publicável em deploy/ (site estático servido pelo Caddy).
// Compila o SCSS e copia somente os arquivos usados em produção.
// As imagens já convertidas ficam versionadas em media/; source-images/ não é publicada.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const deploy = path.join(root, 'deploy');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

console.log('package:deploy: compilando CSS...');
const build = spawnSync(npm, ['run', 'build:css'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
if (build.error || build.status !== 0) {
  console.error('package:deploy: build:css falhou; deploy/ não foi alterada.');
  process.exit(build.status || 1);
}

const entries = [
  'index.html',
  'style.css',
  'script.js',
  'site.webmanifest',
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'media',
];
for (const entry of entries) {
  if (!fs.existsSync(path.join(root, entry))) {
    console.error(`package:deploy: arquivo obrigatório ausente: ${entry}`);
    process.exit(1);
  }
}

fs.rmSync(deploy, { recursive: true, force: true });
fs.mkdirSync(deploy, { recursive: true });
for (const entry of entries) {
  fs.cpSync(path.join(root, entry), path.join(deploy, entry), { recursive: true });
}

let count = 0;
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name));
    else count++;
  }
})(deploy);
console.log(`package:deploy: ${count} arquivos copiados para deploy/`);
