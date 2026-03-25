import { build } from 'vite';
import { readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptsDir = resolve(__dirname, 'scripts');

const scriptFiles = readdirSync(scriptsDir).filter(
  (f) => f.endsWith('.js') && f !== 'gsap-utils.js'
);

// Build each script as a standalone IIFE with GSAP bundled in
for (const file of scriptFiles) {
  const name = file.replace('.js', '');
  await build({
    configFile: false,
    build: {
      emptyOutDir: false,
      lib: {
        entry: resolve(scriptsDir, file),
        name: 'webflowScript',
        formats: ['iife'],
        fileName: () => `${name}.js`,
      },
      outDir: 'dist',
      minify: true,
    },
    logLevel: 'warn',
  });
  console.log(`  Built: dist/${name}.js`);
}

console.log('Done.');
