import * as esbuild from 'esbuild';
import { readdirSync, copyFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRODUCTION = process.env.NODE_ENV === 'production';
const distDir = resolve(__dirname, 'dist');
const publicDistDir = resolve(__dirname, 'public', 'dist');

mkdirSync(distDir, { recursive: true });
mkdirSync(publicDistDir, { recursive: true });

// Build single bundle with GSAP + all animations
await esbuild.build({
  entryPoints: [resolve(__dirname, 'scripts/index.js')],
  bundle: true,
  outfile: resolve(distDir, 'index.js'),
  minify: PRODUCTION,
  sourcemap: !PRODUCTION,
  target: 'es2020',
  format: 'iife',
});
console.log('  Built: dist/index.js');

// Sync to public/dist for local dev
for (const file of readdirSync(distDir)) {
  if (file.endsWith('.js') || file.endsWith('.map')) {
    copyFileSync(resolve(distDir, file), resolve(publicDistDir, file));
  }
}
console.log('  Synced to public/dist/');
console.log('Done.');
