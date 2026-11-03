// Vorschaubild 1200 × 630 (JPG) für LinkedIn, WhatsApp und Facebook.
// Entsteht beim Veröffentlichen automatisch aus Motiv (ohne Text), Titel, Unterzeile und Kapitel des Artikels.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { istVeroeffentlicht } from '../../../lib/site';

export async function getStaticPaths() {
  const alle = (await getCollection('artikel')).filter((a) => istVeroeffentlicht(a.data));
  const kapitel = await getCollection('kapitel');
  return alle.map((a) => {
    const k = kapitel.find((x) => x.id === a.data.kapitel);
    return { params: { slug: a.id }, props: { d: a.data, kap: k ? `Kapitel ${k.data.nummer} · ${k.data.titel}` : '' } };
  });
}

const W = 1200, H = 630;
const root = process.cwd();
const schrift = (n: string) => readFileSync(join(root, 'node_modules/@fontsource/source-sans-3/files', n));
const fonts = [
  { name: 'S', data: schrift('source-sans-3-latin-800-normal.woff'), weight: 800 as const, style: 'normal' as const },
  { name: 'S', data: schrift('source-sans-3-latin-400-italic.woff'), weight: 400 as const, style: 'italic' as const }
];
const logoWeiss = 'data:image/svg+xml;base64,' + Buffer.from(
  readFileSync(join(root, 'public/uploads/logos/logo-quer-ohne-claim.svg'), 'utf8').replace(/fill:\s*#[0-9a-f]{6}/gi, 'fill: #ffffff')
).toString('base64');

const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}) =>
  ({ type, props: { style, children, ...extra } });

export const GET: APIRoute = async ({ props }) => {
  const { d, kap } = props as { d: any; kap: string };
  let hintergrund: unknown = null;
  if (d.bild) {
    try {
      const jpg = await sharp(join(root, 'public', d.bild)).resize(W, H, { fit: 'cover', position: 'right' }).jpeg({ quality: 82 }).toBuffer();
      hintergrund = el('img', { position: 'absolute', left: 0, top: 0, width: W, height: H }, undefined, { src: 'data:image/jpeg;base64,' + jpg.toString('base64'), width: W, height: H });
    } catch { hintergrund = null; }
  }
  const tree = el('div', { width: W, height: H, display: 'flex', position: 'relative', backgroundColor: '#1b2a5c', backgroundImage: 'linear-gradient(135deg, #273365, #141d3a)', fontFamily: 'S', color: '#fff' }, [
    hintergrund,
    el('div', { position: 'absolute', left: 0, top: 0, width: W, height: H, display: 'flex', backgroundImage: 'linear-gradient(90deg, rgba(18,27,62,0.6), rgba(18,27,62,0) 62%)' }),
    el('div', { position: 'absolute', left: 72, top: 58, display: 'flex', borderRadius: 12, overflow: 'hidden', fontSize: 22, fontWeight: 800, letterSpacing: 3 }, [
      el('div', { backgroundColor: '#fff', color: '#273365', padding: '15px 24px' }, 'DER CHEF AUF DER BAUSTELLE'),
      el('div', { backgroundColor: '#998a6d', color: '#fff', padding: '15px 24px' }, `TEIL ${d.teil}`)
    ]),
    el('div', { position: 'absolute', left: 72, top: 165, width: 640, display: 'flex', flexDirection: 'column' }, [
      el('div', { fontSize: d.titel.length > 48 ? 54 : 66, fontWeight: 800, lineHeight: 1.04, letterSpacing: -0.5 }, d.titel),
      d.unterzeile ? el('div', { marginTop: 26, fontSize: 23, fontStyle: 'italic', lineHeight: 1.4, color: 'rgba(255,255,255,0.92)', width: 560 }, d.unterzeile) : null
    ].filter(Boolean)),
    kap ? el('div', { position: 'absolute', left: 72, bottom: 46, fontSize: 19, fontWeight: 800, letterSpacing: 3 }, kap.toUpperCase()) : null,
    el('img', { position: 'absolute', right: 44, bottom: 40, width: 230, height: 44 }, undefined, { src: logoWeiss, width: 230, height: 44 })
  ].filter(Boolean));
  const svg = await satori(tree as any, { width: W, height: H, fonts });
  const jpg = await sharp(Buffer.from(svg)).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  return new Response(jpg, { headers: { 'Content-Type': 'image/jpeg' } });
};
