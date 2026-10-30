// Erzeugt aus dist/ eine Vorschau, die per Doppelklick im Browser funktioniert (ohne Server).
// Aufruf: node scripts/doppelklick.mjs dist vorschau-doppelklick
// Formulare und das CMS brauchen einen echten Server (Netlify); alles andere läuft offline.
import fs from 'node:fs';
import path from 'node:path';

const [, , quelle = 'dist', ziel = 'vorschau-doppelklick'] = process.argv;
fs.rmSync(ziel, { recursive: true, force: true });
fs.cpSync(quelle, ziel, { recursive: true });

const alle = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? alle(p) : [p];
});
const dateien = alle(ziel);

// Pfad "/karriere/#jobs" -> "../karriere/index.html#jobs" (relativ zur jeweiligen Seite)
function relativ(url, prefix) {
  const [pfadTeil, rest = ''] = url.split(/(?=[#?])/);
  let p = pfadTeil.replace(/^\//, '');
  const istDatei = /\.[a-z0-9]{2,5}$/i.test(p);
  if (!istDatei) {
    if (p && !p.endsWith('/')) p += '/';
    p += 'index.html';
  }
  return prefix + p + rest;
}

for (const datei of dateien.filter((d) => d.endsWith('.html'))) {
  const tiefe = path.relative(ziel, path.dirname(datei)).split(path.sep).filter(Boolean).length;
  const prefix = tiefe ? '../'.repeat(tiefe) : './';
  let html = fs.readFileSync(datei, 'utf8');
  // Modul-Skripte direkt einbetten (Browser laden externe Module nicht von der Festplatte)
  html = html.replace(/<script type="module" src="\/(_astro\/[^"]+\.js)"><\/script>/g, (_, src) => {
    const code = fs.readFileSync(path.join(ziel, src), 'utf8');
    return `<script type="module">${code}</script>`;
  });
  // Interne Links, Bilder, Stylesheets und Pfade in data-Attributen (z. B. Selbstcheck-Bilder)
  html = html.replace(/\b(href|src|poster|action|data-[a-z0-9-]+)="(\/(?!\/)[^"]*)"/g, (_, attr, url) => `${attr}="${relativ(url, prefix)}"`);
  html = html.replace(/url\((\/_astro\/[^)]+)\)/g, (_, url) => `url(${prefix}${url.slice(1)})`);
  fs.writeFileSync(datei, html);
}
for (const datei of dateien.filter((d) => d.endsWith('.css'))) {
  const css = fs.readFileSync(datei, 'utf8').replace(/url\(\/_astro\//g, 'url(./').replace(/url\(\/uploads\//g, 'url(../uploads/');
  fs.writeFileSync(datei, css);
}
console.log(`Fertig: ${ziel}/index.html per Doppelklick öffnen.`);
