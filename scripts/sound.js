window.onload = () => {
  const context = new (window.AudioContext || window.webkitAudioContext)();

  function playTone(frequency) {
    const osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, context.currentTime);
    osc.connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + 0.1);
  }

  document.addEventListener("mousemove", e => {
    const freq = 200 + (e.clientX / window.innerWidth) * 800;
    playTone(freq);
  });
};
