/* ═══════════════════════════════════════════
   OBSERVER UNIVERSE — universe.js
   Full quantum canvas experience
   Particles · Wave functions · Entanglement
   Superposition · Collapse · Sound
════════════════════════════════════════════ */
'use strict';

// ════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════
const State = {
  mouse:    { x: -9999, y: -9999, lx: 0, ly: 0, vx: 0, vy: 0 },
  cursor:   { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  W: 0, H: 0,
  started:  false,
  sound:    false,
  obsCount: 0,
  seed:     Math.random(),
  time:     0,
};

// ════════════════════════════════════════════
// CANVAS SETUP
// ════════════════════════════════════════════
const canvas = document.getElementById('universe-canvas');
const ctx    = canvas.getContext('2d');

function resize() {
  State.W = canvas.width  = window.innerWidth;
  State.H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// ════════════════════════════════════════════
// QUANTUM PARTICLE SYSTEM
// ════════════════════════════════════════════
class QuantumParticle {
  constructor() { this.reset(true); }

  reset(init = false) {
    this.x  = Math.random() * State.W;
    this.y  = Math.random() * State.H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = 1 + Math.random() * 2.5;

    // Quantum state: superposition until observed
    this.superposed   = true;   // uncertain state
    this.collapsed    = false;  // wave function collapsed
    this.observed     = false;  // currently in observer range
    this.observedTime = 0;

    // Wavefunction properties
    this.phase  = Math.random() * Math.PI * 2;
    this.freq   = 0.002 + Math.random() * 0.004;
    this.amp    = 8 + Math.random() * 20;

    // Entanglement partner index
    this.entangled = -1;

    // Visual
    this.hue      = 35 + Math.random() * 20;       // gold range
    this.alpha    = 0;
    this.targetA  = 0;
    this.glow     = 0;
    this.trail    = [];
    this.trailMax = 12;

    // Session variation
    this.spinRate = (Math.random() - 0.5) * 0.02;
    this.spin     = Math.random() * Math.PI * 2;

    if (init) {
      this.x = Math.random() * State.W;
      this.y = Math.random() * State.H;
    }
  }

  distToMouse() {
    return Math.hypot(this.x - State.mouse.x, this.y - State.mouse.y);
  }

  update(t) {
    const dist = this.distToMouse();
    const radius = 180 + State.seed * 80;

    this.spin += this.spinRate;
    this.phase += this.freq;

    // Wave function motion
    const waveX = Math.sin(this.phase) * this.amp * 0.008;
    const waveY = Math.cos(this.phase * 0.7) * this.amp * 0.006;

    this.x += this.vx + waveX;
    this.y += this.vy + waveY;

    // Wrap
    if (this.x < -50)         this.x = State.W + 50;
    if (this.x > State.W + 50) this.x = -50;
    if (this.y < -50)         this.y = State.H + 50;
    if (this.y > State.H + 50) this.y = -50;

    // Observer effect
    if (dist < radius && State.started) {
      this.observed    = true;
      this.superposed  = false;
      this.observedTime += 1;
      this.targetA  = 0.85 + (1 - dist / radius) * 0.15;
      this.glow     = Math.max(0, (1 - dist / radius));

      // Gentle attraction toward cursor
      const angle = Math.atan2(State.mouse.y - this.y, State.mouse.x - this.x);
      this.vx += Math.cos(angle) * 0.004;
      this.vy += Math.sin(angle) * 0.004;

      // Speed damping when observed
      this.vx *= 0.985;
      this.vy *= 0.985;

    } else {
      // Quantum uncertainty — flicker in superposition
      if (this.observed) {
        this.observed   = false;
        this.collapsed  = false;
        // Collapse: random disappear
        if (Math.random() < 0.4) {
          this.targetA = 0;
          setTimeout(() => {
            if (!this.observed) this.superposed = true;
          }, 800 + Math.random() * 1200);
        }
      }

      if (this.superposed) {
        // Superposition flicker — exists AND doesn't exist
        const flicker = Math.sin(t * this.freq * 80 + this.phase) * 0.5 + 0.5;
        this.targetA  = flicker * 0.08;
      } else {
        // Collapsed but not observed — fades
        this.targetA = Math.max(0, this.targetA - 0.004);
        if (this.targetA < 0.01 && Math.random() < 0.001) {
          this.superposed = true;
        }
      }

      this.glow = Math.max(0, this.glow - 0.05);
      this.vx  += (Math.random() - 0.5) * 0.01;
      this.vy  += (Math.random() - 0.5) * 0.01;
      const spd = Math.hypot(this.vx, this.vy);
      if (spd > 0.8) { this.vx *= 0.8 / spd; this.vy *= 0.8 / spd; }
    }

    // Smooth alpha
    this.alpha += (this.targetA - this.alpha) * 0.06;

    // Trail
    if (this.observed) {
      this.trail.push({ x: this.x, y: this.y, a: this.alpha });
      if (this.trail.length > this.trailMax) this.trail.shift();
    } else {
      if (this.trail.length) this.trail.shift();
    }
  }

  draw(ctx) {
    if (this.alpha < 0.01) return;
    const a = this.alpha;

    // Trail
    if (this.trail.length > 1) {
      ctx.save();
      this.trail.forEach((p, i) => {
        if (i === 0) return;
        const prev = this.trail[i - 1];
        const ta = (i / this.trail.length) * a * 0.3;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `hsla(${this.hue},70%,65%,${ta})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });
      ctx.restore();
    }

    // Glow halo when observed
    if (this.glow > 0.05) {
      const gr = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 8 * this.glow + 4);
      gr.addColorStop(0, `hsla(${this.hue},80%,70%,${a * this.glow * 0.4})`);
      gr.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 8 * this.glow + 4, 0, Math.PI * 2);
      ctx.fillStyle = gr;
      ctx.fill();
    }

    // Core particle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue},75%,70%,${a})`;
    ctx.fill();

    // Spin indicator (observed only)
    if (this.observed && a > 0.3) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.spin);
      ctx.beginPath();
      ctx.moveTo(-this.r * 2.5, 0);
      ctx.lineTo(this.r * 2.5, 0);
      ctx.strokeStyle = `hsla(${this.hue},90%,80%,${a * 0.4})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    }
  }
}

// ════════════════════════════════════════════
// WAVE FUNCTION VISUALISER
// ════════════════════════════════════════════
class WaveField {
  constructor() {
    this.waves = Array.from({ length: 5 }, (_, i) => ({
      phase:  Math.random() * Math.PI * 2,
      freq:   0.003 + i * 0.0015,
      amp:    State.H * (0.03 + i * 0.01),
      y:      State.H * (0.2 + i * 0.15),
      speed:  0.001 + i * 0.0005,
      alpha:  0.02 + Math.random() * 0.03,
      hue:    200 + i * 15,
    }));
  }

  draw(ctx, t) {
    this.waves.forEach(w => {
      w.phase += w.speed;
      ctx.beginPath();
      ctx.moveTo(0, w.y);

      for (let x = 0; x <= State.W; x += 3) {
        const influence = Math.max(0, 1 - Math.abs(x - State.mouse.x) / (State.W * 0.4));
        const disturb   = influence * 30 * Math.sin((x - State.mouse.x) * 0.02 + t * 0.01);
        const y = w.y
          + Math.sin(x * w.freq + w.phase) * w.amp
          + Math.sin(x * w.freq * 1.7 + w.phase * 0.6) * w.amp * 0.3
          + disturb;
        ctx.lineTo(x, y);
      }

      const mx = Math.max(0, Math.min(State.mouse.x / State.W, 1));
      const alpha = w.alpha + mx * 0.04;
      ctx.strokeStyle = `hsla(${w.hue},60%,65%,${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });
  }
}

// ════════════════════════════════════════════
// ENTANGLEMENT LINES
// ════════════════════════════════════════════
function drawEntanglement(particles, ctx) {
  const observed = particles.filter(p => p.observed && p.alpha > 0.5);
  if (observed.length < 2) return;

  for (let i = 0; i < observed.length; i++) {
    for (let j = i + 1; j < observed.length; j++) {
      const a = observed[i], b = observed[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist > 300) continue;
      const alpha = (1 - dist / 300) * 0.2;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      // Curved arc — entanglement path
      const mx = (a.x + b.x) / 2 + (Math.random() - 0.5) * 30;
      const my = (a.y + b.y) / 2 - 40;
      ctx.quadraticCurveTo(mx, my, b.x, b.y);
      ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
}

// ════════════════════════════════════════════
// PROBABILITY CLOUD
// ════════════════════════════════════════════
function drawProbabilityCloud(particles, ctx, t) {
  const superposed = particles.filter(p => p.superposed);
  superposed.forEach(p => {
    const a = p.alpha;
    if (a < 0.005) return;
    // Draw probability cloud as concentric fading rings
    for (let ring = 0; ring < 3; ring++) {
      const r = p.r * (3 + ring * 4) + Math.sin(t * p.freq * 60 + p.phase + ring) * 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${p.hue},50%,60%,${a * (0.12 - ring * 0.04)})`;
      ctx.lineWidth   = 0.5;
      ctx.stroke();
    }
  });
}

// ════════════════════════════════════════════
// BACKGROUND — deep space
// ════════════════════════════════════════════
function drawBackground(ctx, t) {
  ctx.fillStyle = `rgba(4,4,10,0.18)`;
  ctx.fillRect(0, 0, State.W, State.H);

  // Subtle nebula glow in centre
  const ng = ctx.createRadialGradient(State.W/2, State.H/2, 0, State.W/2, State.H/2, State.H * 0.7);
  ng.addColorStop(0, 'rgba(20,15,35,0.3)');
  ng.addColorStop(1, 'transparent');
  ctx.fillStyle = ng;
  ctx.fillRect(0, 0, State.W, State.H);

  // Cursor field
  if (State.mouse.x > 0 && State.started) {
    const cg = ctx.createRadialGradient(State.mouse.x, State.mouse.y, 0, State.mouse.x, State.mouse.y, 250);
    cg.addColorStop(0, 'rgba(201,168,76,0.05)');
    cg.addColorStop(1, 'transparent');
    ctx.fillStyle = cg;
    ctx.fillRect(0, 0, State.W, State.H);
  }
}

// ════════════════════════════════════════════
// FLOATING QUANTUM WORDS
// ════════════════════════════════════════════
const QUANTUM_WORDS = [
  'superposition', 'collapse', 'entanglement', 'uncertainty',
  'observe', 'wave function', 'probability', 'decoherence',
  'measurement', 'non-locality', 'interference', 'duality',
  'awareness', 'impermanence', 'attention', 'perception',
  'eigenstate', 'coherence', 'tunnelling', 'spin',
];

function spawnFloatingWords() {
  const container = document.getElementById('floating-words');
  if (!container) return;

  QUANTUM_WORDS.forEach((word, i) => {
    const el = document.createElement('div');
    el.className = 'q-word';
    el.textContent = word;
    el.style.cssText = `
      left: ${5 + Math.random() * 85}%;
      top:  ${5 + Math.random() * 85}%;
      font-size: ${clamp(0.8, 1.2 + Math.random() * 1.8, 3)}rem;
      font-weight: ${Math.random() > 0.5 ? 300 : 700};
      font-style: ${Math.random() > 0.5 ? 'italic' : 'normal'};
      opacity: 0;
      transform: rotate(${(Math.random() - 0.5) * 8}deg);
    `;
    container.appendChild(el);
  });
}

function updateFloatingWords() {
  const words = document.querySelectorAll('.q-word');
  words.forEach(el => {
    const rect = el.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    const dist = Math.hypot(cx - State.mouse.x, cy - State.mouse.y);
    if (dist < 200 && State.started) {
      el.style.opacity = Math.min(0.4, (1 - dist / 200) * 0.6) + '';
      el.classList.add('visible');
    } else {
      el.style.opacity = '0';
      el.classList.remove('visible');
    }
  });
}

function clamp(min, val, max) { return Math.min(Math.max(val, min), max); }

// ════════════════════════════════════════════
// CUSTOM CURSOR
// ════════════════════════════════════════════
const cursorEl = document.getElementById('observer-cursor');
let cx = State.W / 2, cy = State.H / 2;

document.addEventListener('mousemove', e => {
  State.mouse.vx = e.clientX - State.mouse.x;
  State.mouse.vy = e.clientY - State.mouse.y;
  State.mouse.x  = e.clientX;
  State.mouse.y  = e.clientY;
});

document.addEventListener('touchmove', e => {
  const t = e.touches[0];
  State.mouse.x = t.clientX;
  State.mouse.y = t.clientY;
}, { passive: true });

function updateCursor() {
  cx += (State.mouse.x - cx) * 0.12;
  cy += (State.mouse.y - cy) * 0.12;
  if (cursorEl) {
    cursorEl.style.left = cx + 'px';
    cursorEl.style.top  = cy + 'px';

    const speed = Math.hypot(State.mouse.vx, State.mouse.vy);
    if (speed > 2 && State.started) {
      cursorEl.classList.add('observing');
    } else {
      cursorEl.classList.remove('observing');
    }
  }
}

// ════════════════════════════════════════════
// OBSERVATION COUNTER
// ════════════════════════════════════════════
const obsCountEl = document.getElementById('obs-count');
const obsCounterEl = document.getElementById('obs-counter');

function updateCounter(particles) {
  const observed = particles.filter(p => p.observed).length;
  if (observed !== State.obsCount) {
    State.obsCount = observed;
    if (obsCountEl) obsCountEl.textContent = State.obsCount;
    obsCounterEl?.classList.add('flash');
    setTimeout(() => obsCounterEl?.classList.remove('flash'), 300);
  }
}

// ════════════════════════════════════════════
// CLICK — QUANTUM COLLAPSE EVENT
// ════════════════════════════════════════════
document.addEventListener('click', e => {
  if (!State.started) return;
  const mx = e.clientX, my = e.clientY;

  // Burst collapse
  particles.forEach(p => {
    const dist = Math.hypot(p.x - mx, p.y - my);
    if (dist < 300) {
      if (p.observed || p.superposed) {
        // Force collapse
        p.superposed = false;
        p.collapsed  = true;
        p.targetA    = Math.random() > 0.5 ? 0 : 0.9;
        if (p.targetA === 0) {
          setTimeout(() => { p.superposed = true; p.targetA = 0; }, 1000 + Math.random() * 2000);
        }
      }
      if (Sound.ctx && Sound.enabled) {
        const freq = 220 + (1 - dist/300) * 660;
        Sound.ping(freq, 0.07);
      }
    }
  });

  // Ripple visual
  spawnClickRipple(mx, my);
});

function spawnClickRipple(x, y) {
  for (let i = 0; i < 3; i++) {
    const ring = document.createElement('div');
    ring.style.cssText = `
      position:fixed; left:${x}px; top:${y}px;
      width:4px; height:4px; border-radius:50%;
      border:1px solid rgba(201,168,76,${0.8 - i * 0.2});
      transform:translate(-50%,-50%);
      pointer-events:none; z-index:900;
      animation: ripple-out ${0.6 + i * 0.2}s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s forwards;
    `;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 1000);
  }
  if (!document.getElementById('ripple-kf')) {
    const s = document.createElement('style');
    s.id = 'ripple-kf';
    s.textContent = `@keyframes ripple-out {
      to { width:240px; height:240px; opacity:0; border-color:rgba(201,168,76,0); }
    }`;
    document.head.appendChild(s);
  }
}

// ════════════════════════════════════════════
// SOUND ENGINE
// ════════════════════════════════════════════
const Sound = {
  ctx:       null,
  master:    null,
  enabled:   false,

  init() {
    if (this.ctx) return;
    this.ctx    = new (window.AudioContext || window.webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.setValueAtTime(0, this.ctx.currentTime);
    this.master.connect(this.ctx.destination);
  },

  start() {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    this.enabled = true;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setValueAtTime(this.master.gain.value, this.ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(0.6, this.ctx.currentTime + 2);
    this._buildAmbient();
    this._scheduleBells();
  },

  stop() {
    if (!this.ctx) return;
    this.enabled = false;
    this.master.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);
  },

  _buildAmbient() {
    // Deep pad drones
    [55, 82.4, 110, 146.8, 164.8].forEach((f, i) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const lfo = this.ctx.createOscillator();
      const lg  = this.ctx.createGain();

      o.type = 'sine';
      o.frequency.value = f;
      lfo.frequency.value = 0.05 + i * 0.03;
      lg.gain.value = 0.4;
      lfo.connect(lg); lg.connect(o.frequency);

      g.gain.value = 0.018 / (i * 0.4 + 1);
      o.connect(g); g.connect(this.master);
      lfo.start(); o.start();
    });

    // High shimmer
    [440, 528, 659.3].forEach(f => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const fl = this.ctx.createBiquadFilter();
      o.type = 'triangle';
      o.frequency.value = f;
      fl.type = 'lowpass';
      fl.frequency.value = 1200;
      g.gain.value = 0.004;
      o.connect(fl); fl.connect(g); g.connect(this.master);
      o.start();
    });

    // Pink noise — forest ambience
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 4, this.ctx.sampleRate);
    const d   = buf.getChannelData(0);
    let b0=0,b1=0,b2=0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random()*2-1;
      b0 = 0.99886*b0 + w*0.0555179;
      b1 = 0.99332*b1 + w*0.0750759;
      b2 = 0.96900*b2 + w*0.1538520;
      d[i] = (b0+b1+b2+w*0.5)*0.11;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const fl  = this.ctx.createBiquadFilter();
    fl.type = 'bandpass'; fl.frequency.value = 250; fl.Q.value = 0.3;
    const ng  = this.ctx.createGain();
    ng.gain.value = 0.012;
    src.connect(fl); fl.connect(ng); ng.connect(this.master);
    src.start();
  },

  _scheduleBells() {
    if (!this.enabled) return;
    const freqs = [528, 660, 792, 880, 1056, 1320];
    const f = freqs[Math.floor(Math.random() * freqs.length)];
    this.ping(f, 0.05 + Math.random() * 0.04);
    setTimeout(() => this._scheduleBells(), 2500 + Math.random() * 5500);
  },

  ping(freq, vol = 0.07) {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const o   = this.ctx.createOscillator();
    const g   = this.ctx.createGain();
    const rev = this._reverb(2);

    o.type = 'sine';
    o.frequency.setValueAtTime(freq, now);
    o.frequency.exponentialRampToValueAtTime(freq * 0.997, now + 2);

    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(vol, now + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    o.connect(g);
    if (rev) { g.connect(rev); rev.connect(this.master); }
    else g.connect(this.master);
    o.start(now); o.stop(now + 2.5);
  },

  _reverb(sec) {
    if (!this.ctx) return null;
    const cv  = this.ctx.createConvolver();
    const len = this.ctx.sampleRate * sec;
    const b   = this.ctx.createBuffer(2, len, this.ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const ch = b.getChannelData(c);
      for (let i = 0; i < len; i++) {
        ch[i] = (Math.random()*2-1) * Math.pow(1-i/len, 2.2);
      }
    }
    cv.buffer = b;
    return cv;
  },

  // Modulate ambient from observed particle count
  modulateFromObservation(count) {
    if (!this.master || !this.enabled) return;
    const vol = Math.min(0.8, 0.4 + count * 0.02);
    this.master.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.5);
  }
};

// ════════════════════════════════════════════
// SOUND BUTTON
// ════════════════════════════════════════════
const soundBtn = document.getElementById('sound-btn');
soundBtn?.addEventListener('click', () => {
  if (Sound.enabled) {
    Sound.stop();
    soundBtn.classList.remove('on');
  } else {
    Sound.start();
    soundBtn.classList.add('on');
  }
});

// ════════════════════════════════════════════
// ENTRY OVERLAY
// ════════════════════════════════════════════
const overlay   = document.getElementById('entry-overlay');
const startBtn  = document.getElementById('entry-start');

startBtn?.addEventListener('click', () => {
  overlay.classList.add('hidden');
  State.started = true;
  Sound.start();
  soundBtn?.classList.add('on');
  setTimeout(() => overlay.remove(), 1400);
});

// Back button
document.getElementById('hud-back')?.addEventListener('click', e => {
  e.preventDefault();
  document.body.style.transition = 'opacity 0.6s ease';
  document.body.style.opacity    = '0';
  setTimeout(() => window.location.href = 'index.html', 600);
});

// ════════════════════════════════════════════
// BUILD PARTICLES
// ════════════════════════════════════════════
const PARTICLE_COUNT = 120;
const particles = Array.from({ length: PARTICLE_COUNT }, () => new QuantumParticle());
const waveField = new WaveField();

spawnFloatingWords();

// ════════════════════════════════════════════
// MAIN LOOP
// ════════════════════════════════════════════
let t = 0;
let lastPing = 0;

function loop() {
  t += 0.016;

  // Background
  drawBackground(ctx, t);

  // Wave fields (quantum probability waves)
  if (State.started) waveField.draw(ctx, t);

  // Probability clouds (superposition)
  drawProbabilityCloud(particles, ctx, t);

  // Entanglement lines
  drawEntanglement(particles, ctx);

  // Particles
  particles.forEach(p => { p.update(t); p.draw(ctx); });

  // Sound modulation from observation
  if (t - lastPing > 0.5) {
    const obs = particles.filter(p => p.observed).length;
    Sound.modulateFromObservation(obs);
    lastPing = t;
  }

  // Cursor
  updateCursor();

  // Floating words
  if (State.started) updateFloatingWords();

  // Counter
  updateCounter(particles);

  requestAnimationFrame(loop);
}

loop();
