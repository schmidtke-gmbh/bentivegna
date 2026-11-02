// Interaktionen der Startseite: Hero-Netzwerk, Methode, Entwicklungs-Chart, Kennzahl, Referenz-Slider, Varianten-Vorschau
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function heroNetz() {
  const c = document.getElementById('heroCanvas') as HTMLCanvasElement | null;
  if (!c) return;
  const ctx = c.getContext('2d')!;
  let w = 0, h = 0, raf = 0;
  let pts: { x: number; y: number; vx: number; vy: number }[] = [];
  const DIST = 150;
  const size = () => { const p = c.parentElement!; w = c.width = p.offsetWidth; h = c.height = p.offsetHeight; };
  const init = () => {
    pts = [];
    const n = Math.min(48, Math.round(window.innerWidth / 30));
    for (let i = 0; i < n; i++) pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.24, vy: (Math.random() - 0.5) * 0.2 });
  };
  const frame = () => {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1; }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < DIST) { ctx.strokeStyle = 'rgba(52,92,154,' + (0.11 * (1 - d / DIST)).toFixed(3) + ')'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    }
    ctx.fillStyle = 'rgba(39,51,101,0.16)';
    for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 6.283); ctx.fill(); }
  };
  const loop = () => { frame(); raf = requestAnimationFrame(loop); };
  size(); init();
  if (reduce) frame(); else loop();
  let rt: number;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(() => { size(); init(); if (reduce) frame(); }, 200); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else if (!reduce) loop(); });
}

function methode() {
  const sec = document.getElementById('system');
  if (!sec) return;
  const items = [...sec.querySelectorAll<HTMLElement>('.macc-item')];
  const slides = [...sec.querySelectorAll<HTMLElement>('.method-slide')];
  const fill = sec.querySelector<HTMLElement>('.method-track-fill');
  const acc = sec.querySelector<HTMLElement>('.method-acc');
  if (!items.length) return;
  const mq = window.matchMedia('(max-width:768px)');
  let cur = -1;
  const moveFill = (i: number) => {
    if (!fill || !acc) return;
    const r = items[i].querySelector('.macc-num')!.getBoundingClientRect(), ar = acc.getBoundingClientRect();
    fill.style.height = Math.max(0, r.top + r.height / 2 - ar.top) + 'px';
  };
  const setActive = (i: number) => {
    if (i === cur) return; cur = i;
    items.forEach((el, n) => el.classList.toggle('active', n === i));
    slides.forEach((el, n) => el.classList.toggle('active', n === i));
    moveFill(i);
  };
  if (mq.matches) {
    items.forEach((it, i) => {
      if (!slides[i]) return;
      const w = document.createElement('div'); w.className = 'macc-inline'; w.innerHTML = slides[i].innerHTML;
      it.querySelector('.macc-body-in')?.appendChild(w);
    });
  }
  items.forEach((it, i) => {
    const head = it.querySelector<HTMLElement>('.macc-head')!;
    const toggle = () => { if (mq.matches && i === cur) { it.classList.remove('active'); cur = -1; } else setActive(i); };
    head.addEventListener('click', toggle);
    head.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
  if (!mq.matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(items.indexOf(e.target as HTMLElement)); }), { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    items.forEach((it) => io.observe(it));
    setActive(0);
    window.addEventListener('resize', () => { if (cur >= 0) moveFill(cur); });
  } else setActive(0);
}

function chart() {
  const wrap = document.getElementById('uzChart');
  if (!wrap) return;
  // Reihe und Skala kommen fertig aus index.astro (SVG ist dort schon gezeichnet): links Umsatz in Mio €, rechts Gewinnmarge in %
  const data: { m: string; u: number; mg: number; g: number }[] = JSON.parse(wrap.dataset.reihe || '[]');
  const sk = JSON.parse(wrap.dataset.skala || '{}') as { uMin: number; uMax: number; mMin: number; mMax: number; padT: number; padB: number };
  const n = data.length;
  const plot = wrap.querySelector<HTMLElement>('.uz-plot');
  if (!n || !plot || sk.uMax === undefined) return;
  const VBH = 300, plotH = VBH - sk.padT - sk.padB;
  const YU = (v: number) => sk.padT + (1 - (v - sk.uMin) / (sk.uMax - sk.uMin)) * plotH;
  const YM = (v: number) => sk.padT + (1 - (v - sk.mMin) / (sk.mMax - sk.mMin)) * plotH;
  plot.insertAdjacentHTML('beforeend', '<div class="uz-guide"></div><div class="uz-dot"></div><div class="uz-dot g"></div><div class="uz-tip"></div>');
  const guide = plot.querySelector<HTMLElement>('.uz-guide')!, dots = plot.querySelectorAll<HTMLElement>('.uz-dot'), tip = plot.querySelector<HTMLElement>('.uz-tip')!;
  if (!reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { wrap.classList.add('gezeichnet'); io.disconnect(); } }), { threshold: 0.3 });
    io.observe(wrap);
  } else wrap.classList.add('gezeichnet');
  const mio = (t: number) => (t / 1000).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Mio €';
  const place = (i: number) => {
    const H = plot.clientHeight, ratio = i / (n - 1);
    const yU = (YU(data[i].u) / VBH) * H, yM = (YM(data[i].mg) / VBH) * H;
    guide.style.left = ratio * 100 + '%'; guide.style.opacity = '1';
    [yU, yM].forEach((y, k) => { dots[k].style.left = ratio * 100 + '%'; dots[k].style.top = y + 'px'; dots[k].style.opacity = '1'; });
    tip.innerHTML = `${data[i].m} · Umsatz <b>${mio(data[i].u)}</b> · Marge <b>${data[i].mg.toLocaleString('de-DE')} %</b> · Gewinn ${data[i].g} T€`;
    // Tooltip bleibt im Diagramm, auch ganz links und rechts und auf dem Handy
    const W = plot.clientWidth, tw = Math.min(tip.offsetWidth, W);
    tip.style.left = Math.max(tw / 2, Math.min(W - tw / 2, ratio * W)) + 'px'; tip.style.top = Math.min(yU, yM) + 'px'; tip.style.opacity = '1';
  };
  const move = (e: PointerEvent) => { const r = plot.getBoundingClientRect(); const ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); place(Math.round(ratio * (n - 1))); };
  wrap.addEventListener('pointermove', move);
  wrap.addEventListener('pointerdown', move);
  wrap.addEventListener('pointerleave', () => { guide.style.opacity = '0'; dots.forEach((d) => (d.style.opacity = '0')); tip.style.opacity = '0'; });
}

