import { initAudio } from './scripts/sound.js';
import { startQuantumUniverse } from './scripts/quantum.js';

const overlay = document.getElementById('enter-overlay');
const wrapper = document.getElementById('content-wrapper');

overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    wrapper.style.display = 'block';
    setTimeout(() => { overlay.style.display = 'none'; }, 1000);
});

document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'activate-universe') {
        document.getElementById('content-wrapper').style.display = 'none';
        document.getElementById('interaction-space').style.display = 'block';
        initAudio(); // Music starts here
        startQuantumUniverse(); // Colorful interaction starts here
    }
});
