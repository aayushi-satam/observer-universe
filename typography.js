const ObserverTypography = (function () {
  let mouse = { x: 0, y: 0 };

  function init(mouseRef) {
    mouse = mouseRef;
    setupScrollObserver();
    setupHeadlineTilt();
  }

  function setupScrollObserver() {
    const sections = document.querySelectorAll('.section-inner');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((el) => observer.observe(el));
  }

  function setupHeadlineTilt() {
    const headlines = document.querySelectorAll('.headline');

    headlines.forEach((headline) => {
      const section = headline.closest('.section');
      if (!section) return;

      const handleMove = () => {
        const rect = section.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = (mouse.x - centerX) / window.innerWidth;
        const dy = (mouse.y - centerY) / window.innerHeight;

        const tiltX = dy * -2.5;
        const tiltY = dx * 2.5;
        const scale = 1 + Math.abs(dx) * 0.015;

        headline.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;
      };

      window.addEventListener('mousemove', handleMove, { passive: true });
    });
  }

  function update() {}

  return { init, update };
})();
