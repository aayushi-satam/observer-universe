/* ============================================
   OBSERVER UNIVERSE — sound.js
   Web Audio API generative ambient soundscape
   ============================================ */

'use strict';

const SoundEngine = {
  ctx: null,
  master: null,
  ambient: null,
  isRunning: false,
  nodes: {},

  // Initialize AudioContext
  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.setValueAtTime(0, this.ctx.currentTime);
      this.master.connect(this.ctx.destination);
    } catch (e) {
      console.warn('Web Audio not supported');
    }
  },

  // Fade master volume
  setVolume(vol, duration = 1.5) {
    if (!this.master) return;
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.setValueAtTime(this.master.gain.value, this.ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + duration);
  },

  // Create a gentle drone
  createDrone(freq, vol = 0.03) {
    if (!this.ctx) return null;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Subtle vibrato
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.5, this.ctx.currentTime);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    osc.start();

    return { osc, gain, filter, lfo, lfoGain };
  },

  // White noise (forest/wind)
  createNoise(vol = 0.015) {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Pink-ish noise
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2 + white * 0.5) * 0.11;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.3, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 4);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    source.start();

    return { source, gain, filter };
  },

  // Ping/bell tone for object observation
  ping(freq = 440, vol = 0.1) {
    if (!this.ctx || !this.isRunning) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const convolver = this.createSimpleReverb(1.5);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.8);

    osc.connect(gain);
    if (convolver) {
      gain.connect(convolver);
      convolver.connect(this.master);
    } else {
      gain.connect(this.master);
    }
    osc.start();
    osc.stop(this.ctx.currentTime + 2);
  },

  // Simple reverb via impulse response
  createSimpleReverb(duration = 2) {
    if (!this.ctx) return null;
    const convolver = this.ctx.createConvolver();
    const length = this.ctx.sampleRate * duration;
    const impulse = this.ctx.createBuffer(2, length, this.ctx.sampleRate);

    for (let c = 0; c < 2; c++) {
      const ch = impulse.getChannelData(c);
      for (let i = 0; i < length; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }

    convolver.buffer = impulse;
    return convolver;
  },

  // Section-specific pitch sets
  SECTION_SCALES: {
    objective:    [110, 165, 220, 330],
    science:      [146.83, 220, 293.66, 440],     // D scale
    art:          [130.81, 196, 261.63, 392],      // C scale
    philosophy:   [138.59, 207.65, 277.18, 415.3], // C# scale
    technology:   [164.81, 220, 329.63, 440],      // E scale
    spirituality: [110, 146.83, 220, 293.66],      // A scale
    reflection:   [130.81, 174.61, 261.63, 349.23], // F scale
  },

  startAmbient(section = 'objective') {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    this.isRunning = true;
    this.setVolume(0.7, 2);

    const freqs = this.SECTION_SCALES[section] || this.SECTION_SCALES.objective;

    // Layer drones
    this.nodes.drones = freqs.slice(0, 2).map((f, i) =>
      this.createDrone(f, 0.02 + i * 0.005)
    );

    // Forest noise
    this.nodes.noise = this.createNoise(0.012);

    // Occasional pings
    this.schedulePings(freqs);
  },

  schedulePings(freqs) {
    const ping = () => {
      if (!this.isRunning) return;
      const freq = freqs[Math.floor(Math.random() * freqs.length)] * 2;
      this.ping(freq, 0.06 + Math.random() * 0.06);
      const nextIn = 3000 + Math.random() * 7000;
      this._pingTimer = setTimeout(ping, nextIn);
    };
    setTimeout(ping, 1000 + Math.random() * 2000);
  },

  stopAmbient() {
    if (!this.ctx) return;
    this.isRunning = false;
    clearTimeout(this._pingTimer);
    this.setVolume(0, 1.5);

    setTimeout(() => {
      Object.values(this.nodes).forEach(n => {
        if (!n) return;
        const nodes = Array.isArray(n) ? n : [n];
        nodes.forEach(node => {
          if (node && node.osc) {
            try { node.osc.stop(); node.lfo?.stop(); } catch (e) {}
          }
          if (node && node.source) {
            try { node.source.stop(); } catch (e) {}
          }
        });
      });
      this.nodes = {};
    }, 1600);
  },

  // Trigger sound on object observation
  triggerObjectSound(obj) {
    if (!this.isRunning) return;
    const type = obj?.dataset?.type || 'circle';
    const section = document.body.dataset.section || 'objective';
    const freqs = this.SECTION_SCALES[section] || this.SECTION_SCALES.objective;
    const freq = freqs[Math.floor(Math.random() * freqs.length)] * (1 + Math.random());
    this.ping(freq, 0.04);
  },

  // Modulate ambient based on mouse speed
  updateFromMotion(vx, vy) {
    if (!this.nodes.noise || !this.isRunning) return;
    const speed = Math.min(Math.hypot(vx, vy), 80) / 80;

    if (this.nodes.noise.gain) {
      const targetVol = 0.008 + speed * 0.02;
      this.nodes.noise.gain.gain.setTargetAtTime(targetVol, this.ctx.currentTime, 0.3);
    }
  }
};

// ---- Public API ----
function startAmbient() {
  const section = document.body.dataset.section || 'objective';
  SoundEngine.startAmbient(section);
}

function stopAmbient() {
  SoundEngine.stopAmbient();
}

function triggerObjectSound(obj) {
  SoundEngine.triggerObjectSound(obj);
}

// Update sound from mouse motion in main loop
(function hookIntoLoop() {
  const _orig = window.requestAnimationFrame;
  const origUpdate = ObserverUniverse?._updateObjects;
  if (typeof ObserverUniverse !== 'undefined') {
    const existing = ObserverUniverse._updateObjects;
    ObserverUniverse._updateObjects = function() {
      if (existing) existing();
      SoundEngine.updateFromMotion(
        ObserverUniverse.mouse.vx,
        ObserverUniverse.mouse.vy
      );
    };
  }
})();

window.startAmbient = startAmbient;
window.stopAmbient = stopAmbient;
window.triggerObjectSound = triggerObjectSound;
