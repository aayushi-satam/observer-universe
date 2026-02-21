import { objects } from './scripts/objects.js';
import { initAudio, playObservationTone } from './scripts/sound.js';

// 1. Attention Detection
const observerOptions = { threshold: 0.5 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('observed');
            // Play a tone based on section (Science gets higher pitch, etc.)
            const freq = entry.target.id === 'science' ? 523.25 : 261.63;
            playObservationTone(freq);
        } else {
            entry.target.classList.remove('observed');
        }
    });
}, observerOptions);

document.querySelectorAll('.module').forEach(section => observer.observe(section));

// 2. Canvas Engine
const canvas = document.getElementById('universe-canvas');
const ctx = canvas.getContext('2d');
const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
window.addEventListener('resize', resize);
resize();

let mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Start Audio on First Interaction
window.addEventListener('click', () => {
    initAudio();
    console.log("Universe Sound Initialized");
});

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(obj => {
        obj.update(mouse.x, mouse.y);
        obj.draw();
    });
    requestAnimationFrame(render);
}
render();

// 4. Typography Interaction
import { handleTypography } from './scripts/typography.js';
handleTypography();

// 5. Big Bang Interaction
window.addEventListener('mousedown', (e) => {
    objects.forEach(obj => obj.explode(e.clientX, e.clientY));
});
