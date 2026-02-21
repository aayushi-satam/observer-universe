import { initAudio, playObservationTone } from './scripts/sound.js';
import { startQuantumUniverse } from './scripts/quantum.js';

const overlay = document.getElementById('enter-overlay');
const wrapper = document.getElementById('content-wrapper');
const interactionSpace = document.getElementById('interaction-space');

// Handle first click (Overlay -> Info)
overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
    wrapper.style.display = 'block';
    // Unlock audio context
    initAudio().catch(e => console.log("Audio ready for next step."));
});

// Handle second click (Info -> Void) using a global delegator
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'activate-universe') {
        console.log("Entering the Void...");
        wrapper.style.display = 'none';
        interactionSpace.style.display = 'block';
        
        // Start visuals and sound
        playObservationTone();
        startQuantumUniverse();
    }
});

// Cursor Movement Logic
const cursor = document.getElementById('custom-cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Show cursor only in the void
universeBtn.addEventListener('click', () => {
    cursor.style.display = 'block';
});

// Pulse interaction logic
document.addEventListener('mousedown', () => {
    cursor.classList.add('cursor-pulse');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('cursor-pulse');
});
