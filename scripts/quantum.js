export function startQuantumUniverse() {
    const canvas = document.getElementById('quantum-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const thoughts = ["REALITY?", "UNCERTAINTY", "OBSERVER", "WAVE", "PARTICLE", "COLLAPSE"];
    const mouse = { x: -500, y: -500, down: false };

    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mousedown', () => mouse.down = true);
    window.addEventListener('mouseup', () => mouse.down = false);

    class QuantumObject {
        constructor(id) {
            this.id = id;
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseSize = Math.random() * 8 + 2;
            this.pairIndex = (id % 2 === 0) ? id + 1 : id - 1; // Entangled pair
            this.isObserved = false;
            this.text = thoughts[Math.floor(Math.random() * thoughts.length)];
            this.opacity = 0;
        }

        update() {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 180) {
                this.isObserved = true;
                this.opacity = Math.min(this.opacity + 0.05, 1);
                // Entanglement effect: The pair also "exists" more strongly
                particles[this.pairIndex].opacity = Math.min(particles[this.pairIndex].opacity + 0.02, 0.5);
                
                if (mouse.down) {
                    this.x -= dx * 0.03; 
                } else {
                    this.x += dx * 0.005;
                }
            } else {
                this.isObserved = false;
                this.opacity = Math.max(this.opacity - 0.01, 0);
                this.x += Math.sin(this.id) * 0.2;
                this.y += Math.cos(this.id) * 0.2;
            }
        }

        draw() {
            // Draw Entanglement Line
            if (this.isObserved) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.2})`;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(particles[this.pairIndex].x, particles[this.pairIndex].y);
                ctx.stroke();
            }

            // Draw Particle/Wave
            ctx.beginPath();
            if (this.opacity > 0.1) {
                ctx.arc(this.x, this.y, this.baseSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.shadowBlur = this.isObserved ? 15 : 0;
                ctx.shadowColor = '#fff';
                ctx.fill();

                // Draw Thought Fragment
                if (this.isObserved && this.opacity > 0.8) {
                    ctx.font = "10px monospace";
                    ctx.fillText(this.text, this.x + 15, this.y + 5);
                }
            } else {
                // Dim square "Probability" state
                ctx.rect(this.x - 2, this.y - 2, 4, 4);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
                ctx.fill();
            }
        }
    }

    function init() { for (let i = 0; i < 60; i++) particles.push(new QuantumObject(i)); }
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    init(); animate();
}
