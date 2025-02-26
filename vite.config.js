import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { crx } from '@crxjs/vite-plugin';
import fs from 'fs';

const manifest = JSON.parse(fs.readFileSync('./src/manifest.json', 'utf8'));

export default defineConfig({
  plugins: [vue(), crx({ manifest })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true
  },
  css: {
    modules: false,
    postcss: false
  }
}); 