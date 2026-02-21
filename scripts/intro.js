/* ═══════════════════════════════════════════
   OBSERVER UNIVERSE — intro.js
   Starfield · cursor · scroll reveals · ambient audio
════════════════════════════════════════════ */
'use strict';

// ─── CURSOR ───────────────────────────────
const orb = document.getElementById('cursor-orb');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let ox = mx, oy = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

function animateCursor() {
  ox += (mx - ox) * 0.08;
  oy += (my - oy) * 0.08;
  if (orb) {
    orb.style.left = ox + 'px';
    orb.style.top  = oy + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ─── STARFIELD ────────────────────────────
const canvas = document.getElementById('starfield');
const ctx    = canvas.getContext('2d');
let W, H, stars = [], nebulae = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function buildStars() {
  stars = Array.from({ length: 180 }, () => ({
    x:    Math.random() * W,
    y:    Math.random() * H,
    r:    Math.random() * 1.2 + 0.2,
    a:    Math.random(),
    da:   (Math.random() - 0.5) * 0.004,
    dx:   (Math.random() - 0.5) * 0.03,
    dy:   (Math.random() - 0.5) * 0.015,
  }));

  nebulae = Array.from({ length: 8 }, () => ({
    x:    Math.random() * W,
    y:    Math.random() * H,
    r:    80 + Math.random() * 200,
    h:    Math.random() > 0.5 ? 42 : 210, // gold or blue
    a:    Math.random() * 0.025 + 0.008,
    dx:   (Math.random() - 0.5) * 0.04,
    dy:   (Math.random() - 0.5) * 0.025,
  }));
}

function drawStarfield() {
  ctx.clearRect(0, 0, W, H);

  // Nebulae blobs
  nebulae.forEach(n => {
    n.x += n.dx; n.y += n.dy;
    if (n.x < -n.r) n.x = W + n.r;
    if (n.x > W+n.r) n.x = -n.r;
    if (n.y < -n.r) n.y = H + n.r;
    if (n.y > H+n.r) n.y = -n.r;
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
    g.addColorStop(0, `hsla(${n.h},55%,55%,${n.a})`);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
    ctx.fill();
  });

  // Stars
  stars.forEach(s => {
    s.x += s.dx; s.y += s.dy;
    s.a = Math.max(0.05, Math.min(1, s.a + s.da));
    if (s.a <= 0.05 || s.a >= 1) s.da *= -1;
    if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
    if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(240,235,220,${s.a * 0.6})`;
    ctx.fill();
  });

  // Cursor nebula
  const cg = ctx.createRadialGradient(ox, oy, 0, ox, oy, 300);
  cg.addColorStop(0, 'rgba(201,168,76,0.04)');
  cg.addColorStop(1, 'transparent');
  ctx.fillStyle = cg;
  ctx.fillRect(0, 0, W, H);

  requestAnimationFrame(drawStarfield);
}

window.addEventListener('resize', () => { resize(); buildStars(); });
resize();
buildStars();
drawStarfield();

// ─── COVER FADE-UPS ───────────────────────
document.querySelectorAll('.fade-up').forEach(el => {
  const delay = parseInt(el.dataset.d) || 0;
  setTimeout(() => el.classList.add('visible'), delay + 200);
});

// ─── SCROLL REVEALS ───────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.querySelectorAll('.scroll-reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 120);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

// ─── AMBIENT AUDIO (Web Audio API) ───────
// Starts after first interaction to satisfy browser autoplay policy.
// Shows a gentle prompt on load.

let audioCtx = null;
let ambientStarted = false;
let masterGain;

function startAmbientAudio() {
  if (ambientStarted) return;
  ambientStarted = true;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.55, audioCtx.currentTime + 6);
  masterGain.connect(audioCtx.destination);

  // ── 1. Pad drone: layered sine tones ──
  const padFreqs = [55, 82.5, 110, 138, 165]; // A-based chord
  padFreqs.forEach((freq, i) => {
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const lfo  = audioCtx.createOscillator();
    const lfog = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    lfo.type = 'sine';
    lfo.frequency.value = 0.08 + i * 0.04;
    lfog.gain.value = 0.3;
    lfo.connect(lfog);
    lfog.connect(osc.frequency);

    gain.gain.value = 0.022 / (i + 1);

    osc.connect(gain);
    gain.connect(masterGain);
    lfo.start();
    osc.start();
  });

  // ── 2. High shimmer: triangle wave ──
  [440, 528, 660].forEach((freq, i) => {
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.value = freq;

    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.Q.value = 2;

    gain.gain.value = 0.007;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    osc.start();
  });

  // ── 3. Pink noise (forest ambience) ──
  (function makeNoise() {
    const bufSize = audioCtx.sampleRate * 4;
    const buf  = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0;
    for (let i = 0; i < bufSize; i++) {
      const wh = Math.random() * 2 - 1;
      b0 = 0.99886*b0 + wh*0.0555179;
      b1 = 0.99332*b1 + wh*0.0750759;
      b2 = 0.96900*b2 + wh*0.1538520;
      b3 = 0.86650*b3 + wh*0.3104856;
      b4 = 0.55000*b4 + wh*0.5329522;
      b5 = -0.7616*b5 - wh*0.0168980;
      data[i] = (b0+b1+b2+b3+b4+b5 + wh*0.5362) * 0.11;
    }
    const src    = audioCtx.createBufferSource();
    src.buffer   = buf;
    src.loop     = true;
    const filter = audioCtx.createBiquadFilter();
    filter.type  = 'bandpass';
    filter.frequency.value = 300;
    filter.Q.value = 0.25;
    const gain   = audioCtx.createGain();
    gain.gain.value = 0.018;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    src.start();
  })();

  // ── 4. Sparse bell pings ──
  const bellFreqs = [528, 660, 792, 880, 1056];
  function scheduleBell() {
    if (!ambientStarted) return;
    const freq   = bellFreqs[Math.floor(Math.random() * bellFreqs.length)];
    const now    = audioCtx.currentTime;
    const osc    = audioCtx.createOscillator();
    const gain   = audioCtx.createGain();
    const reverb = makeReverb(2.5);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.998, now + 2);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(gain);
    if (reverb) { gain.connect(reverb); reverb.connect(masterGain); }
    else         { gain.connect(masterGain); }
    osc.start(now);
    osc.stop(now + 3);

    setTimeout(scheduleBell, 3000 + Math.random() * 6000);
  }
  setTimeout(scheduleBell, 2000);
}

function makeReverb(sec) {
  if (!audioCtx) return null;
  const conv  = audioCtx.createConvolver();
  const len   = audioCtx.sampleRate * sec;
  const buf   = audioCtx.createBuffer(2, len, audioCtx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const ch = buf.getChannelData(c);
    for (let i = 0; i < len; i++) {
      ch[i] = (Math.random()*2-1) * Math.pow(1 - i/len, 2.5);
    }
  }
  conv.buffer = buf;
  return conv;
}

// Start audio on first scroll or click (autoplay policy workaround)
function onFirstInteraction() {
  startAmbientAudio();
  document.removeEventListener('scroll', onFirstInteraction);
  document.removeEventListener('click',  onFirstInteraction);
  document.removeEventListener('touchstart', onFirstInteraction);
}
document.addEventListener('scroll',     onFirstInteraction, { passive: true });
document.addEventListener('click',      onFirstInteraction);
document.addEventListener('touchstart', onFirstInteraction, { passive: true });

// ─── ENTER BUTTON — fade out before nav ───
const enterBtn = document.getElementById('enter-btn');
if (enterBtn) {
  enterBtn.addEventListener('click', e => {
    e.preventDefault();
    document.body.style.transition = 'opacity 0.7s ease';
    document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = 'universe.html'; }, 700);
  });
}
