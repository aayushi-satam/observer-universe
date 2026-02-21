<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Quantum Jungle</title>
<link rel="stylesheet" href="./style/main.css">
<style>
body { margin:0; overflow:hidden; background:#050505; }
canvas { display:block; }
.back-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 10px 20px;
  background: white;
  color: black;
  border: none;
  cursor: pointer;
  z-index: 10;
}
</style>
</head>
<body>

<button class="back-btn" onclick="window.location.href='./index.html'">BACK</button>
<div class="cursor" id="cursor"></div>
<canvas id="universe"></canvas>

<script src="./scripts/universe.js"></script>
</body>
</html>
