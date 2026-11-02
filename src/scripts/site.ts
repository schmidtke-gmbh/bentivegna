// Globale Interaktionen: Navigation, Reveal, Zähler, Menü, Video-Modal, Tracking
declare global { interface Window { bvTrack: (ev: string, data?: Record<string, unknown>) => void; _paq?: unknown[][]; dataLayer?: unknown[] } }

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Tracking: Matomo (falls eingebunden) + dataLayer ---------- */
window.bvTrack = function (ev, data = {}) {
  try {
    if (window._paq) window._paq.push(['trackEvent', 'Website', ev, JSON.stringify(data)]);
    (window.dataLayer = window.dataLayer || []).push({ event: ev, ...data });
  } catch (e) { /* bewusst leer */ }
};
document.addEventListener('click', (e) => {
  const t = (e.target as HTMLElement).closest('[data-track]') as HTMLElement | null;
  if (t) window.bvTrack(t.dataset.track || 'klick', { ziel: (t as HTMLAnchorElement).href || '' });
});

/* ---------- Hero-Einblendung ---------- */
requestAnimationFrame(() => document.body.classList.add('hero-load'));

/* ---------- Fortschritt + Navigation ---------- */
const nav = document.getElementById('nav');
const prog = document.getElementById('progress');
const heroImg = document.getElementById('heroImg') as HTMLElement | null;
function onScroll() {
  const y = window.scrollY || document.documentElement.scrollTop;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (prog) prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  nav?.classList.toggle('scrolled', y > 24);
  // Freigestellte Gruppe nicht vergrößern: sonst schneidet die Ausblend-Maske die äußeren Personen seitlich ab
  if (heroImg && !reduce && y < 900) heroImg.style.transform = heroImg.classList.contains('hero-gruppe') ? 'translateY(' + y * 0.04 + 'px)' : 'scale(1.06) translateY(' + y * 0.05 + 'px)';
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Reveal ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal, .feat-card, .geo-map').forEach((el) => io.observe(el));

/* ---------- Druck: alles im Endzustand, FAQ offen ---------- */
const offeneDetails: HTMLDetailsElement[] = [];
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('.reveal, .feat-card, .geo-map').forEach((el) => el.classList.add('in'));
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((n) => { n.textContent = (n.dataset.prefix || '') + (n.dataset.count || '') + (n.dataset.suffix || ''); });
  document.getElementById('uzChart')?.classList.add('gezeichnet');
  document.querySelectorAll<HTMLDetailsElement>('details:not([open])').forEach((d) => { d.open = true; offeneDetails.push(d); });
  document.querySelectorAll('video').forEach((v) => v.pause());
});
window.addEventListener('afterprint', () => { offeneDetails.splice(0).forEach((d) => (d.open = false)); });

/* ---------- Zähler ---------- */
function animateCount(el: HTMLElement) {
  const target = +(el.dataset.count || 0), pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
  const dur = 1400, start = performance.now();
  function tick(now: number) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = pre + Math.round((1 - Math.pow(1 - p, 3)) * target) + suf;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const statsIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.querySelectorAll<HTMLElement>('[data-count]').forEach((n) => { if (!reduce) animateCount(n); });
      statsIO.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stats').forEach((s) => statsIO.observe(s));

/* ---------- Mobiles Menü ---------- */
const burger = document.getElementById('burger'), menu = document.getElementById('mMenu'), ov = document.getElementById('mOverlay');
function toggleMenu(open: boolean) {
  const war = !!menu?.classList.contains('open');
  menu?.classList.toggle('open', open); ov?.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  burger?.setAttribute('aria-expanded', String(open));
  if (open && !war) window.setTimeout(() => (document.getElementById('mClose') as HTMLElement | null)?.focus({ preventScroll: true }), 60);
  if (!open && war && menu?.contains(document.activeElement)) burger?.focus({ preventScroll: true });
}
burger?.addEventListener('click', () => toggleMenu(!menu?.classList.contains('open')));
ov?.addEventListener('click', () => toggleMenu(false));
document.getElementById('mClose')?.addEventListener('click', () => toggleMenu(false));
menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu?.classList.contains('open')) toggleMenu(false); });
window.matchMedia('(min-width: 1181px)').addEventListener('change', (m) => { if (m.matches) toggleMenu(false); });

/* ---------- Kein Wort allein in der letzten Zeile ----------
   Die letzten zwei Wörter werden mit einem geschützten Leerzeichen verbunden (nur wenn beide zusammen kurz genug sind),
   Zahlen bleiben mit ihrer Einheit zusammen (1 Mio. €, 100 %, § 13b). */
