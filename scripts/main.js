/* ============================================
   OBSERVER UNIVERSE — main.js
   Core observer engine, session logic, navigation
   ============================================ */

'use strict';

// ---- Global state ----
const ObserverUniverse = {
  mouse: { x: -999, y: -999, vx: 0, vy: 0 },
  session: {
    seed: Math.random(),
    startTime: Date.now(),
    observedObjects: new Set(),
    sectionIndex: 1,
  },
  settings: {
    soundEnabled: false,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    proximityRadius: 220,
  },
  raf: null,
};

// ---- Main init ----
function initObserverUniverse(config = {}) {
  ObserverUniverse.session.sectionIndex = config.index || 1;
  ObserverUniverse.session.section = config.section || 'objective';

  initCanvas();
  initCursor();
  initParticles();
  initObserveTriggers();
  initObjectObservation();
  initSoundToggle();
  initNav();
  initVerticalText();
  initDecorativeElements();
  initSessionVariance();
  startLoop();

  // Trigger entrance animations
  setTimeout(() => {
    document.querySelectorAll('.observe-trigger').forEach((el, i) => {
      const delay = parseInt(el.dataset.delay) || i * 150;
      setTimeout(() => el.classList.add('visible'), delay);
    });
  }, 100);
}

// ---- Canvas ambient background ----
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, nodes = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    buildNodes();
  }

  function buildNodes() {
    nodes = Array.from({ length: 30 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 80 + 20,
      dx: (Math.random() - 0.5) * 0.15,
      dy: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.04 + 0.01,
      hue: Math.random() > 0.7 ? 40 : 200, // gold or cool
    }));
  }

  function drawCanvas() {
    ctx.clearRect(0, 0, w, h);

    // Vignette
    const vign = ctx.createRadialGradient(w / 2, h / 2, h * 0.1, w / 2, h / 2, h);
    vign.addColorStop(0, 'rgba(0,0,0,0)');
    vign.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = vign;
    ctx.fillRect(0, 0, w, h);

    // Nebula blobs
    nodes.forEach(n => {
      n.x += n.dx;
      n.y += n.dy;
      if (n.x < -n.r) n.x = w + n.r;
      if (n.x > w + n.r) n.x = -n.r;
      if (n.y < -n.r) n.y = h + n.r;
      if (n.y > h + n.r) n.y = -n.r;

      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      grad.addColorStop(0, `hsla(${n.hue}, 40%, 60%, ${n.opacity})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Cursor halo interaction
    const mx = ObserverUniverse.mouse.x;
    const my = ObserverUniverse.mouse.y;
    if (mx > 0) {
      const halo = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
      halo.addColorStop(0, 'rgba(200,169,110,0.04)');
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);
    }
  }

  ObserverUniverse._drawCanvas = drawCanvas;
  window.addEventListener('resize', resize);
  resize();
}

// ---- Custom cursor ----
function initCursor() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  let lx = -999, ly = -999;
  const ease = 0.1;

  window.addEventListener('mousemove', e => {
    ObserverUniverse.mouse.vx = e.clientX - ObserverUniverse.mouse.x;
    ObserverUniverse.mouse.vy = e.clientY - ObserverUniverse.mouse.y;
    ObserverUniverse.mouse.x = e.clientX;
    ObserverUniverse.mouse.y = e.clientY;
  });

  window.addEventListener('touchmove', e => {
    const t = e.touches[0];
    ObserverUniverse.mouse.x = t.clientX;
    ObserverUniverse.mouse.y = t.clientY;
  }, { passive: true });

  ObserverUniverse._updateCursor = function() {
    lx += (ObserverUniverse.mouse.x - lx) * ease;
    ly += (ObserverUniverse.mouse.y - ly) * ease;
    glow.style.left = lx + 'px';
    glow.style.top = ly + 'px';
  };
}

// ---- Floating particles ----
function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const count = 25;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const duration = 8 + Math.random() * 12;
    const delay = Math.random() * duration;
    const drift = (Math.random() - 0.5) * 100;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() > 0.8 ? 3 : 1.5}px;
      height: ${Math.random() > 0.8 ? 3 : 1.5}px;
      --drift: ${drift}px;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      opacity: ${0.2 + Math.random() * 0.4};
    `;
    container.appendChild(p);
  }
}

// ---- Scroll/enter observe triggers ----
function initObserveTriggers() {
  const triggers = document.querySelectorAll('.observe-trigger');
  if (!triggers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay) || 0;
        setTimeout(() => e.target.classList.add('visible'), delay);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  triggers.forEach(t => observer.observe(t));
}

// ---- Object proximity observation ----
function initObjectObservation() {
  const objects = document.querySelectorAll('[data-quantum]');
  if (!objects.length) return;

  // Random initial states per session
  objects.forEach(obj => {
    const sessionVisibility = Math.random();
    if (sessionVisibility > 0.35) {
      setTimeout(() => obj.classList.add('observed'), 500 + Math.random() * 2000);
    }
  });

  ObserverUniverse._updateObjects = function() {
    const mx = ObserverUniverse.mouse.x;
    const my = ObserverUniverse.mouse.y;
    const radius = ObserverUniverse.settings.proximityRadius;

    objects.forEach(obj => {
      const rect = obj.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(cx - mx, cy - my);

      if (dist < radius) {
        obj.classList.add('observed');
        const scale = 1 + (1 - dist / radius) * 0.15;
        obj.style.transform = `scale(${scale})`;

        if (!ObserverUniverse.session.observedObjects.has(obj)) {
          ObserverUniverse.session.observedObjects.add(obj);
          if (window.triggerObjectSound) triggerObjectSound(obj);
        }
      } else {
        // Quantum collapse — random unobservation
        if (Math.random() < 0.003) {
          obj.classList.remove('observed');
          obj.style.transform = '';
          ObserverUniverse.session.observedObjects.delete(obj);
        } else if (!obj.classList.contains('observed')) {
          // Spontaneous appearance (low probability)
          if (Math.random() < 0.001) {
            obj.classList.add('observed');
          }
        }
      }
    });
  };
}

// ---- Sound toggle ----
function initSoundToggle() {
  const btn = document.getElementById('sound-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    ObserverUniverse.settings.soundEnabled = !ObserverUniverse.settings.soundEnabled;
    btn.classList.toggle('active', ObserverUniverse.settings.soundEnabled);
    if (ObserverUniverse.settings.soundEnabled && window.startAmbient) {
      startAmbient();
    } else if (window.stopAmbient) {
      stopAmbient();
    }
  });
}

// ---- Navigation with transition ----
function initNav() {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('entering');
      setTimeout(() => { window.location.href = href; }, 450);
    });
  });

  // Fade in on load
  setTimeout(() => overlay.classList.remove('entering'), 50);
}

