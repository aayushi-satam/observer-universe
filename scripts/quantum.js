export function startQuantumUniverse() {
    const canvas = document.getElementById('quantum-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#FF007F', '#7101FF', '#00F0FF', '#00FF8E', '#FFCC00', '#FF3E00'];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseSize = Math.random() * 8 + 2;
            this.size = this.baseSize;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.velocity = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = this.size * 2;
            ctx.shadowColor = this.color;
            ctx.fill();
        }

        update(mouse) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                // Reaction: Grow and shift color when observed
                this.size = Math.min(this.size + 2, 40);
                this.x -= dx * 0.02;
                this.y -= dy * 0.02;
            } else {
                // Return to uncertainty when not observed
                if (this.size > this.baseSize) this.size -= 0.5;
                this.x += this.velocity.x;
                this.y += this.velocity.y;
            }

            // Boundary check
            if (this.x < 0 || this.x > canvas.width) this.velocity.x *= -1;
            if (this.y < 0 || this.y > canvas.height) this.velocity.y *= -1;

            this.draw();
        }
    }

    for (let i = 0; i < 100; i++) particles.push(new Particle());

    const mouse = { x: -100, y: -100 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Trail effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => p.update(mouse));
        requestAnimationFrame(animate);
    }
    animate();
}
