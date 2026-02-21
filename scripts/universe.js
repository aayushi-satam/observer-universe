// ---------- SAFETY CHECK ----------
const canvas = document.getElementById("universe");
if (!canvas) {
  console.error("Canvas not found.");
}

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ---------- SMOOTH CURSOR ----------
const cursor = document.getElementById("cursor");

let cx = window.innerWidth / 2;
let cy = window.innerHeight / 2;
let tx = cx;
let ty = cy;

document.addEventListener("mousemove", (e) => {
  tx = e.clientX;
  ty = e.clientY;
});

function updateCursor() {
  cx += (tx - cx) * 0.15;
  cy += (ty - cy) * 0.15;

  if (cursor) {
    cursor.style.left = cx + "px";
    cursor.style.top = cy + "px";
  }

  requestAnimationFrame(updateCursor);
}

updateCursor();

document.addEventListener("click", () => {
  if (!cursor) return;
  cursor.classList.add("click");
  setTimeout(() => cursor.classList.remove("click"), 150);
});

// ---------- MUSIC (REAL FILE ONLY) ----------
const music = document.getElementById("bg-music");

document.addEventListener("click", () => {
  if (!music) return;

  if (music.paused) {
    music.volume = 0.6;
    music.play().catch(() => {
      console.log("Autoplay blocked until interaction.");
    });
  }
});

// ---------- INTERACTIVE VISUAL SYSTEM ----------
let mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

const colors = ["#00f0ff", "#9d4dff", "#00ffcc", "#ff66ff"];

let objects = [];

for (let i = 0; i < 50; i++) {
  objects.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 20 + Math.random() * 50,
    angle: Math.random() * Math.PI,
    color: colors[Math.floor(Math.random() * colors.length)]
  });
}

function animate() {
  ctx.fillStyle = "rgba(5,5,20,0.35)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  objects.forEach((o) => {
    const dx = mouse.x - o.x;
    const dy = mouse.y - o.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    ctx.save();
    ctx.translate(o.x, o.y);
    ctx.rotate(o.angle += 0.02);

    ctx.globalAlpha = distance < 180 ? 1 : 0.08;
    ctx.strokeStyle = o.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(-o.size / 2, -o.size / 2, o.size, o.size);

    ctx.restore();
  });

  requestAnimationFrame(animate);
}

animate();

// ---------- RESIZE FIX ----------
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
