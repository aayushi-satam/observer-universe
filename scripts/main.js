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

// -------------------- AUDIO UNLOCK --------------------
// We don't play sound here.
// We just unlock AudioContext so universe page starts instantly.

let audioUnlocked = false;

document.addEventListener("pointerdown", () => {
  if (audioUnlocked) return;

  const tempCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = tempCtx.createOscillator();
  const gain = tempCtx.createGain();

  osc.connect(gain);
  gain.connect(tempCtx.destination);
  gain.gain.value = 0;
  osc.start();
  osc.stop(tempCtx.currentTime + 0.01);

  audioUnlocked = true;
});

// -------------------- BEGIN BUTTON --------------------
const btn = document.getElementById("begin");

if (btn) {
  btn.addEventListener("click", () => {
    window.location.href = "./universe.html";
  });
}
