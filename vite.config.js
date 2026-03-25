import { defineConfig } from 'vite';
import { readdirSync } from 'fs';
import { resolve } from 'path';

// Auto-discover all scripts in the scripts/ directory
const scriptEntries = {};
const scriptsDir = resolve(__dirname, 'scripts');

try {
  readdirSync(scriptsDir)
    .filter((f) => f.endsWith('.js'))
    .forEach((f) => {
      const name = f.replace('.js', '');
      scriptEntries[name] = resolve(scriptsDir, f);
    });
} catch {
  // scripts dir may not exist yet
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: scriptEntries,
      output: {
        dir: 'dist',
        entryFileNames: '[name].js',
        format: 'es',
      },
    },
  },
  server: {
    cors: true, // Allow Webflow to load from localhost
    port: 3333,
  },
});