function textUmbruch() {
  const NB = '\u00A0';
  const einheiten = /(\d) (Mio\.|Mrd\.|Tsd\.|%|€|Min\.|Uhr|Std\.)/g;
  const w0 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement && !n.parentElement.closest('script, style, textarea, svg')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
  let t: Node | null;
  while ((t = w0.nextNode())) {
    const v = t.nodeValue || '';
    if (/\d /.test(v) || v.includes('§ ')) {
      const neu = v.replace(einheiten, '$1' + NB + '$2').replace(/Mio\. €/g, 'Mio.' + NB + '€').replace(/§ (\d)/g, '§' + NB + '$1');
      if (neu !== v) t.nodeValue = neu;
    }
  }
  // Alle Textblöcke mit eigenem Text; erst messen, dann schreiben (kein Layout-Flackern)
  const ctx = document.createElement('canvas').getContext('2d');
  const auswahl: [Node, string, string, number, number][] = [];
  document.querySelectorAll<HTMLElement>('main *, footer *').forEach((el) => {
    if (el.closest('.hz, [data-wechsel], .marquee, .brand-band, .hw-lauf, .btn, nav, .mobile-menu, svg, script, style, [aria-hidden="true"]')) return;
    if (![...el.childNodes].some((c) => c.nodeType === 3 && /\S/.test(c.nodeValue || ''))) return;
    const cs = getComputedStyle(el);
    if (!/^(block|flex|grid|list-item|inline-block|table-cell|-webkit-box)$/.test(cs.display) || cs.whiteSpace === 'nowrap') return;
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let letzter: Node | null = null, n: Node | null;
    while ((n = w.nextNode())) if (/\S/.test(n.nodeValue || '')) letzter = n;
    if (!letzter) return;
    const v = letzter.nodeValue || '';
    const m = v.match(/(\S+) +(\S+)(\s*)$/);
    if (!m) return;
    const breite = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    let noetig = (m[1].length + m[2].length + 1) * parseFloat(cs.fontSize) * 0.62;
    if (ctx) { ctx.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily; noetig = ctx.measureText(m[1] + ' ' + m[2]).width * (cs.textTransform === 'uppercase' ? 1.18 : 1) + (parseFloat(cs.letterSpacing) || 0) * (m[1].length + m[2].length); }
    const passt = breite > 0 ? noetig < breite * 0.9 : (m[1].length + m[2].length) < 18;
    if (passt) auswahl.push([letzter, v, m[1] + NB + m[2], (m.index || 0), (m.index || 0) + m[0].length - m[3].length]);
  });
  auswahl.forEach(([t, v, neu, von, bis]) => { t.nodeValue = v.slice(0, von) + neu + v.slice(bis); });
}
if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(textUmbruch); else textUmbruch();

/* ---------- Video-Modal: YouTube wird erst nach Zustimmung geladen ---------- */
const KEY = 'bv-youtube-ok';
let modal: HTMLElement | null = null;
function closeModal() { if (!modal) return; modal.classList.remove('open'); modal.querySelector('.vmodal-box')!.innerHTML = ''; document.body.style.overflow = ''; }
function play(id: string) {
  const box = modal!.querySelector('.vmodal-box')!;
  box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  window.bvTrack('video_abgespielt', { video: id });
}
function openVideo(id: string, hochkant = false) {
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'vmodal';
    modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-label', 'Video');
    modal.innerHTML = '<button class="vmodal-close" aria-label="Schließen">×</button><div class="vmodal-box"></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal || (e.target as HTMLElement).closest('.vmodal-close')) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }
  modal.classList.add('open'); document.body.style.overflow = 'hidden';
  modal.querySelector('.vmodal-box')!.classList.toggle('hochkant', hochkant);
  let ok = false; try { ok = localStorage.getItem(KEY) === '1'; } catch (e) { ok = false; }
  if (ok) { play(id); return; }
  const box = modal.querySelector('.vmodal-box')!;
  box.innerHTML = `<div class="vmodal-consent"><b style="font-size:1.3rem">Video von YouTube abspielen?</b>
    <p>Das Video wird erst nach deinem Klick geladen. Dabei wird eine Verbindung zu YouTube (Google) hergestellt und Daten wie deine IP-Adresse werden übertragen. Mehr dazu in unserer Datenschutzerklärung.</p>
    <button class="btn btn--gold" type="button">Video abspielen <span class="arr"></span></button>
    <label><input type="checkbox"> Für diese Website merken</label></div>`;
  box.querySelector('button')!.addEventListener('click', () => {
    const cb = box.querySelector('input') as HTMLInputElement;
    if (cb.checked) { try { localStorage.setItem(KEY, '1'); } catch (e) { /* leer */ } }
    play(id);
  });
}
document.addEventListener('click', (e) => {
  const t = (e.target as HTMLElement).closest('[data-video]') as HTMLElement | null;
  if (t && t.dataset.video) { e.preventDefault(); openVideo(t.dataset.video, t.dataset.hochkant === '1'); }
});
document.addEventListener('keydown', (e) => {
  const t = (e.target as HTMLElement).closest?.('[data-video]') as HTMLElement | null;
  if (t && (e.key === 'Enter' || e.key === ' ') && t.dataset.video) { e.preventDefault(); openVideo(t.dataset.video, t.dataset.hochkant === '1'); }
});

export {};
