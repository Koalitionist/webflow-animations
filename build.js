import * as esbuild from 'esbuild';
import { readdirSync, copyFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRODUCTION = process.env.NODE_ENV === 'production';
const scriptsDir = resolve(__dirname, 'scripts');
const distDir = resolve(__dirname, 'dist');
const publicDistDir = resolve(__dirname, 'public', 'dist');

mkdirSync(distDir, { recursive: true });
mkdirSync(publicDistDir, { recursive: true });

// 1. Build gsap-bundle.js — bundles GSAP + ScrollTrigger into one IIFE
await esbuild.build({
  entryPoints: [resolve(scriptsDir, 'gsap-bundle.js')],
  bundle: true,
  outfile: resolve(distDir, 'gsap-bundle.js'),
  minify: PRODUCTION,
  sourcemap: !PRODUCTION,
  target: 'es2020',
  format: 'iife',
});
console.log('  Built: dist/gsap-bundle.js');

// 2. Copy animation scripts (plain IIFEs that use window._gsap)
const animScripts = readdirSync(scriptsDir).filter(
  (f) => f.endsWith('.js') && f !== 'gsap-bundle.js' && f !== 'gsap-utils.js'
);

for (const file of animScripts) {
  copyFileSync(resolve(scriptsDir, file), resolve(distDir, file));
  console.log('  Copied: dist/' + file);
}

// 3. Sync to public/dist for local Vite dev server
for (const file of readdirSync(distDir)) {
  if (file.endsWith('.js') || file.endsWith('.map')) {
    copyFileSync(resolve(distDir, file), resolve(publicDistDir, file));
  }
}
console.log('  Synced to public/dist/');
console.log('Done.');
