const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// -------------------- MOUSE --------------------
let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// -------------------- SMOOTH CURSOR --------------------
const cursor = document.getElementById("cursor");

let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let targetX = cursorX;
let targetY = cursorY;

document.addEventListener("mousemove", (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

function smoothCursor() {
  cursorX += (targetX - cursorX) * 0.15;
  cursorY += (targetY - cursorY) * 0.15;

  cursor.style.left = cursorX + "px";
  cursor.style.top = cursorY + "px";

  requestAnimationFrame(smoothCursor);
}
smoothCursor();

document.addEventListener("click", () => {
  cursor.classList.add("click");
  setTimeout(() => cursor.classList.remove("click"), 120);
});

// -------------------- AUDIO SYSTEM --------------------
let audioCtx;
let ambientOsc;
let ambientGain;
let audioStarted = false;

function startAudio() {
  if (audioStarted) return;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Ambient drone
  ambientOsc = audioCtx.createOscillator();
  ambientGain = audioCtx.createGain();

  ambientOsc.type = "sine";
  ambientOsc.frequency.value = 70;
  ambientGain.gain.value = 0.12;

  ambientOsc.connect(ambientGain);
  ambientGain.connect(audioCtx.destination);
  ambientOsc.start();

  audioStarted = true;
}

// Reactive tone (energy resonance)
function reactiveTone(freq) {
  if (!audioStarted) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "triangle";
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.25);
}

// CLICK SOUND (short digital tap)
function clickSound() {
  if (!audioStarted) return;

  const bufferSize = audioCtx.sampleRate * 0.05; // 50ms
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noise = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();

  noise.buffer = buffer;
  noise.connect(gain);
  gain.connect(audioCtx.destination);

  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

  noise.start();
}

// Start audio on first interaction (browser safe)
document.addEventListener("pointerdown", () => {
  startAudio();
});

// -------------------- COLORS --------------------
const palette = ["#00f0ff", "#9d4dff", "#00ff9c", "#ff0080", "#d4af37"];
function randomColor() {
  return palette[Math.floor(Math.random() * palette.length)];
}

// -------------------- OBJECTS --------------------
let objects = [];

function createObject() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 20 + Math.random() * 60,
    angle: Math.random() * Math.PI,
    color: randomColor(),
    opacity: 0.05,
    shape: Math.floor(Math.random() * 3)
  };
}

for (let i = 0; i < 60; i++) {
  objects.push(createObject());
}

// -------------------- PARTICLES --------------------
let particles = [];

function burst(x, y, amount) {
  for (let i = 0; i < amount; i++) {
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 50,
      color: randomColor()
    });
  }
}

// Click interaction
document.addEventListener("click", () => {
  burst(mouse.x, mouse.y, 60);
  reactiveTone(150 + Math.random() * 400);
  clickSound();
});

// -------------------- DRAW SHAPES --------------------
function drawShape(o) {
  ctx.save();
  ctx.translate(o.x, o.y);
  ctx.rotate(o.angle += 0.04);
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

// -------------------- ANIMATION --------------------
function animate() {
  ctx.fillStyle = "rgba(5,5,5,0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.shadowBlur = 20;
  ctx.shadowColor = "#00f0ff";

  objects.forEach(o => {
    const dx = mouse.x - o.x;
    const dy = mouse.y - o.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 150) {
      o.opacity = 1;
      burst(o.x, o.y, 4);

      if (audioStarted) {
        ambientOsc.frequency.value = 60 + dist * 0.3;
      }
    } else {
      o.opacity = 0.05;
    }

    drawShape(o);
  });

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life / 50;
    ctx.fill();

    if (p.life <= 0) particles.splice(i, 1);
  });

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
