import { initAudio, playObservationTone } from './scripts/sound.js';
import { startQuantumUniverse } from './scripts/quantum.js';

const overlay = document.getElementById('enter-overlay');
const wrapper = document.getElementById('content-wrapper');
const universeBtn = document.getElementById('activate-universe');
const interactionSpace = document.getElementById('interaction-space');

// First Stage: Reveal Information
overlay.addEventListener('click', () => {
    overlay.style.display = 'none';
    wrapper.style.display = 'block';
    initAudio().catch(() => console.log("Audio waiting..."));
});

// Second Stage: Enter the Void
universeBtn.addEventListener('click', () => {
    wrapper.style.display = 'none';
    interactionSpace.style.display = 'block';
    playObservationTone();
    startQuantumUniverse();
});
