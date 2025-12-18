const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

/* ======================
   OYUNCU
====================== */
let player = {
  x: 50,
  y: 50,
  w: 32,
  h: 32,
  speed: 2,
  hp: 100,
  maxHp: 100
};

/* ======================
   KONTROLLER
====================== */
let keys = {};
document.addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;

  // Envanter E
  if (e.key.toLowerCase() === "e") {
    inventoryUI.classList.toggle("hidden");
  }
});

document.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

/* ======================
   ENVANTER
====================== */
let inventory = [];
const inventoryUI = document.getElementById("inventory");
const inventoryList = document.getElementById("inventoryList");

function addItem(item) {
  inventory.push(item);
  renderInventory();
}

function renderInventory() {
  inventoryList.innerHTML = "";
  inventory.forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    inventoryList.appendChild(li);
  });
}

/* ======================
   ENGELLER
====================== */
const obstacles = [
  { x: 200, y: 100, w: 100, h: 50 },
  { x: 400, y: 300, w: 50, h: 100 }
];

function collision(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/* ======================
   DÜŞMAN
====================== */
let enemy = {
  x: 500,
  y: 200,
  w: 32,
  h: 32,
  hp: 50
};

/* ======================
   AYARLAR MENÜSÜ
====================== */
const settingsIcon = document.getElementById("settingsIcon");
const settingsMenu = document.getElementById("settingsMenu");

settingsIcon.onclick = () => {
  settingsMenu.classList.toggle("hidden");
};

document.getElementById("toggleSound").onclick = () => {
  alert("Ses Aç/Kapat (placeholder)");
};

document.getElementById("restartGame").onclick = () => {
  location.reload();
};

document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("light");
};

document.getElementById("exitGame").onclick = () => {
  window.close();
};

document.getElementById("checkpointBtn").onclick = () => {
  localStorage.setItem("checkpoint", JSON.stringify(player));
  alert("Checkpoint Kaydedildi");
};

/* ======================
   OYUN DÖNGÜSÜ
====================== */
function update() {
  let nextX = player.x;
  let nextY = player.y;

  if (keys["w"]) nextY -= player.speed;
  if (keys["s"]) nextY += player.speed;
  if (keys["a"]) nextX -= player.speed;
  if (keys["d"]) nextX += player.speed;

  let future = { x: nextX, y: nextY, w: player.w, h: player.h };

  let blocked = obstacles.some(o => collision(future, o));
  if (!blocked) {
    player.x = nextX;
    player.y = nextY;
  }

  // Düşman hasarı
  if (collision(player, enemy)) {
    player.hp -= 0.3;
    if (player.hp <= 0) {
      alert("Öldün!");
      location.reload();
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Oyuncu
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Can barı
  ctx.fillStyle = "red";
  ctx.fillRect(10, 10, (player.hp / player.maxHp) * 100, 10);

  // Düşman
  ctx.fillStyle = "red";
  ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);

  // Engeller
  ctx.fillStyle = "gray";
  obstacles.forEach(o => {
    ctx.fillRect(o.x, o.y, o.w, o.h);
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

/* ======================
   ÖRNEK LOOT (SONRA SİL)
====================== */
setTimeout(() => {
  addItem("Paslı Kılıç");
}, 5000);
