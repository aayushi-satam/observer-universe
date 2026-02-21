/* ============================================
   OBSERVER UNIVERSE — typography.js
   Animated text reactions, cursor proximity, glitch
   ============================================ */

'use strict';

// ---- Typography proximity reactions ----
function initTypography() {
  initHeadlineReaction();
  initShimmerText();
  initGlitchHover();
  initScatterEffect();

  // Register loop updater
  ObserverUniverse._updateTypography = updateTypographyFrame;
}

// ---- Headline letter-by-letter tilt on proximity ----
function initHeadlineReaction() {
  const headlines = document.querySelectorAll('.headline-main, .headline-section');

  headlines.forEach(headline => {
    // Split text into chars while preserving structure
    headline.querySelectorAll('.line-inner').forEach(line => {
      const text = line.textContent;
      line.textContent = '';
      line.classList.add('scatter-text');
      line.setAttribute('data-original', text);

      text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.setProperty('--tx', `${(Math.random() - 0.5) * 60}px`);
        span.style.setProperty('--ty', `${(Math.random() - 0.5) * 40}px`);
        span.style.setProperty('--rot', `${(Math.random() - 0.5) * 20}deg`);
        span.style.transitionDelay = `${i * 0.015}s`;
        line.appendChild(span);
      });
    });
  });
}

// ---- Per-frame typography updates ----
function updateTypographyFrame() {
  const mx = ObserverUniverse.mouse.x;
  const my = ObserverUniverse.mouse.y;

  // Shimmer proximity
  document.querySelectorAll('.shimmer-text').forEach(el => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(cx - mx, cy - my);

    if (dist < 300) {
      el.classList.add('near-cursor');
      const pct = Math.round((1 - dist / 300) * 100);
      el.style.backgroundPosition = `-${pct}% 0`;
    } else {
      el.classList.remove('near-cursor');
      el.style.backgroundPosition = '0% 0';
    }
  });

  // Body text proximity fade-in
  document.querySelectorAll('.body-text').forEach(el => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(cx - mx, cy - my);
    const maxDist = 400;

    if (dist < maxDist) {
      const opacity = 0.5 + (1 - dist / maxDist) * 0.5;
      el.style.color = `rgba(154,144,136,${opacity})`;
    }
  });
}

// ---- Shimmer text init ----
function initShimmerText() {
  document.querySelectorAll('.headline-main, .headline-section').forEach(el => {
    el.classList.add('shimmer-text');
  });
}

// ---- Glitch hover on headlines ----
function initGlitchHover() {
  document.querySelectorAll('.headline-main, .headline-section').forEach(el => {
    el.classList.add('glitch-hover');
    el.setAttribute('data-text', el.textContent.trim());

    let glitchTimer;

    el.addEventListener('mouseenter', () => {
      glitchTimer = setInterval(() => {
        if (Math.random() > 0.6) {
          el.classList.add('glitching');
          setTimeout(() => el.classList.remove('glitching'), 100);
        }
      }, 200);
    });

    el.addEventListener('mouseleave', () => {
      clearInterval(glitchTimer);
      el.classList.remove('glitching');
    });
  });
}

// ---- Scatter text effect (disperses chars on cursor proximity) ----
function initScatterEffect() {
  let isScattered = false;
  let scatterTimeout;

  document.addEventListener('mousemove', e => {
    const speed = Math.hypot(ObserverUniverse.mouse.vx, ObserverUniverse.mouse.vy);

    // Fast cursor movement = scatter text temporarily
    if (speed > 40 && !isScattered) {
      isScattered = true;
      document.querySelectorAll('.scatter-text').forEach(el => {
        // Only scatter if cursor is close
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        if (Math.hypot(cx - e.clientX, cy - e.clientY) < 200) {
          el.classList.add('dispersed');
        }
      });

      clearTimeout(scatterTimeout);
      scatterTimeout = setTimeout(() => {
        document.querySelectorAll('.scatter-text').forEach(el => el.classList.remove('dispersed'));
        isScattered = false;
      }, 600);
    }
  });
}

// ---- Typewriter effect ----
function typewriterReveal(el, text, speed = 60) {
  el.textContent = '';
  el.classList.add('typewriter-cursor');
  let i = 0;

  return new Promise(resolve => {
    const timer = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        el.classList.remove('typewriter-cursor');
        resolve();
      }
    }, speed);
  });
}

// ---- Magnetic text — pulls chars towards cursor ----
function initMagneticText(selector, strength = 0.3) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.1s linear';
    });
  });
}

// ---- Word-by-word reveal ----
function wrapWordsInSpans(el) {
  const text = el.textContent;
  el.innerHTML = text.split(' ').map((w, i) =>
    `<span class="word-reveal" style="animation-delay:${i * 0.08}s">${w}&nbsp;</span>`
  ).join('');
}

// ---- Auto-init ----
document.addEventListener('DOMContentLoaded', () => {
  if (typeof ObserverUniverse !== 'undefined') {
    initTypography();
    initMagneticText('.cta-btn', 0.25);

    // Wrap body text words
    document.querySelectorAll('.body-text').forEach(wrapWordsInSpans);
  }
});

// Export for use
window.typewriterReveal = typewriterReveal;
