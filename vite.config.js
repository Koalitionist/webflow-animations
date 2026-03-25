import { defineConfig } from 'vite';
import { readdirSync } from 'fs';
import { resolve } from 'path';

const scriptsDir = resolve(__dirname, 'scripts');

const scriptFiles = readdirSync(scriptsDir).filter(
  (f) => f.endsWith('.js') && f !== 'gsap-utils.js'
);

// Build each script as a separate IIFE library entry
export default defineConfig({
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        scriptFiles.map((f) => [f.replace('.js', ''), resolve(scriptsDir, f)])
      ),
      output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        format: 'es',
        // Shared GSAP chunk so it's not duplicated per script
        manualChunks: {
          gsap: ['gsap', 'gsap/ScrollTrigger'],
        },
      },
    },
  },
  server: {
    cors: true,
    port: 3333,
  },
});
