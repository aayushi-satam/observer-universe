// Smooth cursor only — NO AUDIO HERE

const cursor = document.getElementById("cursor");

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;
let tx = x;
let ty = y;

document.addEventListener("mousemove", e => {
  tx = e.clientX;
  ty = e.clientY;
});

function animateCursor() {
  x += (tx - x) * 0.15;
  y += (ty - y) * 0.15;

  cursor.style.left = x + "px";
  cursor.style.top = y + "px";

  requestAnimationFrame(animateCursor);
}

animateCursor();

document.addEventListener("click", () => {
  cursor.classList.add("click");
  setTimeout(() => cursor.classList.remove("click"), 150);
});

const btn = document.getElementById("begin");

if (btn) {
  btn.addEventListener("click", () => {
    window.location.href = "./universe.html";
  });
}
