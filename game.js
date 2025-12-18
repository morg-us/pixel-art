const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas boyutları
canvas.width = 800;
canvas.height = 600;

// Oyuncu bilgileri
let player = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  speed: 5,
  color: 'blue'
};

// NPC bilgileri
let npc = {
  x: 400,
  y: 300,
  width: 50,
  height: 50,
  color: 'green',
  dialogue: "Merhaba, bana yardım eder misin?"
};

// Envanter
let inventory = ['Silah', 'Yemek', 'Para: 100'];

// Ses kontrolü
let isMuted = false;

// Oyun döngüsü
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Ekranı temizle

  // Oyuncu hareketi
  if (keys['ArrowUp']) player.y -= player.speed;
  if (keys['ArrowDown']) player.y += player.speed;
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;

  // NPC ile etkileşim kontrolü
  if (checkCollision(player, npc)) {
    showDialogue(npc.dialogue);
  }

  // Oyuncu çizimi
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // NPC çizimi
  ctx.fillStyle = npc.color;
  ctx.fillRect(npc.x, npc.y, npc.width, npc.height);

  requestAnimationFrame(gameLoop);
}

// Tuş kontrolü
let keys = {};
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// NPC ile çarpışma kontrolü
function checkCollision(player, npc) {
  return (
    player.x < npc.x + npc.width &&
    player.x + player.width > npc.x &&
    player.y < npc.y + npc.height &&
    player.y + player.height > npc.y
  );
}

// Diyalog gösterme
function showDialogue(message) {
  alert(message);
}

// Ses açma/kapama
document.getElementById('muteBtn').addEventListener('click', () => {
  isMuted = !isMuted;
  alert(isMuted ? "Ses kapalı" : "Ses açık");
});

// Yeniden başlatma
document.getElementById('restartBtn').addEventListener('click', () => {
  player.x = 100;
  player.y = 100;
  inventory = ['Silah', 'Yemek', 'Para: 100'];
  alert("Oyun yeniden başlatıldı!");
});

// Oyun başlat
gameLoop();
