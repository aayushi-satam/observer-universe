const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: canvas.width/2, y: canvas.height/2 };
let lastMove = Date.now();
let objects = [];

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  lastMove = Date.now();
});

function randomColor() {
  const colors = ["#00f0ff","#9d4dff","#00ff9c","#d4af37"];
  return colors[Math.floor(Math.random()*colors.length)];
}

function createObject() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 30 + Math.random()*50,
    opacity: 0.05,
    collapsed: false,
    color: randomColor()
  };
}

for (let i = 0; i < 12; i++) {
  objects.push(createObject());
}

function drawObject(o) {
  ctx.beginPath();
  ctx.arc(o.x, o.y, o.size, 0, Math.PI*2);
  ctx.strokeStyle = o.color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = o.opacity;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function animate() {
  ctx.fillStyle = "rgba(5,5,5,0.2)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  const still = Date.now() - lastMove > 800;

  objects.forEach(o => {
    const dx = mouse.x - o.x;
    const dy = mouse.y - o.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (still && dist < 150) {
      o.collapsed = true;
    }

    if (o.collapsed) {
      o.opacity += 0.02;
      if (o.opacity > 1) o.opacity = 1;
    } else {
      o.opacity = 0.05 + Math.random()*0.1;
    }

    if (!still) {
      o.collapsed = false;
    }

    drawObject(o);
  });

  requestAnimationFrame(animate);
}

animate();
