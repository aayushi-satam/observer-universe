window.onload = () => {
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  class FloatingObject {
    constructor(x, y, size, color) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.color = color;
      this.visible = Math.random() < 0.5;
    }

    draw() {
      if (this.visible) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    toggleVisibility(observing) {
      if (observing && Math.random() < 0.7) this.visible = !this.visible;
    }
  }

  const objects = [];
  for (let i = 0; i < 50; i++) {
    objects.push(new FloatingObject(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      10 + Math.random() * 20,
      ['#00BFFF','#FF00FF','#FFD700'][Math.floor(Math.random()*3)]
    ));
  }

  let mouseOverCanvas = false;
  canvas.addEventListener("mousemove", () => mouseOverCanvas = true);
  canvas.addEventListener("mouseleave", () => mouseOverCanvas = false);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(obj => {
      obj.toggleVisibility(mouseOverCanvas);
      obj.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
};
