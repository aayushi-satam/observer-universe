import { initAudio, playObservationTone } from './scripts/sound.js';
import { startQuantumUniverse } from './scripts/quantum.js';

const overlay = document.getElementById('enter-overlay');
const wrapper = document.getElementById('content-wrapper');

// 1. First Click: Unlock Audio Context + Show Info
overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    wrapper.style.display = 'block';
    
    // This "warms up" the audio engine so it's ready later
    initAudio(); 
    
    setTimeout(() => { 
        overlay.style.display = 'none'; 
    }, 1000);
});

// 2. Second Click: Start the actual Music and Universe
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'activate-universe') {
        document.getElementById('content-wrapper').style.display = 'none';
        document.getElementById('interaction-space').style.display = 'block';
        
        // Ensure sound actually plays now
        playObservationTone(); 
        startQuantumUniverse();
    }
});
