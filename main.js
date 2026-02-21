(function () {
  const canvas = document.getElementById('universe-canvas');
  const ctx = canvas.getContext('2d');
  const cursorGlow = document.getElementById('cursor-glow');
  const entryScreen = document.getElementById('entry-screen');
  const scrollIndicator = document.getElementById('scroll-indicator');

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let interacted = false;
  let animId = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ObserverObjects.resize(canvas.width, canvas.height);
  }

  function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const grad = ctx.createRadialGradient(
      mouse.x, mouse.y, 0,
      mouse.x, mouse.y, Math.max(canvas.width, canvas.height) * 0.7
    );
    grad.addColorStop(0, 'rgba(20,18,14,0.6)');
    grad.addColorStop(1, 'rgba(10,10,10,0)');

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawGrid() {
    ctx.save();
    ctx.globalAlpha = 0.025;
    ctx.strokeStyle = '#f5f5f0';
    ctx.lineWidth = 0.5;

    const spacing = 90;
    for (let x = 0; x < canvas.width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function loop() {
    drawBackground();
    drawGrid();
    ObserverObjects.update();
    ObserverObjects.draw();
    ObserverTypography.update();
    animId = requestAnimationFrame(loop);
  }

  function handleMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.style.opacity = '1';

    ObserverSound.onMouseMove(e.clientX, e.clientY);

    if (!interacted) {
      interacted = true;
      entryScreen.classList.add('hidden');
      setTimeout(() => {
        scrollIndicator.classList.remove('hidden');
      }, 2000);
    }
  }

  function handleTouchMove(e) {
    const t = e.touches[0];
    handleMouseMove({ clientX: t.clientX, clientY: t.clientY });
  }

  function handleClick(e) {
    ObserverObjects.onClick(e.clientX, e.clientY);
    ObserverSound.onClick();
    ObserverSound.resume();
  }

  function handleTouchStart(e) {
    const t = e.touches[0];
    handleClick({ clientX: t.clientX, clientY: t.clientY });
  }

  function handleScroll() {
    const scrolled = window.scrollY > 100;
    scrollIndicator.classList.toggle('hidden', scrolled);
  }

  function init() {
    resize();
    ObserverObjects.init(canvas, ctx, mouse);
    ObserverTypography.init(mouse);

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    loop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