// ---- Vertical section label ----
function initVerticalText() {
  const section = document.body.dataset.section || '';
  if (!section) return;

  const vt = document.createElement('div');
  vt.className = 'vertical-text';
  vt.textContent = section.toUpperCase();
  document.body.appendChild(vt);
}

// ---- Decorative large letter ----
function initDecorativeElements() {
  const section = document.body.dataset.section || 'O';
  const letter = section[0].toUpperCase();

  const dl = document.createElement('div');
  dl.className = 'deco-letter';
  dl.textContent = letter;
  document.body.appendChild(dl);

  // Section number
  const idx = ObserverUniverse.session.sectionIndex;
  const sn = document.createElement('div');
  sn.className = 'section-number';
  sn.textContent = String(idx).padStart(2, '0');
  document.body.appendChild(sn);
}

// ---- Session variance (unique experience per visit) ----
function initSessionVariance() {
  const seed = ObserverUniverse.session.seed;

  // Slightly shift particle speeds
  document.querySelectorAll('.particle').forEach(p => {
    const dur = parseFloat(p.style.animationDuration);
    p.style.animationDuration = (dur * (0.8 + seed * 0.4)) + 's';
  });

  // Random proximity radius variation
  ObserverUniverse.settings.proximityRadius = 180 + seed * 100;
}

// ---- Main RAF loop ----
function startLoop() {
  function loop() {
    if (ObserverUniverse._drawCanvas) ObserverUniverse._drawCanvas();
    if (ObserverUniverse._updateCursor) ObserverUniverse._updateCursor();
    if (ObserverUniverse._updateObjects) ObserverUniverse._updateObjects();
    if (ObserverUniverse._updateTypography) ObserverUniverse._updateTypography();
    ObserverUniverse.raf = requestAnimationFrame(loop);
  }
  ObserverUniverse.raf = requestAnimationFrame(loop);
}

// ---- Keyboard navigation ----
document.addEventListener('keydown', e => {
  const sections = [
    'index.html',
    'sections/science.html',
    'sections/art.html',
    'sections/philosophy.html',
    'sections/technology.html',
    'sections/spirituality.html',
    'sections/reflection.html',
  ];
  const idx = ObserverUniverse.session.sectionIndex - 1;

  if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && idx < sections.length - 1) {
    window.location.href = sections[idx + 1];
  }
  if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && idx > 0) {
    window.location.href = sections[idx - 1];
  }
});
