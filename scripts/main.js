const btn = document.getElementById("begin");
const audio = document.getElementById("ambient");

btn.addEventListener("click", () => {
  audio.play();
  setTimeout(() => {
    window.location.href = "./universe.html";
  }, 1200);
});
