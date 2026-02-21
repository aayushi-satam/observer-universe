import { objects } from './scripts/objects.js';
import { initAudio, playObservationTone } from './scripts/sound.js';

// 1. Handle the Entry Splash
const overlay = document.getElementById('enter-overlay');
overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.display = 'none', 1500);
    initAudio(); // Start DeeperMeaning.mp3 on first click
}, { once: true });

// 2. Setup Canvas
const canvas = document.getElementById('universe-canvas');
const ctx = canvas.getContext('2d');

const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
window.addEventListener('resize', resize);
resize();

// 3. Observer: Trigger Tone and Glow on Scroll
const observerOptions = { threshold: 0.2 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('observed');
            playObservationTone(); // Swells DeeperMeaning.mp3
        }
    });
}, observerOptions);

// Observe all sections (modules)
document.querySelectorAll('.module').forEach(section => observer.observe(section));

// 4. Mouse Interaction
let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// 5. Animation Loop
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(obj => {
        obj.update(mouse.x, mouse.y);
        obj.draw(ctx);
    });
    requestAnimationFrame(render);
}
render();
