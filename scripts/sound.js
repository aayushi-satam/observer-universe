let audioCtx;
let masterGain;

export function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
}

export function playObservationTone(frequency = 440) {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setTargetAtTime(frequency, audioCtx.currentTime, 0.1);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start();
    osc.stop(audioCtx.currentTime + 2);
}
