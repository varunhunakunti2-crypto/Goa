// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
const isBuild = process.env.NODE_ENV === 'production' || process.argv.includes('build');

export default defineConfig({
  output: isBuild ? 'server' : 'static',
  integrations: [react()],

  vite: {
    plugins: [tailwind()]
  },

  adapter: isBuild ? cloudflare() : undefined
});