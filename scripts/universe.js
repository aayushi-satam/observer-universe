const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: canvas.width/2, y: canvas.height/2 };
let objects = [];
let particles = [];

// ---------- AUDIO SYSTEM ----------
let audioStarted = false;
let audioCtx, ambientOsc, ambientGain;

function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  ambientOsc = audioCtx.createOscillator();
  ambientGain = audioCtx.createGain();

  ambientOsc.type = "sine";
  ambientOsc.frequency.value = 80;

  ambientGain.gain.value = 0.05;

  ambientOsc.connect(ambientGain);
  ambientGain.connect(audioCtx.destination);

  ambientOsc.start();
}

function reactiveTone(freq) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "triangle";
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
}

// Start audio on FIRST click (browser safe)
document.addEventListener("click", () => {
  if (!audioStarted) {
    initAudio();
    audioStarted = true;
  }
});


// ---------- CURSOR ----------
const cursor = document.getElementById("cursor");

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

document.addEventListener("click", () => {
  cursor.classList.add("click");
  setTimeout(() => cursor.classList.remove("click"), 150);
  burst(mouse.x, mouse.y, 50);

  if (audioStarted) {
    reactiveTone(150 + Math.random()*400);
  }
});


// ---------- COLORS ----------
const palette = ["#00f0ff","#9d4dff","#00ff9c","#ff0080","#d4af37"];
function randomColor() {
  return palette[Math.floor(Math.random()*palette.length)];
}


// ---------- OBJECTS ----------
function createObject() {
  return {
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    size: 20+Math.random()*60,
    angle: Math.random()*Math.PI,
    color: randomColor(),
    opacity: 0.1
  };
}

for(let i=0;i<50;i++){
  objects.push(createObject());
}


// ---------- PARTICLES ----------
function burst(x,y,amount){
  for(let i=0;i<amount;i++){
    particles.push({
      x:x,
      y:y,
      vx:(Math.random()-0.5)*8,
      vy:(Math.random()-0.5)*8,
      life:50,
      color:randomColor()
    });
  }
}


// ---------- ANIMATION ----------
function animate(){

  ctx.fillStyle="rgba(5,5,5,0.3)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.shadowBlur = 20;
  ctx.shadowColor = "#00f0ff";

  objects.forEach(o=>{
    const dx=mouse.x-o.x;
    const dy=mouse.y-o.y;
    const dist=Math.sqrt(dx*dx+dy*dy);

    if(dist<150){
      o.opacity=1;
      burst(o.x,o.y,4);

      if(audioStarted){
        ambientOsc.frequency.value = 60 + dist;
      }
    }else{
      o.opacity=0.05;
    }

    ctx.save();
    ctx.translate(o.x,o.y);
    ctx.rotate(o.angle+=0.03);
    ctx.strokeStyle=o.color;
    ctx.globalAlpha=o.opacity;
    ctx.strokeRect(-o.size/2,-o.size/2,o.size,o.size);
    ctx.restore();
  });

  particles.forEach((p,i)=>{
    p.x+=p.vx;
    p.y+=p.vy;
    p.life--;

    ctx.beginPath();
    ctx.arc(p.x,p.y,3,0,Math.PI*2);
    ctx.fillStyle=p.color;
    ctx.globalAlpha=p.life/50;
    ctx.fill();

    if(p.life<=0) particles.splice(i,1);
  });

  ctx.globalAlpha=1;
  ctx.shadowBlur=0;

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize",()=>{
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
});
