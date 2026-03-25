import { build } from 'vite';
import { copyFileSync, readdirSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptsDir = resolve(__dirname, 'scripts');
const distDir = resolve(__dirname, 'dist');
const publicDistDir = resolve(__dirname, 'public', 'dist');

mkdirSync(distDir, { recursive: true });
mkdirSync(publicDistDir, { recursive: true });

// 1. Build gsap-bundle as a self-contained IIFE (~112KB)
await build({
  configFile: false,
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(scriptsDir, 'gsap-bundle.js'),
      name: 'gsapBundle',
      formats: ['iife'],
      fileName: () => 'gsap-bundle.js',
    },
    outDir: 'dist',
    minify: true,
  },
  logLevel: 'warn',
});
console.log('  Built: dist/gsap-bundle.js');

// 2. Copy animation scripts as-is (they're plain IIFEs, ~1KB each)
const animScripts = readdirSync(scriptsDir).filter(
  (f) => f.endsWith('.js') && f !== 'gsap-bundle.js' && f !== 'gsap-utils.js'
);

for (const file of animScripts) {
  copyFileSync(resolve(scriptsDir, file), resolve(distDir, file));
  console.log('  Copied: dist/' + file);
}

// 3. Copy everything to public/dist for local dev (Vite serves public/ as static)
for (const file of readdirSync(distDir)) {
  if (file.endsWith('.js')) {
    copyFileSync(resolve(distDir, file), resolve(publicDistDir, file));
  }
}
console.log('  Synced to public/dist/');

console.log('Done.');
