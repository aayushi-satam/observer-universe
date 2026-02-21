<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Observer Universe</title>
  <link rel="stylesheet" href="./style/main.css">
  <style>
    body { margin:0; overflow:hidden; background:#050510; }
    canvas { display:block; }
    .back-btn {
      position: fixed;
      top: 20px;
      left: 20px;
      padding: 10px 20px;
      background: white;
      border: none;
      cursor: pointer;
      z-index: 1001;
    }
  </style>
</head>
<body>

<button class="back-btn" onclick="window.location.href='./index.html'">Back</button>

<div class="cursor" id="cursor"></div>
<canvas id="universe"></canvas>

<audio id="bg-music" src="./assets/ambient.mp3" loop></audio>

<script src="./scripts/universe.js"></script>

</body>
</html>
