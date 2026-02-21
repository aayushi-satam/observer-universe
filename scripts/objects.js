const canvas = document.getElementById('universe-canvas');
const ctx = canvas.getContext('2d');

class EtherealObject {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 50 + 20;
        this.baseSize = this.size;
        this.opacity = 0.1;
        this.speed = Math.random() * 0.5;
    }

    update(mouseX, mouseY) {
        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
            this.size = this.baseSize * 1.5;
            this.opacity = 0.6;
        } else {
            this.size = this.baseSize;
            this.opacity = 0.1;
        }
        
        this.y -= this.speed;
        if (this.y < -100) this.y = canvas.height + 100;
    }

    draw() {
        ctx.strokeStyle = `rgba(0, 0, 0, ${this.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.size, this.y + this.size);
        ctx.lineTo(this.x - this.size, this.y + this.size);
        ctx.closePath();
        ctx.stroke();
    }
}

export const objects = Array.from({ length: 25 }, () => new EtherealObject());
