import { initAudio } from './scripts/sound.js';
import { startQuantumUniverse } from './scripts/quantum.js';

const overlay = document.getElementById('enter-overlay');
const contentWrapper = document.getElementById('content-wrapper');

overlay.addEventListener('click', () => {
    // 1. Fade out the splash
    overlay.style.opacity = '0';
    
    // 2. Show the scrolling content
    contentWrapper.style.display = 'block';
    
    // 3. Start the audio and remove splash from view
    setTimeout(() => {
        overlay.style.display = 'none';
        initAudio();
    }, 1500);
}, { once: true });

// Logic for the final Quantum Void Button
document.addEventListener('click', (e) => {
    if(e.target && e.target.id === 'activate-universe'){
        document.getElementById('interaction-space').style.display = 'block';
        startQuantumUniverse();
    }
});
