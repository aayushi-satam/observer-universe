import { initAudio } from './scripts/sound.js';
import { startQuantumUniverse } from './scripts/quantum.js';

const overlay = document.getElementById('enter-overlay');
const wrapper = document.getElementById('content-wrapper');

// Ensure the site starts at the top
window.scrollTo(0, 0);

overlay.addEventListener('click', () => {
    console.log("Splash clicked");
    overlay.style.opacity = '0';
    wrapper.style.display = 'block'; // Show the content
    
    setTimeout(() => {
        overlay.style.display = 'none';
        initAudio();
    }, 1000);
});

// Use a direct listener for the button
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'activate-universe') {
        console.log("Entering Void");
        document.getElementById('content-wrapper').style.display = 'none';
        document.getElementById('interaction-space').style.display = 'block';
        startQuantumUniverse();
    }
});
