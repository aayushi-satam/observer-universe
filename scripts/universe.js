const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ---------- MUSIC ----------
const music = document.getElementById("bg-music");

document.addEventListener("click", ()=>{
  if(music && music.paused){
    music.volume = 0.6;
    music.play();
  }
});

// ---------- CURSOR ----------
const cursor = document.createElement("div");
cursor.className="cursor";
document.body.appendChild(cursor);

let cx=window.innerWidth/2, cy=window.innerHeight/2;
let tx=cx, ty=cy;

document.addEventListener("mousemove",e=>{
  tx=e.clientX;
  ty=e.clientY;
});

function smoothCursor(){
  cx+=(tx-cx)*0.15;
  cy+=(ty-cy)*0.15;
  cursor.style.left=cx+"px";
  cursor.style.top=cy+"px";
  requestAnimationFrame(smoothCursor);
}
smoothCursor();

// ---------- PARTICLE SYSTEM ----------
let particles=[];
let maxParticles=200;

function spawnParticle(x,y){
  particles.push({
    x,y,
    vx:(Math.random()-0.5)*4,
    vy:(Math.random()-0.5)*4,
    size:Math.random()*3+1,
    life:100
  });
}

document.addEventListener("click",e=>{
  for(let i=0;i<20;i++){
    spawnParticle(e.clientX,e.clientY);
  }
});

function drawParticles(){
  particles.forEach((p,i)=>{
    p.x+=p.vx;
    p.y+=p.vy;
    p.life--;

    ctx.globalAlpha=p.life/100;
    ctx.fillStyle="#00f0ff";
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fill();

    if(p.life<=0) particles.splice(i,1);
  });
  ctx.globalAlpha=1;
}

// ---------- GEOMETRY FIELD ----------
let shapes=[];

for(let i=0;i<80;i++){
  shapes.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    size:20+Math.random()*60,
    angle:Math.random()*Math.PI,
    speed:0.01+Math.random()*0.03
  });
}

function drawShapes(){
  shapes.forEach(s=>{
    s.angle+=s.speed;
    ctx.save();
    ctx.translate(s.x,s.y);
    ctx.rotate(s.angle);
    ctx.strokeStyle="rgba(255,255,255,0.15)";
    ctx.strokeRect(-s.size/2,-s.size/2,s.size,s.size);
    ctx.restore();
  });
}

// ---------- BACKGROUND FLOW ----------
function animate(){
  ctx.fillStyle="rgba(5,5,20,0.25)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  drawShapes();
  drawParticles();

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize",()=>{
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
});
