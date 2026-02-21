import { initAudio, playObservationTone } from './scripts/sound.js';
import { startQuantumUniverse } from './scripts/quantum.js';

const overlay = document.getElementById('enter-overlay');
const wrapper = document.getElementById('content-wrapper');
const universeButton = document.getElementById('activate-universe');
const interactionSpace = document.getElementById('interaction-space');

// Step 1: Initialize Audio and Reveal Information
overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    wrapper.style.display = 'block';
    
    // Warm up the AudioContext (Standard Browser Requirement)
    initAudio().catch(err => console.log("Audio waiting for user interaction."));
    
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 1000);
});

// Step 2: Enter the Quantum Jungle
universeButton.addEventListener('click', () => {
    // Hide the info page
    wrapper.style.display = 'none';
    
    // Reveal and Start the Jungle
    interactionSpace.style.display = 'block';
    
    // Trigger the vibrant visuals and the music
    playObservationTone();
    startQuantumUniverse();
    
    console.log("Observer has entered the Quantum Jungle.");
});
