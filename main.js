import { initAudio } from './scripts/sound.js';
import { startQuantumUniverse } from './scripts/quantum.js';

const overlay = document.getElementById('enter-overlay');
const wrapper = document.getElementById('content-wrapper');

// 1. Initial Entry
overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    wrapper.style.display = 'block'; // Reveal info page
    setTimeout(() => {
        overlay.style.display = 'none';
        initAudio();
    }, 1000);
}, { once: true });

// 2. Activate Quantum Void Button
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'activate-universe') {
        const space = document.getElementById('interaction-space');
        space.style.display = 'block';
        startQuantumUniverse();
        console.log("Quantum Void Activated");
    }
});