function kennzahl() {
  document.querySelectorAll<HTMLElement>('.uz-big[data-to]').forEach((big) => {
    const to = +(big.dataset.to || 0), from = +(big.dataset.from || 0), fmt = big.dataset.fmt;
    const text = (v: number) => (fmt === 'marge' ? `${from} → ${Math.round(v)} %` : `+${Math.round(v)} %`);
    big.textContent = text(reduce ? to : from);
    // Druck: Endwert zeigen, auch wenn die Zahl noch nicht ins Bild gescrollt wurde
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (reduce) { big.textContent = text(to); return; }
      const st = performance.now();
      const tick = (now: number) => { const p = Math.min((now - st) / 1300, 1); big.textContent = text(from + (1 - Math.pow(1 - p, 3)) * (to - from)); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold: 0.5 });
    io.observe(big);
    window.addEventListener('beforeprint', () => { io.disconnect(); big.textContent = text(to); });
  });
}

function slider() {
  const vp = document.getElementById('csViewport');
  if (!vp) return;
  const track = vp.querySelector<HTMLElement>('.cs-track')!;
  const orig = [...track.querySelectorAll<HTMLElement>('.cs-slide')];
  const N = orig.length; if (!N) return;
  const dots = document.getElementById('csDots')!;
  orig.slice().reverse().forEach((s) => { const c = s.cloneNode(true) as HTMLElement; c.setAttribute('aria-hidden', 'true'); c.querySelectorAll('[tabindex]').forEach((t) => t.setAttribute('tabindex', '-1')); track.insertBefore(c, track.firstChild); });
  orig.forEach((s) => { const c = s.cloneNode(true) as HTMLElement; c.setAttribute('aria-hidden', 'true'); c.querySelectorAll('[tabindex]').forEach((t) => t.setAttribute('tabindex', '-1')); track.appendChild(c); });
  const slides = [...track.querySelectorAll<HTMLElement>('.cs-slide')];
  let index = N;
  const place = (anim: boolean) => {
    track.style.transition = anim ? '' : 'none';
    const a = slides[index];
    track.style.transform = 'translateX(' + ((vp.clientWidth - a.clientWidth) / 2 - a.offsetLeft) + 'px)';
    if (!anim) { void track.offsetHeight; track.style.transition = ''; }
    slides.forEach((s, k) => s.classList.toggle('active', k === index));
    const real = ((index % N) + N) % N;
    [...dots.children].forEach((d, k) => d.classList.toggle('active', k === real));
  };
  orig.forEach((_, i) => { const b = document.createElement('button'); b.className = 'cs-dot'; b.setAttribute('aria-label', 'Referenz ' + (i + 1)); b.addEventListener('click', () => { index = N + i; place(true); }); dots.appendChild(b); });
  track.addEventListener('transitionend', () => { if (index >= 2 * N) { index -= N; place(false); } else if (index < N) { index += N; place(false); } });
  document.getElementById('csPrev')?.addEventListener('click', () => { index--; place(true); });
  document.getElementById('csNext')?.addEventListener('click', () => { index++; place(true); });
  let rt: number;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = window.setTimeout(() => place(false), 120); });
  place(false); setTimeout(() => place(false), 350);
}

/** Vorschau der Alternativtexte für die Kennzahlen: /?variante=b */
function variante() {
  if (new URLSearchParams(location.search).get('variante') !== 'b') return;
  document.querySelectorAll<HTMLElement>('.stat').forEach((s) => {
    const num = s.querySelector<HTMLElement>('.num'), lbl = s.querySelector<HTMLElement>('.lbl');
    if (lbl?.dataset.altLbl) lbl.textContent = lbl.dataset.altLbl;
    if (num?.dataset.altNum) { num.removeAttribute('data-count'); num.textContent = num.dataset.altNum; num.classList.add('txt'); }
  });
}

export function startseite() {
  variante();
  heroNetz();
  methode();
  chart();
  kennzahl();
  slider();
}
