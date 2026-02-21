const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
let objects = [];
let particles = [];
let silhouettes = [];


// ---------- AUDIO REACTIVE SYSTEM ----------
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let masterGain = audioCtx.createGain();
masterGain.gain.value = 0.05;
masterGain.connect(audioCtx.destination);

function playTone(freq) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.value = freq;
  osc.type = "sawtooth";
  osc.connect(gain);
  gain.connect(masterGain);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.4);
}


// ---------- CURSOR ----------
const cursor = document.getElementById("cursor");

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

document.addEventListener("click", () => {
  cursor.classList.add("click");
  setTimeout(() => cursor.classList.remove("click"), 150);
  burst(mouse.x, mouse.y, 60);
  playTone(150 + Math.random() * 400);
});


// ---------- COLORS ----------
const palette = [
  "#00f0ff",
  "#9d4dff",
  "#00ff9c",
  "#ff0080",
  "#d4af37"
];

function randomColor() {
  return palette[Math.floor(Math.random() * palette.length)];
}


// ---------- OBJECT LAYERS (DEPTH) ----------
function createObject(depth) {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 20 + Math.random() * 50,
    angle: Math.random() * Math.PI,
    color: randomColor(),
    opacity: 0.1,
    depth: depth,
    shape: Math.floor(Math.random() * 3)
  };
}

for (let i = 0; i < 40; i++) {
  objects.push(createObject(Math.random() * 3));
}


// ---------- FOREST SILHOUETTES ----------
for (let i = 0; i < 20; i++) {
  silhouettes.push({
    x: Math.random() * canvas.width,
    height: 200 + Math.random() * 300
  });
}


// ---------- PARTICLE BURST ----------
function burst(x, y, amount) {
  for (let i = 0; i < amount; i++) {
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 60,
      color: randomColor()
    });
  }
}


// ---------- DRAW SHAPES ----------
function drawShape(o) {
  ctx.save();
  ctx.translate(o.x, o.y);
  ctx.rotate(o.angle += 0.03 * (1 / o.depth));
  ctx.globalAlpha = o.opacity;

  ctx.strokeStyle = o.color;
  ctx.lineWidth = 2;

  if (o.shape === 0) {
    ctx.strokeRect(-o.size / 2, -o.size / 2, o.size, o.size);
  } else if (o.shape === 1) {
    ctx.beginPath();
    ctx.arc(0, 0, o.size / 2, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -o.size / 2);
    ctx.lineTo(o.size / 2, o.size / 2);
    ctx.lineTo(-o.size / 2, o.size / 2);
    ctx.closePath();
    ctx.stroke();
  }

  ctx.restore();
}


// ---------- ANIMATION ----------
function animate() {
  ctx.fillStyle = "rgba(5,5,5,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bloom illusion
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#00f0ff";

  // Depth objects
  objects.forEach(o => {
    const dx = mouse.x - o.x;
    const dy = mouse.y - o.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 180 / o.depth) {
      o.opacity = 1;
      burst(o.x, o.y, 4);
      playTone(200 + Math.random() * 300);
    } else {
      o.opacity = 0.05;
    }

    drawShape(o);
  });

  // Particles
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life / 60;
    ctx.fill();

    if (p.life <= 0) particles.splice(i, 1);
  });

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  // Silhouettes (foreground)
  ctx.fillStyle = "#0a0a0a";
  silhouettes.forEach(s => {
    ctx.fillRect(s.x, canvas.height - s.height, 10, s.height);
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
