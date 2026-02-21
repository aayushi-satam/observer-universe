const ObserverObjects = (function () {
  const objects = [];
  const particles = [];
  let canvas, ctx, mouse, W, H;

  const SHAPES = ['circle', 'square', 'line', 'triangle'];
  const OBJECT_COUNT = 28;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function createObject() {
    const depth = rand(0.2, 1);
    return {
      x: rand(0, W),
      y: rand(0, H),
      baseX: 0,
      baseY: 0,
      vx: rand(-0.15, 0.15) * depth,
      vy: rand(-0.1, 0.08) * depth,
      size: rand(10, 60) * depth,
      shape: randChoice(SHAPES),
      rotation: rand(0, Math.PI * 2),
      rotationSpeed: rand(-0.008, 0.008),
      opacity: rand(0.03, 0.15),
      targetOpacity: rand(0.03, 0.15),
      baseOpacity: rand(0.03, 0.15),
      depth,
      glow: 0,
      observed: false,
    };
  }

  function spawnParticle(x, y) {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + rand(-0.3, 0.3);
      const speed = rand(1.5, 5);
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: rand(0.018, 0.04),
        size: rand(1, 3.5),
      });
    }
  }

  function updateObjects() {
    for (const obj of objects) {
      obj.x += obj.vx;
      obj.y += obj.vy;

      if (obj.x < -100) obj.x = W + 100;
      if (obj.x > W + 100) obj.x = -100;
      if (obj.y < -100) obj.y = H + 100;
      if (obj.y > H + 100) obj.y = -100;

      const dx = mouse.x - obj.x;
      const dy = mouse.y - obj.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const observeRadius = 200 * obj.depth;
      const observed = dist < observeRadius;

      obj.observed = observed;

      if (observed) {
        const influence = 1 - dist / observeRadius;
        obj.targetOpacity = obj.baseOpacity + influence * (0.7 - obj.baseOpacity);
        obj.rotationSpeed = obj.rotationSpeed * 0.92;
        obj.glow = influence;
      } else {
        obj.targetOpacity = obj.baseOpacity;
        obj.glow = obj.glow * 0.95;
        if (Math.abs(obj.rotationSpeed) < 0.015) {
          obj.rotationSpeed += rand(-0.001, 0.001);
        }
      }

      obj.opacity += (obj.targetOpacity - obj.opacity) * 0.06;
      obj.rotation += obj.rotationSpeed;
    }
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life -= p.decay;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function drawGlow(obj) {
    if (obj.glow < 0.01) return;
    const radius = obj.size * 3 * obj.glow;
    const grad = ctx.createRadialGradient(obj.x, obj.y, 0, obj.x, obj.y, radius);
    grad.addColorStop(0, `rgba(245,245,240,${obj.glow * 0.12})`);
    grad.addColorStop(1, 'rgba(245,245,240,0)');
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawObject(obj) {
    ctx.save();
    ctx.globalAlpha = obj.opacity;
    ctx.strokeStyle = `rgba(245,245,240,1)`;
    ctx.lineWidth = Math.max(0.3, obj.depth * 0.8);
    ctx.translate(obj.x, obj.y);
    ctx.rotate(obj.rotation);

    ctx.beginPath();
    switch (obj.shape) {
      case 'circle':
        ctx.arc(0, 0, obj.size / 2, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'square':
        const half = obj.size / 2;
        ctx.rect(-half, -half, obj.size, obj.size);
        ctx.stroke();
        break;
      case 'triangle':
        const s = obj.size;
        ctx.moveTo(0, -s / 2);
        ctx.lineTo(s / 2, s / 2);
        ctx.lineTo(-s / 2, s / 2);
        ctx.closePath();
        ctx.stroke();
        break;
      case 'line':
        ctx.moveTo(-obj.size / 2, 0);
        ctx.lineTo(obj.size / 2, 0);
        ctx.stroke();
        break;
    }
    ctx.restore();
  }

  function drawParticles() {
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = p.life * 0.8;
      ctx.fillStyle = 'rgba(245,245,240,1)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init(canvasEl, ctxRef, mouseRef) {
    canvas = canvasEl;
    ctx = ctxRef;
    mouse = mouseRef;
    W = canvas.width;
    H = canvas.height;

    objects.length = 0;
    for (let i = 0; i < OBJECT_COUNT; i++) {
      objects.push(createObject());
    }
  }

  function resize(w, h) {
    W = w;
    H = h;
  }

  function update() {
    updateObjects();
    updateParticles();
  }

  function draw() {
    for (const obj of objects) {
      drawGlow(obj);
    }
    for (const obj of objects) {
      drawObject(obj);
    }
    drawParticles();
  }

  function onClick(x, y) {
    spawnParticle(x, y);
  }

  return { init, resize, update, draw, onClick };
})();
