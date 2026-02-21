const cursor = document.createElement("div");
cursor.className = "cursor";
document.body.appendChild(cursor);

let x = window.innerWidth/2;
let y = window.innerHeight/2;
let tx = x;
let ty = y;

document.addEventListener("mousemove", e=>{
  tx = e.clientX;
  ty = e.clientY;
});

function animate(){
  x += (tx-x)*0.15;
  y += (ty-y)*0.15;
  cursor.style.left = x+"px";
  cursor.style.top = y+"px";
  requestAnimationFrame(animate);
}
animate();

document.addEventListener("click", ()=>{
  cursor.classList.add("click");
  setTimeout(()=>cursor.classList.remove("click"),150);
});

document.getElementById("begin").onclick = ()=>{
  window.location.href="./universe.html";
};
