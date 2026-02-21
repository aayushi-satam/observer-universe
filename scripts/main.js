const btn = document.getElementById("begin");
const cursor = document.getElementById("cursor");

document.addEventListener("mousemove", e => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

document.addEventListener("click", () => {
  cursor.classList.add("click");
  setTimeout(() => cursor.classList.remove("click"), 200);
});

// Web Audio Setup
let audioCtx;
let oscillator;

function startSound() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audioCtx.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(120, audioCtx.currentTime);
  oscillator.connect(audioCtx.destination);
  oscillator.start();
}

btn.addEventListener("click", () => {
  startSound();
  setTimeout(() => {
    window.location.href = "./universe.html";
  }, 800);
});
