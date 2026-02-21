const canvas = document.getElementById('universe-canvas');
const ctx = canvas.getContext('2d');

class EtherealObject {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = 0;
        this.vy = 0;
        this.size = Math.random() * 40 + 10;
        this.baseSize = this.size;
        this.opacity = 0.1;
        this.speed = Math.random() * 0.5 + 0.2;
    }

    explode(mouseX, mouseY) {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = 1000 / distance;
        
        // Push particles away from click
        this.vx = (dx / distance) * force;
        this.vy = (dy / distance) * force;
    }

    update(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Interaction logic
        if (distance < 200) {
            this.size = this.baseSize * 1.8;
            this.opacity = 0.5;
        } else {
            this.size = this.baseSize;
            this.opacity = 0.1;
        }

        // Apply explosion physics
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95; // Friction
        this.vy *= 0.95;

        // Constant upward drift
        this.y -= this.speed;

        // Wrap around screen
        if (this.y < -100) this.y = canvas.height + 100;
        if (this.x < -100) this.x = canvas.width + 100;
        if (this.x > canvas.width + 100) this.x = -100;
    }

    draw() {
        ctx.strokeStyle = `rgba(0, 0, 0, ${this.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.stroke();
    }
}

export const objects = Array.from({ length: 40 }, () => new EtherealObject());
