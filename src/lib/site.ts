import { marked } from 'marked';
import einstellungen from '../data/einstellungen.json';

export const E = einstellungen;

const BASE: string = import.meta.env.BASE_URL || '/';

/** Interne Pfade mit Basis-URL versehen (wichtig für Vorschau unter Unterordnern). */
export function u(path = ''): string {
  if (!path) return BASE;
  if (/^(https?:|mailto:|tel:|#|data:)/.test(path)) return path;
  const b = BASE.endsWith('/') ? BASE : BASE + '/';
  return b + path.replace(/^\//, '');
}

/** Markdown in einer Zeile (fett, kursiv, Links). */
export const md = (s = ''): string => marked.parseInline(s || '') as string;
/** Markdown als Block (Absätze, Listen, Überschriften). */
export const mdBlock = (s = ''): string => marked.parse(s || '') as string;

export const telLink = (t = '') => 'tel:' + t.replace(/[^0-9+]/g, '');
export const waLink = (nr = '', text = '') =>
  nr ? `https://wa.me/${nr.replace(/[^0-9]/g, '')}${text ? '?text=' + encodeURIComponent(text) : ''}` : '';

export const SITE_URL: string = (import.meta.env.PUBLIC_SITE_URL || 'https://www.shk-steuerberater.de').replace(/\/$/, '');
export const absUrl = (p = '/') => SITE_URL + (p.startsWith('/') ? p : '/' + p);

export const lesezeit = (text = '') => Math.max(1, Math.round(text.trim().split(/\s+/).length / 200));

export const datumDE = (d: Date | string) =>
  new Date(d).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

/** Artikel sind sichtbar, wenn ihr Datum erreicht ist (Terminierung) und sie kein Entwurf sind. */
export const istVeroeffentlicht = (data: { datum: Date; entwurf?: boolean }) => {
  if (import.meta.env.PUBLIC_ZEIGE_ENTWUERFE === '1') return true;
  if (data.entwurf) return false;
  return new Date(data.datum).getTime() <= Date.now();
};
