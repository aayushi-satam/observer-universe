export function startQuantumUniverse() {
    const canvas = document.getElementById('quantum-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#FF007F', '#7101FF', '#00F0FF', '#00FF8E', '#FFCC00', '#FF3E00'];

    class Shape {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
        }
        update(mx, my) {
            let dx = mx - this.x;
            let dy = my - this.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 150) {
                this.x -= dx * 0.05;
                this.y -= dy * 0.05;
                this.size = 15; // Grows when observed
            } else {
                this.size = Math.max(this.size - 0.1, 3);
            }
            
            this.x += this.speedX;
            this.y += this.speedY;
        }
        draw() {
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for(let i=0; i<150; i++) particles.push(new Shape());

    function animate(mx, my) {
        ctx.fillStyle = 'rgba(0,0,0,0.1)'; // Trails effect
        ctx.fillRect(0,0,canvas.width, canvas.height);
        particles.forEach(p => { p.update(mx, my); p.draw(); });
    }
    
    window.addEventListener('mousemove', (e) => animate(e.clientX, e.clientY));
}
