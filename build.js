import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, readdirSync, copyFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRODUCTION = process.env.NODE_ENV === 'production';
const distDir = resolve(__dirname, 'dist');
const publicDistDir = resolve(__dirname, 'public', 'dist');

mkdirSync(distDir, { recursive: true });
mkdirSync(publicDistDir, { recursive: true });

// Build single bundle
await esbuild.build({
  entryPoints: [resolve(__dirname, 'scripts/index.js')],
  bundle: true,
  outfile: resolve(distDir, 'index.js'),
  minify: PRODUCTION,
  sourcemap: !PRODUCTION,
  target: 'es2020',
  format: 'iife',
  banner: {
    // Hide Webflow's GSAP before our bundle initializes
    js: 'var __wf_gsap=window.gsap,__wf_ST=window.ScrollTrigger;delete window.gsap;delete window.ScrollTrigger;',
  },
  footer: {
    // Restore Webflow's GSAP after our bundle is done
    js: 'window.gsap=__wf_gsap;window.ScrollTrigger=__wf_ST;',
  },
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
