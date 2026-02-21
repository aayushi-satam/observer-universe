let audio;
export function initAudio() {
    if (audio) return;
    audio = new Audio('scripts/DeeperMeaning.mp3');
    audio.loop = true;
    audio.volume = 0.4;
    audio.play().catch(e => console.log("Click to start audio"));
}
export function playObservationTone() {
    if (audio && audio.volume < 0.6) {
        audio.volume = 0.6;
        setTimeout(() => { audio.volume = 0.4; }, 1000);
    }
}
