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
            this.size = Math.random() * 3 + 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.velocity = { x: (Math.random() - 0.5) * 1.5, y: (Math.random() - 0.5) * 1.5 };
        }

        update(mouse) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            // The Observer Effect: Particles gravitate and brighten near cursor
            if (dist < 200) {
                this.x += dx * 0.01;
                this.y += dy * 0.01;
                this.size = 6;
            } else {
                this.size = 2;
                this.x += this.velocity.x;
                this.y += this.velocity.y;
            }

            // Screen wrap
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
        }
    }

    for (let i = 0; i < 150; i++) particles.push(new Particle());

    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    function animate() {
        ctx.fillStyle = 'rgba(0,
cat <<EOF >> style.css
#interaction-space {
    cursor: crosshair;
    animation: fadeIn 2s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; filter: brightness(2); }
    to { opacity: 1; filter: brightness(1); }
}

.hud {
    position: fixed;
    bottom: 20px;
    right: 20px;
    color: #fff;
    font-family: 'Montserrat';
    font-size: 0.7rem;
    letter-spacing: 5px;
    text-transform: uppercase;
    opacity: 0.5;
}
