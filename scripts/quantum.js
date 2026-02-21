export function startQuantumUniverse() {
    const canvas = document.getElementById('quantum-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const mouse = { x: -100, y: -100, down: false };

    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mousedown', () => mouse.down = true);
    window.addEventListener('mouseup', () => mouse.down = false);

    class QuantumObject {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseSize = Math.random() * 15 + 5;
            this.angle = Math.random() * Math.PI * 2;
            this.isObserved = false;
        }

        update() {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                this.isObserved = true;
                if (mouse.down) {
                    this.x -= dx * 0.05; // Repel on click
                    this.y -= dy * 0.05;
                } else {
                    this.x += dx * 0.01; // Attract on hover
                    this.y += dy * 0.01;
                }
            } else {
                this.isObserved = false;
                this.x += Math.sin(this.angle) * 0.5;
                this.y += Math.cos(this.angle) * 0.5;
                this.angle += 0.01;
            }
        }

        draw() {
            ctx.beginPath();
            if (this.isObserved) {
                ctx.arc(this.x, this.y, this.baseSize, 0, Math.PI * 2);
                ctx.fillStyle = mouse.down ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)';
                ctx.shadowBlur = mouse.down ? 40 : 20;
                ctx.shadowColor = '#fff';
            } else {
                ctx.rect(this.x - 10, this.y - 10, 20, 20);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.shadowBlur = 0;
            }
            ctx.fill();
            ctx.closePath();
        }
    }

    function init() { for (let i = 0; i < 80; i++) particles.push(new QuantumObject()); }
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    init(); animate();
}
