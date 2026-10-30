// @ts-check
import { defineConfig } from 'astro/config';

// SITE_URL: endgültige Domain (für Canonical, Sitemap, Social-Vorschau)
// BASE: Unterordner, z. B. "/bentivegna/" für die GitHub-Pages-Vorschau. Für Netlify leer lassen.
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://www.bentivegna.de',
  base: process.env.BASE || '/',
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  devToolbar: { enabled: false }
});
