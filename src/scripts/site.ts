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
  if (heroImg && !reduce && y < 900) heroImg.style.transform = 'scale(1.06) translateY(' + y * 0.05 + 'px)';
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
  menu?.classList.toggle('open', open); ov?.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  burger?.setAttribute('aria-expanded', String(open));
}
burger?.addEventListener('click', () => toggleMenu(!menu?.classList.contains('open')));
ov?.addEventListener('click', () => toggleMenu(false));
menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggleMenu(false)));

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
