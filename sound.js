const ObserverSound = (function () {
  let audioCtx = null;
  let masterGain = null;
  let filterNode = null;
  let oscillators = [];
  let started = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let velocityAccum = 0;
  let targetVolume = 0.18;
  let currentVolume = 0;
  let animFrame = null;

  function createAudioContext() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);

    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(800, audioCtx.currentTime);
    filterNode.Q.setValueAtTime(0.8, audioCtx.currentTime);

    filterNode.connect(masterGain);
    masterGain.connect(audioCtx.destination);
  }

  function createOscillatorLayer(freq, gainAmt, type, detune) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    if (detune) osc.detune.setValueAtTime(detune, audioCtx.currentTime);
    gain.gain.setValueAtTime(gainAmt, audioCtx.currentTime);

    osc.connect(gain);
    gain.connect(filterNode);
    osc.start();

    return { osc, gain };
  }

  function startAmbient() {
    if (started) return;
    started = true;

    createAudioContext();

    oscillators.push(createOscillatorLayer(55, 0.18, 'sine', 0));
    oscillators.push(createOscillatorLayer(82.5, 0.10, 'sine', 3));
    oscillators.push(createOscillatorLayer(110, 0.07, 'triangle', -5));
    oscillators.push(createOscillatorLayer(165, 0.04, 'sine', 8));

    oscillators.forEach(({ osc }) => {
      const drift = audioCtx.createOscillator();
      const driftGain = audioCtx.createGain();
      driftGain.gain.setValueAtTime(1.5, audioCtx.currentTime);
      drift.frequency.setValueAtTime(0.08 + Math.random() * 0.05, audioCtx.currentTime);
      drift.type = 'sine';
      drift.connect(driftGain);
      driftGain.connect(osc.detune);
      drift.start();
    });

    masterGain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 4);
    currentVolume = 0.18;

    evolveLoop();
  }

  function evolveLoop() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    filterNode.frequency.linearRampToValueAtTime(
      600 + Math.random() * 700,
      now + 6
    );
    animFrame = setTimeout(evolveLoop, 6000);
  }

  function onMouseMove(x, y) {
    if (!started) {
      startAmbient();
    }
    if (!audioCtx) return;

    const dx = x - lastMouseX;
    const dy = y - lastMouseY;
    const speed = Math.sqrt(dx * dx + dy * dy);
    lastMouseX = x;
    lastMouseY = y;

    velocityAccum = velocityAccum * 0.85 + speed * 0.15;
    const normalized = Math.min(velocityAccum / 15, 1);

    targetVolume = 0.08 + normalized * 0.22;
    const filterFreq = 400 + normalized * 1200;

    const now = audioCtx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(targetVolume, now + 0.4);

    filterNode.frequency.cancelScheduledValues(now);
    filterNode.frequency.setValueAtTime(filterNode.frequency.value, now);
    filterNode.frequency.linearRampToValueAtTime(filterFreq, now + 0.5);
  }

  function onClick() {
    if (!audioCtx) {
      startAmbient();
      return;
    }

    const pulse = audioCtx.createOscillator();
    const pulseGain = audioCtx.createGain();

    pulse.type = 'sine';
    pulse.frequency.setValueAtTime(440, audioCtx.currentTime);
    pulse.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.3);

    pulseGain.gain.setValueAtTime(0, audioCtx.currentTime);
    pulseGain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.02);
    pulseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

    pulse.connect(pulseGain);
    pulseGain.connect(masterGain);

    pulse.start();
    pulse.stop(audioCtx.currentTime + 0.65);
  }

  function resume() {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  return { onMouseMove, onClick, resume, startAmbient };
})();
