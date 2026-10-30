import type { APIRoute } from 'astro';
import { absUrl } from '../lib/site';

export const GET: APIRoute = () => {
  // Vorschau-Umgebungen (z. B. GitHub Pages) nicht indexieren
  const vorschau = import.meta.env.PUBLIC_VORSCHAU === '1';
  const txt = vorschau
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /anfrage/danke/\nDisallow: /karriere/danke/\n\nSitemap: ${absUrl('/sitemap.xml')}\n`;
  return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
