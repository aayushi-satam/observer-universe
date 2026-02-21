const headlines = document.querySelectorAll(".headline");

headlines.forEach(h => {
  h.style.transition = "transform 0.3s ease, opacity 0.3s ease";

  h.addEventListener("mousemove", e => {
    const tiltX = (e.clientX / window.innerWidth - 0.5) * 10;  // left-right tilt
    const tiltY = (e.clientY / window.innerHeight - 0.5) * 10; // up-down tilt
    h.style.transform = `rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(1.05)`;
  });

  h.addEventListener("mouseleave", () => {
    h.style.transform = "rotateX(0) rotateY(0) scale(1)";
  });
});
