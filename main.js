// 1. Attention Detection (The Observer)
const observerOptions = {
    threshold: 0.5 // Section is "observed" when 50% visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('observed');
            console.log("Observing:", entry.target.id);
        } else {
            entry.target.classList.remove('observed');
        }
    });
}, observerOptions);

// Track all sections
document.querySelectorAll('.module').forEach(section => {
    observer.observe(section);
});

// 2. The Visual Background (Canvas Engine)
const canvas = document.getElementById('universe-canvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Subtle background "breathing" animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Add a very subtle gradient or texture here later
    // For now, a clean clear to keep it editorial
    
    requestAnimationFrame(animate);
}
animate();

// 3. Interaction Interaction
window.addEventListener('click', () => {
    // This will be the trigger for the Web Audio and "Big Bang"
    document.body.style.backgroundColor = "#fafafa"; // Subtle shift on click
});
import { objects } from './scripts/objects.js';

let mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
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
