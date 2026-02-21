// ---------- SMOOTH CURSOR ----------
const cursor = document.getElementById("cursor");

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;
let targetX = x;
let targetY = y;

document.addEventListener("mousemove", (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

function animateCursor() {
  x += (targetX - x) * 0.15;
  y += (targetY - y) * 0.15;

  if (cursor) {
    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
  }

  requestAnimationFrame(animateCursor);
}

animateCursor();

document.addEventListener("click", () => {
  if (!cursor) return;
  cursor.classList.add("click");
  setTimeout(() => cursor.classList.remove("click"), 150);
});

// ---------- BUTTON NAVIGATION ----------
const beginBtn = document.getElementById("begin");

if (beginBtn) {
  beginBtn.addEventListener("click", () => {
    window.location.href = "./universe.html";
  });
}
