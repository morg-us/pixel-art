const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 450;

/* ================= PLAYER ================= */
const player = {
  x: 50, y: 50, w: 24, h: 24,
  speed: 2,
  hp: 100, maxHp: 100,
  level: 1, exp: 0, expToNext: 100
};

/* ================= CONTROLS ================= */
const keys = {};
document.addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;
  if (e.key.toLowerCase() === "e")
    inventoryUI.classList.toggle("hidden");
});
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

/* ================= INVENTORY ================= */
const inventory = [];
const inventoryUI = document.getElementById("inventory");
const inventoryList = document.getElementById("inventoryList");

function addItem(item) {
  inventory.push(item);
  renderInventory();
}

function renderInventory() {
  inventoryList.innerHTML = "";
  inventory.forEach((item, i) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.onclick = () => {
      if (item === "Potion") {
        player.hp = Math.min(player.maxHp, player.hp + 25);
        inventory.splice(i, 1);
        renderInventory();
      }
    };
    inventoryList.appendChild(li);
  });
}

/* ================= MAP ================= */
const obstacles = [
  { x: 200, y: 100, w: 120, h: 40 },
  { x: 400, y: 260, w: 60, h: 120 }
];

const worldItems = [
  { x: 300, y: 150, type: "Potion" },
  { x: 600, y: 350, type: "Potion" }
];

/* ================= ENEMY ================= */
const enemy = { x: 520, y: 200, w: 24, h: 24, dmg: 0.3 };

/* ================= UI / SETTINGS ================= */
document.getElementById("settingsIcon").onclick = () =>
  document.getElementById("settingsMenu").classList.toggle("hidden");

document.getElementById("restartGame").onclick = () => location.reload();
document.getElementById("toggleTheme").onclick = () =>
  document.body.classList.toggle("light");
document.getElementById("exitGame").onclick = () => window.close();
document.getElementById("checkpointBtn").onclick = () =>
  localStorage.setItem("checkpoint", JSON.stringify(player));

/* ================= HELPERS ================= */
function collide(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

function gainExp(amount) {
  player.exp += amount;
  if (player.exp >= player.expToNext) {
    player.exp -= player.expToNext;
    player.level++;
    player.expToNext += 50;
  }
}

/* ================= GAME LOOP ================= */
function update() {
  let nx = player.x, ny = player.y;
  if (keys.w) ny -= player.speed;
  if (keys.s) ny += player.speed;
  if (keys.a) nx -= player.speed;
  if (keys.d) nx += player.speed;

  const future = { x: nx, y: ny, w: player.w, h: player.h };
  if (!obstacles.some(o => collide(future, o))) {
    player.x = nx; player.y = ny;
  }

  if (collide(player, enemy)) player.hp -= enemy.dmg;

  worldItems.forEach((item, i) => {
    if (Math.abs(player.x - item.x) < 20 &&
        Math.abs(player.y - item.y) < 20) {
      addItem(item.type);
      gainExp(20);
      worldItems.splice(i, 1);
    }
  });
}

function draw() {
  ctx.fillStyle = "#5c8a3c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#444";
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));

  ctx.fillStyle = "yellow";
  worldItems.forEach(i => ctx.fillRect(i.x, i.y, 14, 14));

  ctx.fillStyle = "red";
  ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);

  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // HP
  ctx.fillStyle = "red";
  ctx.fillRect(10, 10, (player.hp / player.maxHp) * 100, 8);

  // EXP
  ctx.fillStyle = "#00ffaa";
  ctx.fillRect(10, 25, (player.exp / player.expToNext) * 100, 6);
  ctx.fillStyle = "white";
  ctx.fillText("Lv " + player.level, 120, 30);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
