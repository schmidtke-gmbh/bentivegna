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
  const data: { m: string; u: number; g: number }[] = JSON.parse(wrap.dataset.reihe || '[]');
  const n = data.length;
  if (!n) return;
  const VBW = 1000, VBH = 300, padT = 24, padB = 58, plotH = VBH - padT - padB;
  const uv = data.map((d) => d.u), gv = data.map((d) => d.g);
  const uMin = Math.min(...uv) - 150, uMax = Math.max(...uv) + 50;
  // Gewinn auf eigener Skala im unteren Bereich, damit beide Kurven lesbar bleiben
  const gMin = 0, gMax = Math.max(...gv) * 2.4;
  const X = (i: number) => (i / (n - 1)) * VBW;
  const YU = (v: number) => padT + (1 - (v - uMin) / (uMax - uMin)) * plotH;
  const YG = (v: number) => padT + (1 - (v - gMin) / (gMax - gMin)) * plotH;
  const pfad = (f: (i: number) => number) => data.map((_, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ',' + f(i).toFixed(1)).join(' ');
  const lineU = pfad((i) => YU(data[i].u)), lineG = pfad((i) => YG(data[i].g));
  const areaU = 'M0,' + VBH + ' ' + lineU.replace(/^M/, 'L') + ' L' + VBW + ',' + VBH + ' Z';
  const areaG = 'M0,' + VBH + ' ' + lineG.replace(/^M/, 'L') + ' L' + VBW + ',' + VBH + ' Z';
  const svg = `<svg viewBox="0 0 ${VBW} ${VBH}" preserveAspectRatio="none" aria-hidden="true"><defs>
    <linearGradient id="uzg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(153,138,109,.30)"/><stop offset="1" stop-color="rgba(153,138,109,0)"/></linearGradient>
    <linearGradient id="uzn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(39,51,101,.16)"/><stop offset="1" stop-color="rgba(39,51,101,0)"/></linearGradient></defs>
    <path d="${areaU}" fill="url(#uzg)"/><path d="${areaG}" fill="url(#uzn)"/>
    <path class="uz-line" d="${lineU}" fill="none" stroke="#998a6d" stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="uz-line" d="${lineG}" fill="none" stroke="#273365" stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const months = '<div class="uz-months">' + data.map((d) => `<span>${d.m}</span>`).join('') + '</div>';
  wrap.insertAdjacentHTML('afterbegin', svg + months + '<div class="uz-guide"></div><div class="uz-dot"></div><div class="uz-dot g"></div><div class="uz-tip"></div>');
  const guide = wrap.querySelector<HTMLElement>('.uz-guide')!, dots = wrap.querySelectorAll<HTMLElement>('.uz-dot'), tip = wrap.querySelector<HTMLElement>('.uz-tip')!;
  if (!reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { wrap.classList.add('gezeichnet'); io.disconnect(); } }), { threshold: 0.3 });
    io.observe(wrap);
  } else wrap.classList.add('gezeichnet');
  const mio = (t: number) => (t / 1000).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Mio €';
  const place = (i: number) => {
    const H = wrap.clientHeight, ratio = i / (n - 1);
    const yU = (YU(data[i].u) / VBH) * H, yG = (YG(data[i].g) / VBH) * H;
    guide.style.left = ratio * 100 + '%'; guide.style.opacity = '1';
    [yU, yG].forEach((y, k) => { dots[k].style.left = ratio * 100 + '%'; dots[k].style.top = y + 'px'; dots[k].style.opacity = '1'; });
    tip.style.left = ratio * 100 + '%'; tip.style.top = yU + 'px'; tip.style.opacity = '1';
    const marge = ((data[i].g / data[i].u) * 100).toLocaleString('de-DE', { maximumFractionDigits: 1 });
    tip.innerHTML = `${data[i].m} · Umsatz <b>${mio(data[i].u)}</b> · Gewinn <b>${data[i].g} T€</b> (${marge} %)`;
  };
  const move = (e: PointerEvent) => { const r = wrap.getBoundingClientRect(); const ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); place(Math.round(ratio * (n - 1))); };
  wrap.addEventListener('pointermove', move);
  wrap.addEventListener('pointerdown', move);
  wrap.addEventListener('pointerleave', () => { guide.style.opacity = '0'; dots.forEach((d) => (d.style.opacity = '0')); tip.style.opacity = '0'; });
}

function kennzahl() {
  document.querySelectorAll<HTMLElement>('.uz-big[data-to]').forEach((big) => {
    const to = +(big.dataset.to || 0), from = +(big.dataset.from || 0), fmt = big.dataset.fmt;
    const text = (v: number) => (fmt === 'marge' ? `${from} → ${Math.round(v)} %` : `+${Math.round(v)} %`);
    big.textContent = text(reduce ? to : from);
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (reduce) { big.textContent = text(to); return; }
      const st = performance.now();
      const tick = (now: number) => { const p = Math.min((now - st) / 1300, 1); big.textContent = text(from + (1 - Math.pow(1 - p, 3)) * (to - from)); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold: 0.5 });
    io.observe(big);
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
