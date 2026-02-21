let audio;

export async function initAudio() {
    if (!audio) {
        audio = new Audio('DeeperMeaning.mp3');
        audio.loop = true;
        audio.volume = 0.5;
    }
}

export function playObservationTone() {
    if (audio) {
        audio.play().catch(e => console.log("Audio play blocked or failed:", e));
    }
}
