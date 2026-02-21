export function startQuantumUniverse() {
    const canvas = document.getElementById('quantum-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const mouse = { x: -100, y: -100 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

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

            // The Collapse: Objects within 150px "exist" solidly
            if (distance < 150) {
                this.isObserved = true;
                this.x += dx * 0.01; // Tension: Object is drawn to the observer
                this.y += dy * 0.01;
            } else {
                this.isObserved = false;
                this.x += Math.sin(this.angle) * 0.5; // Drift when unobserved
                this.y += Math.cos(this.angle) * 0.5;
                this.angle += 0.01;
            }
        }

        draw() {
            ctx.beginPath();
            if (this.isObserved) {
                // Particle State: Solid, bright, defined
                ctx.arc(this.x, this.y, this.baseSize, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.shadowBlur = 20;
                ctx.shadowColor = '#fff';
            } else {
                // Wave State: Blurred, dim, uncertain
                ctx.rect(this.x - 10, this.y - 10, 20, 20);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.shadowBlur = 0;
            }
            ctx.fill();
            ctx.closePath();
        }
    }

    function init() {
        for (let i = 0; i < 80; i++) particles.push(new QuantumObject());
    }

    function animate() {
        // Slight trail to represent the "memory" of reality
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    init();
    animate();
}
