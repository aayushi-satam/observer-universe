import { objects } from './scripts/objects.js';
import { initAudio, playObservationTone } from './scripts/sound.js';

window.addEventListener('click', () => {
    initAudio();
}, { once: true });

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('observed');
            playObservationTone();
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.module').forEach(s => observer.observe(s));

const canvas = document.getElementById('universe-canvas');
const ctx = canvas.getContext('2d');
const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
window.addEventListener('resize', resize);
resize();

let mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(obj => { obj.update(mouse.x, mouse.y); obj.draw(); });
    requestAnimationFrame(render);
}
render();

// 7. Entry Interaction
const overlay = document.getElementById('enter-overlay');
overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.display = 'none', 1500);
});
