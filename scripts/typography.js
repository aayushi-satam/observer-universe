const headlines = document.querySelectorAll(".headline");

headlines.forEach(h => {
  h.addEventListener("mouseenter", () => h.style.opacity = 0.8);
  h.addEventListener("mouseleave", () => h.style.opacity = 1);
});
