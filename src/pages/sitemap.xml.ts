import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { absUrl, istVeroeffentlicht } from '../lib/site';

export const GET: APIRoute = async () => {
  const artikel = (await getCollection('artikel')).filter((a) => istVeroeffentlicht(a.data));
  const stellen = (await getCollection('stellen')).filter((s) => s.data.aktiv);
  const seiten = [
    { p: '/', prio: '1.0' }, { p: '/karriere/', prio: '0.8' }, { p: '/anfrage/', prio: '0.8' },
    { p: '/steuerstrategie/', prio: '0.8' }, { p: '/vermoegensstrategie/', prio: '0.8' },
    { p: '/der-chef-auf-der-baustelle/', prio: '0.8' }, { p: '/der-chef-auf-der-baustelle/selbstcheck/', prio: '0.7' },
    { p: '/hilfe-center/', prio: '0.4' }, { p: '/impressum/', prio: '0.2' }, { p: '/datenschutz/', prio: '0.2' },
    ...artikel.map((a) => ({ p: `/der-chef-auf-der-baustelle/${a.id}/`, prio: '0.7', mod: new Date(a.data.datum).toISOString().slice(0, 10) })),
    ...stellen.map((s) => ({ p: `/karriere/${s.id}/`, prio: '0.6' }))
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${seiten
    .map((s) => `  <url><loc>${absUrl(s.p)}</loc>${'mod' in s && s.mod ? `<lastmod>${s.mod}</lastmod>` : ''}<priority>${s.prio}</priority></url>`)
    .join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
