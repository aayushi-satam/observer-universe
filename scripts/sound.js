let audioContext;
let audioBuffer;

export async function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch('DeeperMeaning.mp3');
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

export function playObservationTone() {
    if (!audioContext || !audioBuffer) return;
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.loop = true;
    source.start(0);
}
