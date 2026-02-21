const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ---------------- SMOOTH CURSOR ----------------
const cursor = document.getElementById("cursor");

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;
let tx = x;
let ty = y;

document.addEventListener("mousemove", e => {
  tx = e.clientX;
  ty = e.clientY;
});

function updateCursor() {
  x += (tx - x) * 0.15;
  y += (ty - y) * 0.15;

  cursor.style.left = x + "px";
  cursor.style.top = y + "px";

  requestAnimationFrame(updateCursor);
}
updateCursor();

document.addEventListener("click", () => {
  cursor.classList.add("click");
  setTimeout(() => cursor.classList.remove("click"), 150);
});

// ---------------- MUSIC ----------------
const music = document.getElementById("bg-music");

document.addEventListener("pointerdown", () => {
  if (music.paused) {
    music.volume = 0.5;
    music.play().catch(() => {});
  }
});

// ---------------- VISUAL SYSTEM ----------------
let mouse = { x: canvas.width/2, y: canvas.height/2 };

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

const colors = ["#00f0ff", "#9d4dff", "#00ffcc", "#ff66ff"];

let objects = [];

for (let i = 0; i < 40; i++) {
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
  ctx.fillStyle = "rgba(5,5,20,0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.shadowBlur = 20;
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
