/* ============================================
   OBSERVER UNIVERSE — objects.js
   Quantum visual objects, proximity & cursor interactions
   ============================================ */

'use strict';

// ---- Spawner: create SVG-based floating objects ----
const ObjectSpawner = {
  types: ['circle', 'ring', 'triangle', 'line', 'cross', 'dot-cluster', 'arc', 'diamond'],

  spawn(container, options = {}) {
    const type = options.type || this.types[Math.floor(Math.random() * this.types.length)];
    const el = document.createElement('div');
    el.className = `float-obj obj-${type}`;
    el.dataset.quantum = '1';
    el.dataset.type = type;

    // Random position
    const side = Math.random();
    if (side < 0.25) {
      el.style.left = (5 + Math.random() * 15) + '%';
    } else if (side < 0.5) {
      el.style.right = (5 + Math.random() * 15) + '%';
    }

    el.style.top = (10 + Math.random() * 80) + '%';

    // SVG content for richer shapes
    el.innerHTML = this.getSVG(type);

    // Animation parameters (vary by session)
    const duration = 4 + Math.random() * 6;
    const delay = Math.random() * 3;
    el.style.animation = `float-sway ${duration}s ease-in-out ${delay}s infinite alternate`;

    container.appendChild(el);
    return el;
  },

  getSVG(type) {
    const color = 'rgba(200,169,110,0.4)';
    const colorFaint = 'rgba(200,169,110,0.15)';
    const size = Math.floor(40 + Math.random() * 80);

    switch (type) {
      case 'circle':
        return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="48" stroke="${color}" stroke-width="1"/>
          <circle cx="50" cy="50" r="30" stroke="${colorFaint}" stroke-width="0.5"/>
        </svg>`;

      case 'ring':
        return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="45" stroke="${color}" stroke-width="2" stroke-dasharray="8 4"/>
        </svg>`;

      case 'triangle':
        return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
          <polygon points="50,5 95,90 5,90" stroke="${color}" stroke-width="1" fill="${colorFaint}"/>
        </svg>`;

      case 'line':
        return `<svg width="2" height="${size * 2}" viewBox="0 0 2 200" fill="none">
          <line x1="1" y1="0" x2="1" y2="200" stroke="url(#lg)" stroke-width="1"/>
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="transparent"/>
              <stop offset="50%" stop-color="rgba(200,169,110,0.6)"/>
              <stop offset="100%" stop-color="transparent"/>
            </linearGradient>
          </defs>
        </svg>`;

      case 'cross':
        return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
          <line x1="50" y1="10" x2="50" y2="90" stroke="${color}" stroke-width="1"/>
          <line x1="10" y1="50" x2="90" y2="50" stroke="${color}" stroke-width="1"/>
        </svg>`;

      case 'arc':
        return `<svg width="${size}" height="${size / 2}" viewBox="0 0 100 50" fill="none">
          <path d="M5,45 Q50,-5 95,45" stroke="${color}" stroke-width="1" fill="none"/>
        </svg>`;

      case 'diamond':
        return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
          <polygon points="50,5 95,50 50,95 5,50" stroke="${color}" stroke-width="1" fill="${colorFaint}"/>
        </svg>`;

      case 'dot-cluster':
        return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
          ${[30, 50, 70].flatMap(x => [30, 50, 70].map(y =>
            `<circle cx="${x}" cy="${y}" r="3" fill="${color}" opacity="${0.3 + Math.random() * 0.7}"/>`
          )).join('')}
        </svg>`;

      default:
        return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="48" stroke="${color}" stroke-width="1"/>
        </svg>`;
    }
  }
};

// CSS for float-sway animation (inject once)
(function injectObjectCSS() {
  if (document.getElementById('obj-keyframes')) return;
  const style = document.createElement('style');
  style.id = 'obj-keyframes';
  style.textContent = `
    @keyframes float-sway {
      from { transform: translateY(0px) rotate(0deg); }
      to   { transform: translateY(-20px) rotate(3deg); }
    }
    @keyframes shimmer-pulse {
      0%, 100% { filter: drop-shadow(0 0 4px rgba(200,169,110,0.2)); }
      50%       { filter: drop-shadow(0 0 12px rgba(200,169,110,0.5)); }
    }
    .float-obj.observed svg {
      animation: shimmer-pulse 2s ease-in-out infinite;
    }
    .float-obj svg {
      display: block;
      transition: filter 0.5s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1);
    }
    .float-obj {
      transition: opacity 0.9s cubic-bezier(0.25,0.1,0.25,1),
                  transform 1.2s cubic-bezier(0.16,1,0.3,1);
    }
  `;
  document.head.appendChild(style);
})();

// ---- Tree objects (CSS-based) ----
function spawnTrees(container) {
  const trees = [
    { bottom: 0, left: '3%', scale: 0.7, type: '' },
    { bottom: 0, left: '8%', scale: 1, type: '--tall' },
    { bottom: 0, right: '4%', scale: 0.8, type: '' },
    { bottom: 0, right: '10%', scale: 1.2, type: '--tall' },
  ];

  trees.forEach(t => {
    const el = document.createElement('div');
    el.className = `float-obj obj-tree obj-tree${t.type}`;
    el.dataset.quantum = '1';
    if (t.left) el.style.left = t.left;
    if (t.right) el.style.right = t.right;
    el.style.bottom = t.bottom + 'px';
    el.style.transform = `scaleX(${t.scale})`;
    el.style.opacity = 0;
    container.appendChild(el);

    // Session-based random visibility
    const delay = 300 + Math.random() * 2000;
    if (Math.random() > 0.2) {
      setTimeout(() => el.classList.add('observed'), delay);
    }
  });
}

// ---- Main objects init ----
function initObjects() {
  const layer = document.getElementById('objects-layer');
  if (!layer) return;

  // Spawn additional random objects
  const count = 4 + Math.floor(ObserverUniverse.session.seed * 4);
  for (let i = 0; i < count; i++) {
    ObjectSpawner.spawn(layer);
  }

  // Spawn trees
  spawnTrees(layer);

  // Mouse-repel / attract effect on observed objects
  layer.addEventListener('mousemove', () => {
    // Handled in main.js loop via _updateObjects
  });
}

// ---- Click: collapse/expand quantum state ----
document.addEventListener('click', function(e) {
  const layer = document.getElementById('objects-layer');
  if (!layer) return;

  // Burst of random quantum collapses around click
  const objects = document.querySelectorAll('[data-quantum]');
  const mx = e.clientX;
  const my = e.clientY;

  objects.forEach(obj => {
    const rect = obj.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(cx - mx, cy - my);

    if (dist < 300) {
      // Toggle observed state on click
      if (obj.classList.contains('observed')) {
        obj.classList.remove('observed');
        setTimeout(() => {
          if (Math.random() > 0.5) obj.classList.add('observed');
        }, 800 + Math.random() * 1200);
      } else {
        obj.classList.add('observed');
      }
    }
  });

  // Spawn click ripple
  spawnRipple(mx, my);
});

// ---- Ripple effect on click ----
function spawnRipple(x, y) {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: 4px;
    height: 4px;
    border: 1px solid rgba(200,169,110,0.6);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 200;
    animation: ripple-expand 0.8s cubic-bezier(0.16,1,0.3,1) forwards;
  `;
  document.body.appendChild(ripple);

  if (!document.getElementById('ripple-keyframe')) {
    const s = document.createElement('style');
    s.id = 'ripple-keyframe';
    s.textContent = `
      @keyframes ripple-expand {
        to { width: 200px; height: 200px; opacity: 0; border-color: rgba(200,169,110,0); }
      }
    `;
    document.head.appendChild(s);
  }

  setTimeout(() => ripple.remove(), 800);
}

// ---- Auto-init when DOM ready ----
document.addEventListener('DOMContentLoaded', () => {
  if (typeof ObserverUniverse !== 'undefined') {
    initObjects();
  }
});
