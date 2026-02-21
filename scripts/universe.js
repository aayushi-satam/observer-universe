const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// -------------------- SMOOTH CURSOR --------------------
const cursor = document.getElementById("cursor");

let cx = window.innerWidth / 2;
let cy = window.innerHeight / 2;
let tx = cx;
let ty = cy;

document.addEventListener("mousemove", e => {
  tx = e.clientX;
  ty = e.clientY;
});

function smoothCursor() {
  cx += (tx - cx) * 0.12;
  cy += (ty - cy) * 0.12;
  cursor.style.transform = `translate(${cx}px, ${cy}px)`;
  requestAnimationFrame(smoothCursor);
}
smoothCursor();

document.addEventListener("click", () => {
  cursor.classList.add("click");
  setTimeout(() => cursor.classList.remove("click"), 150);
});

// -------------------- AUDIO --------------------
let audioCtx;
let masterGain;
let ambientStarted = false;

function startAudio() {
  if (ambientStarted) return;

  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.15;
  masterGain.connect(audioCtx.destination);

  // Ethereal layered pad
  createPad(110);
  createPad(220);
  createPad(330);

  ambientStarted = true;
}

function createPad(freq) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = "sine";
  osc.frequency.value = freq;

  filter.type = "lowpass";
  filter.frequency.value = 800;

  gain.gain.value = 0.05;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  osc.start();

  // Slow frequency drift
  setInterval(() => {
    osc.frequency.value = freq + (Math.random() * 10 - 5);
  }, 2000);
}

// Soft shimmer click
function clickSound() {
  if (!ambientStarted) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  osc.frequency.value = 800;

  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.2);
}

document.addEventListener("pointerdown", () => {
  startAudio();
  clickSound();
});

// -------------------- VISUAL SYSTEM --------------------
let mouse = { x: canvas.width/2, y: canvas.height/2 };
document.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

const colors = ["#00f0ff", "#9d4dff", "#00ffcc", "#ff66ff"];

let objects = [];

for (let i = 0; i < 50; i++) {
  objects.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 20 + Math.random() * 40,
    angle: Math.random() * Math.PI,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: 0.1
  });
}

function animate() {
  ctx.fillStyle = "rgba(5,5,10,0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.shadowBlur = 25;
  ctx.shadowColor = "#00f0ff";

  objects.forEach(o => {
    const dx = mouse.x - o.x;
    const dy = mouse.y - o.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (dist < 150) {
      o.opacity = 1;
    } else {
      o.opacity = 0.05;
    }

    ctx.save();
    ctx.translate(o.x, o.y);
    ctx.rotate(o.angle += 0.02);
    ctx.globalAlpha = o.opacity;
    ctx.strokeStyle = o.color;
    ctx.strokeRect(-o.size/2, -o.size/2, o.size, o.size);
    ctx.restore();
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
