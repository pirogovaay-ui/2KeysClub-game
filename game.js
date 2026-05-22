const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const startButton = document.querySelector("#startButton");
let telegramButton = document.querySelector("#telegramButton");
const controlButtons = [...document.querySelectorAll("[data-control]")];

if (!telegramButton) {
  telegramButton = document.createElement("a");
  telegramButton.id = "telegramButton";
  telegramButton.className = "telegram-button hidden";
  telegramButton.href = "https://t.me/+Sf4W9QMpQqtmZDg6";
  telegramButton.target = "_blank";
  telegramButton.rel = "noopener noreferrer";
  telegramButton.textContent = "Вступай в наш ТГ канал";
  telegramButton.style.cssText = [
    "position:absolute",
    "left:50%",
    "bottom:calc(84px + env(safe-area-inset-bottom))",
    "z-index:2",
    "display:none",
    "place-items:center",
    "width:min(280px,72vw)",
    "min-height:48px",
    "padding:0 16px",
    "border:2px solid rgba(238,236,233,.74)",
    "border-radius:6px",
    "background:rgba(32,36,38,.82)",
    "color:#eeece9",
    "font:700 13px/1.2 'Courier New', monospace",
    "text-align:center",
    "text-decoration:none",
    "transform:translateX(-50%)",
    "backdrop-filter:blur(8px)",
  ].join(";");
  document.querySelector(".game-shell")?.appendChild(telegramButton);
}

function setTelegramVisible(visible) {
  telegramButton.classList.toggle("hidden", !visible);
  telegramButton.style.display = visible ? "grid" : "none";
}

const logo = new Image();
logo.src = "assets/2keys_club_logo_transparent.png";
const thumbsUp = new Image();
thumbsUp.src = "assets/thumbs-up.png";
const levelOpen = new Image();
levelOpen.src = "assets/level-open.png";
const levelClosed = new Image();
levelClosed.src = "assets/level-closed.png";

const colors = {
  graphite: "#353a3d",
  graphiteDeep: "#202426",
  cream: "#eeece9",
  blue: "#a5c0ed",
  blueBright: "#bfd4ff",
  ink: "#111516",
};

const base = { w: 390, h: 844 };
const world = {
  width: 1280,
  gravity: 0.62,
  camera: 0,
  started: false,
  won: false,
  finalWin: false,
  levelIndex: 0,
  completedLevels: 0,
  lives: 3,
  timeLeft: 60,
  lastTime: 0,
};

const keys = {
  left: false,
  right: false,
  jump: false,
};

const player = {
  x: 58,
  y: 0,
  w: 38,
  h: 56,
  vx: 0,
  vy: 0,
  grounded: false,
  collected: 0,
  jumpBuffer: 0,
};

const levels = [
  {
    name: "01",
    width: 1280,
    spawn: { x: 58, y: 694 },
    door: { x: 1118, y: 522, w: 112, h: 172 },
    platforms: [
      { x: 0, y: 694, w: 310, h: 38 },
      { x: 360, y: 610, w: 160, h: 28 },
      { x: 560, y: 540, w: 150, h: 28 },
      { x: 760, y: 612, w: 170, h: 28 },
      { x: 980, y: 694, w: 340, h: 38 },
    ],
    pickups: [
      { x: 438, y: 560, r: 18 },
      { x: 836, y: 562, r: 18 },
    ],
  },
  {
    name: "02",
    width: 1460,
    spawn: { x: 58, y: 694 },
    door: { x: 1280, y: 442, w: 112, h: 172 },
    platforms: [
      { x: 0, y: 694, w: 250, h: 38 },
      { x: 330, y: 632, w: 130, h: 26 },
      { x: 530, y: 562, w: 126, h: 26 },
      { x: 740, y: 492, w: 118, h: 26 },
      { x: 940, y: 572, w: 136, h: 26 },
      { x: 1180, y: 614, w: 270, h: 38 },
    ],
    pickups: [
      { x: 594, y: 512, r: 18 },
      { x: 998, y: 522, r: 18 },
    ],
  },
  {
    name: "03",
    width: 1660,
    spawn: { x: 58, y: 694 },
    door: { x: 1490, y: 380, w: 112, h: 172 },
    platforms: [
      { x: 0, y: 694, w: 220, h: 38 },
      { x: 302, y: 618, w: 104, h: 26 },
      { x: 485, y: 542, w: 104, h: 26 },
      { x: 672, y: 468, w: 104, h: 26 },
      { x: 860, y: 556, w: 118, h: 26 },
      { x: 1060, y: 488, w: 118, h: 26 },
      { x: 1260, y: 420, w: 112, h: 26 },
      { x: 1440, y: 552, w: 214, h: 38 },
    ],
    pickups: [
      { x: 724, y: 418, r: 18 },
      { x: 1316, y: 370, r: 18 },
    ],
  },
  {
    name: "04",
    width: 1780,
    spawn: { x: 58, y: 694 },
    door: { x: 1610, y: 506, w: 112, h: 172 },
    platforms: [
      { x: 0, y: 694, w: 210, h: 38 },
      { x: 298, y: 640, w: 92, h: 26 },
      { x: 470, y: 585, w: 96, h: 26 },
      { x: 652, y: 520, w: 96, h: 26 },
      { x: 840, y: 452, w: 96, h: 26 },
      { x: 1035, y: 526, w: 112, h: 26 },
      { x: 1225, y: 600, w: 112, h: 26 },
      { x: 1460, y: 678, w: 310, h: 38 },
    ],
    pickups: [
      { x: 890, y: 402, r: 18 },
      { x: 1280, y: 550, r: 18 },
    ],
  },
  {
    name: "05",
    width: 1920,
    spawn: { x: 58, y: 694 },
    door: { x: 1740, y: 344, w: 112, h: 172 },
    platforms: [
      { x: 0, y: 694, w: 198, h: 38 },
      { x: 284, y: 610, w: 86, h: 26 },
      { x: 456, y: 532, w: 88, h: 26 },
      { x: 642, y: 612, w: 90, h: 26 },
      { x: 824, y: 532, w: 90, h: 26 },
      { x: 1012, y: 454, w: 92, h: 26 },
      { x: 1208, y: 536, w: 96, h: 26 },
      { x: 1406, y: 462, w: 96, h: 26 },
      { x: 1630, y: 516, w: 282, h: 38 },
    ],
    pickups: [
      { x: 1059, y: 404, r: 18 },
      { x: 1454, y: 412, r: 18 },
    ],
  },
];

let platforms = [];
let pickups = [];
let door = { x: 0, y: 0, w: 112, h: 172 };

function fitCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  ctx.setTransform(canvas.width / base.w, 0, 0, canvas.height / base.h, 0, 0);
}

function startLevel(index = 0) {
  const level = levels[index];
  world.levelIndex = index;
  world.width = level.width;
  world.camera = 0;
  world.started = true;
  world.won = false;
  world.finalWin = false;
  world.timeLeft = 60;
  world.lastTime = performance.now();

  platforms = level.platforms.map((platform) => ({ ...platform }));
  pickups = level.pickups.map((key) => ({ ...key, taken: false }));
  door = { ...level.door };

  player.x = level.spawn.x;
  player.y = level.spawn.y - player.h;
  player.vx = 0;
  player.vy = 0;
  player.grounded = false;
  player.collected = 0;
  player.jumpBuffer = 0;

  startButton.classList.add("hidden");
  setTelegramVisible(false);
}

function resetGame() {
  world.completedLevels = 0;
  world.lives = 3;
  startLevel(0);
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function update(dt) {
  if (!world.started || world.won) return;

  world.timeLeft = Math.max(0, world.timeLeft - dt);
  player.jumpBuffer = Math.max(0, player.jumpBuffer - dt);

  const move = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  player.vx += move * 0.75;
  player.vx *= player.grounded ? 0.78 : 0.9;
  player.vx = Math.max(-5.2, Math.min(5.2, player.vx));

  if (player.jumpBuffer > 0 && player.grounded) {
    player.vy = -12.5;
    player.grounded = false;
    player.jumpBuffer = 0;
  }

  player.vy += world.gravity;
  player.x += player.vx;
  player.y += player.vy;
  player.x = Math.max(18, Math.min(world.width - player.w - 18, player.x));

  player.grounded = false;
  for (const platform of platforms) {
    const wasAbove = player.y + player.h - player.vy <= platform.y;
    if (rectsOverlap(player, platform) && player.vy >= 0 && wasAbove) {
      player.y = platform.y - player.h;
      player.vy = 0;
      player.grounded = true;
    }
  }

  if (player.y > base.h + 80) {
    world.lives = Math.max(0, world.lives - 1);
    if (world.lives === 0) {
      world.won = true;
      world.finalWin = true;
      startButton.textContent = "AGAIN";
      startButton.classList.remove("hidden");
      setTelegramVisible(true);
      return;
    }
    const level = levels[world.levelIndex];
    player.x = level.spawn.x;
    player.y = level.spawn.y - player.h;
    player.vx = 0;
    player.vy = 0;
    world.camera = Math.max(0, player.x - 116);
  }

  for (const item of pickups) {
    if (!item.taken) {
      const dx = player.x + player.w / 2 - item.x;
      const dy = player.y + player.h / 2 - item.y;
      if (Math.hypot(dx, dy) < 36) {
        item.taken = true;
        player.collected += 1;
      }
    }
  }

  if (player.collected >= pickups.length && rectsOverlap(player, door)) {
    world.won = true;
    world.finalWin = world.levelIndex === levels.length - 1;
    world.completedLevels = Math.max(world.completedLevels, world.levelIndex + 1);
    startButton.textContent = world.finalWin ? "AGAIN" : "NEXT";
    startButton.classList.remove("hidden");
    setTelegramVisible(startButton.textContent === "AGAIN");
  }

  world.camera = Math.max(0, Math.min(world.width - base.w, player.x - 116));
}

function drawGrid() {
  ctx.fillStyle = colors.graphite;
  ctx.fillRect(0, 0, base.w, base.h);
  ctx.strokeStyle = "rgba(238, 236, 233, 0.055)";
  ctx.lineWidth = 1;
  for (let x = -world.camera % 32; x < base.w; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, base.h);
    ctx.stroke();
  }
  for (let y = 88; y < base.h; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(base.w, y);
    ctx.stroke();
  }
}

function drawLogoImage(image, x, y, w, alpha = 1) {
  if (!image.complete || !image.naturalWidth) return;
  const h = w * (image.naturalHeight / image.naturalWidth);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(image, x, y, w, h);
  ctx.restore();
}

function drawAsset(image, x, y, w, h, alpha = 1) {
  if (!image.complete || !image.naturalWidth) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(image, x, y, w, h);
  ctx.restore();
}

function drawHud() {
  drawLogoImage(logo, 18, 20, 82);
  drawHearts(116, 34);
  drawLevelBadges();
}

function drawLevelBadges() {
  const size = 20;
  const gap = 7;
  const totalW = levels.length * size + (levels.length - 1) * gap;
  let x = base.w - totalW - 18;
  for (let index = 0; index < levels.length; index += 1) {
    const image = index < world.completedLevels ? levelOpen : levelClosed;
    const alpha = index === world.levelIndex ? 1 : 0.7;
    drawAsset(image, x, 30, size, size, alpha);
    x += size + gap;
  }
}

function drawHearts(x, y) {
  for (let i = 0; i < 3; i += 1) {
    drawHeart(x + i * 18, y, i < world.lives);
  }
}

function drawHeart(x, y, full) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.fillStyle = full ? colors.blue : "rgba(238, 236, 233, 0.2)";
  ctx.strokeStyle = full ? colors.blueBright : "rgba(238, 236, 233, 0.45)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(8, 14);
  ctx.lineTo(2, 8);
  ctx.quadraticCurveTo(-2, 3, 4, 1);
  ctx.quadraticCurveTo(7, 0, 8, 4);
  ctx.quadraticCurveTo(9, 0, 12, 1);
  ctx.quadraticCurveTo(18, 3, 14, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawPlatforms() {
  for (const platform of platforms) {
    const x = platform.x - world.camera;
    ctx.fillStyle = colors.cream;
    ctx.fillRect(x, platform.y, platform.w, platform.h);
    ctx.fillStyle = "rgba(17, 21, 22, 0.34)";
    ctx.fillRect(x, platform.y + 7, platform.w, 3);
    ctx.fillStyle = "rgba(53, 58, 61, 0.26)";
    for (let tx = Math.ceil(platform.x / 64) * 64; tx < platform.x + platform.w; tx += 64) {
      const px = tx - world.camera;
      ctx.fillRect(px, platform.y + platform.h - 7, 5, 5);
    }
    ctx.fillStyle = "rgba(238, 236, 233, 0.55)";
    ctx.fillRect(x, platform.y - 3, platform.w, 3);
  }
}

function drawKey(x, y, taken) {
  if (taken) return;
  const px = x - world.camera;
  ctx.save();
  ctx.translate(px, y);
  ctx.shadowColor = colors.blueBright;
  ctx.shadowBlur = 18;
  ctx.strokeStyle = colors.blueBright;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(-8, 0, 10, 0, Math.PI * 2);
  ctx.moveTo(2, 0);
  ctx.lineTo(24, 0);
  ctx.moveTo(16, 0);
  ctx.lineTo(16, 10);
  ctx.moveTo(24, 0);
  ctx.lineTo(24, 8);
  ctx.stroke();
  ctx.restore();
}

function drawDoor() {
  const x = door.x - world.camera;
  const unlocked = player.collected >= pickups.length;
  ctx.fillStyle = unlocked ? colors.blue : colors.graphiteDeep;
  ctx.fillRect(x, door.y, door.w, door.h);
  ctx.strokeStyle = colors.cream;
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 5, door.y + 5, door.w - 10, door.h - 10);

  ctx.fillStyle = colors.cream;
  ctx.font = "700 11px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText(unlocked ? "OPEN" : "2 KEYS", x + door.w / 2, door.y + 142);
  ctx.textAlign = "left";

  drawLogoImage(logo, x + 13, door.y + 30, 86, unlocked ? 1 : 0.72);
}

function drawPlayer() {
  const x = player.x - world.camera;
  const y = player.y;
  const facing = player.vx < -0.25 ? -1 : 1;
  const running = Math.abs(player.vx) > 0.7 && player.grounded;
  const step = running ? Math.sin(performance.now() / 90) : 0;
  const armSwing = Math.round(step * 4);
  const legSwing = Math.round(step * 5);

  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));

  ctx.fillStyle = "rgba(17, 21, 22, 0.28)";
  ctx.beginPath();
  ctx.ellipse(19, 53, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  if (running) {
    ctx.fillStyle = "rgba(238, 236, 233, 0.92)";
    const dustX = facing > 0 ? -10 : 40;
    ctx.fillRect(dustX, 39, 5, 5);
    ctx.fillRect(dustX - facing * 10, 47, 4, 4);
    ctx.fillRect(dustX - facing * 19, 43, 7, 3);
    ctx.fillStyle = "rgba(238, 236, 233, 0.55)";
    ctx.fillRect(dustX - facing * 28, 50, 4, 3);
  }

  // Pixel-art runner, intentionally blocky to match the reference render.
  ctx.fillStyle = colors.cream;
  ctx.fillRect(8, 0, 28, 28);
  ctx.fillStyle = "rgba(53, 58, 61, 0.14)";
  ctx.fillRect(8, 25, 28, 4);

  ctx.fillStyle = colors.ink;
  ctx.fillRect(17, 11, 3, 5);
  ctx.fillRect(28, 11, 3, 5);

  ctx.fillStyle = colors.blue;
  ctx.fillRect(7, 31, 29, 18);
  ctx.fillStyle = "#8fb0e2";
  ctx.fillRect(7, 31, 29, 4);

  ctx.fillStyle = colors.blueBright;
  ctx.fillRect(facing > 0 ? 2 : 34, 33 + armSwing, 7, 7);
  ctx.fillStyle = colors.cream;
  ctx.fillRect(facing > 0 ? 0 : 36, 38 + armSwing, 7, 6);

  ctx.fillStyle = colors.blue;
  ctx.fillRect(facing > 0 ? 35 : 1, 34 - armSwing, 6, 8);
  ctx.fillStyle = colors.cream;
  ctx.fillRect(facing > 0 ? 39 : -4, 39 - armSwing, 7, 6);

  ctx.fillStyle = colors.graphiteDeep;
  ctx.fillRect(10, 49, 10, 8 + Math.max(0, legSwing));
  ctx.fillRect(25, 49, 10, 8 + Math.max(0, -legSwing));

  ctx.fillStyle = colors.cream;
  ctx.fillRect(facing > 0 ? 5 - Math.max(0, -legSwing) : 9, 57, 12, 5);
  ctx.fillRect(facing > 0 ? 27 : 22 + Math.max(0, legSwing), 57, 12, 5);
  ctx.restore();
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawIntro() {
  if (world.started) return;
  ctx.fillStyle = "rgba(32, 36, 38, 0.72)";
  ctx.fillRect(0, 0, base.w, base.h);
  drawLogoImage(logo, 54, 180, 282);
  ctx.fillStyle = colors.cream;
  ctx.font = "700 28px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("2 Keys Run", base.w / 2, 358);
  ctx.font = "400 13px 'Courier New', monospace";
  ctx.fillText("/ Найди 2 ключа и открой дверь", base.w / 2, 392);
  ctx.textAlign = "left";
}

function drawWin() {
  if (!world.won) return;
  ctx.fillStyle = "rgba(32, 36, 38, 0.92)";
  ctx.fillRect(0, 0, base.w, base.h);
  if (world.lives === 0) {
    ctx.fillStyle = colors.blue;
    ctx.font = "700 34px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText("TRY AGAIN", base.w / 2, 320);
    ctx.fillStyle = colors.cream;
    ctx.font = "400 14px 'Courier New', monospace";
    ctx.fillText("one more run?", base.w / 2, 354);
    ctx.textAlign = "left";
    return;
  }
  drawAsset(thumbsUp, base.w / 2 - 56, 184, 112, 112);
  ctx.fillStyle = colors.blue;
  ctx.textAlign = "center";
  if (world.finalWin) {
    ctx.fillStyle = colors.cream;
    ctx.font = "700 15px 'Courier New', monospace";
    ctx.fillText("/ Все двери открыты", base.w / 2, 330);
    ctx.font = "400 14px 'Courier New', monospace";
    ctx.fillText("Ты нашёл оба ключа", base.w / 2, 360);
    ctx.fillStyle = colors.blue;
    ctx.font = "700 18px 'Courier New', monospace";
    ctx.fillText("WELCOME TO", base.w / 2, 408);
    drawLogoImage(logo, base.w / 2 - 112, 430, 224);
  } else {
    ctx.font = "700 34px 'Courier New', monospace";
    ctx.fillText("OPEN", base.w / 2, 320);
    ctx.fillStyle = colors.cream;
    ctx.font = "400 14px 'Courier New', monospace";
    ctx.fillText("next level unlocked", base.w / 2, 354);
  }
  ctx.textAlign = "left";
}

function formatTime(value) {
  const seconds = Math.ceil(value);
  return `00:${String(seconds).padStart(2, "0")}`;
}

function loop(time) {
  const dt = Math.min(0.033, (time - world.lastTime) / 1000 || 0);
  world.lastTime = time;
  update(dt);
  drawGrid();
  drawPlatforms();
  pickups.forEach((item) => drawKey(item.x, item.y, item.taken));
  drawDoor();
  drawPlayer();
  drawHud();
  drawIntro();
  drawWin();
  requestAnimationFrame(loop);
}

function setControl(control, pressed) {
  keys[control] = pressed;
  if (control === "jump" && pressed) {
    player.jumpBuffer = 0.14;
  }
  document.querySelector(`[data-control="${control}"]`)?.classList.toggle("pressed", pressed);
}

window.addEventListener("resize", fitCanvas);
window.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft" || event.code === "KeyA") setControl("left", true);
  if (event.code === "ArrowRight" || event.code === "KeyD") setControl("right", true);
  if (event.code === "ArrowUp" || event.code === "Space" || event.code === "KeyW") setControl("jump", true);
});
window.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft" || event.code === "KeyA") setControl("left", false);
  if (event.code === "ArrowRight" || event.code === "KeyD") setControl("right", false);
  if (event.code === "ArrowUp" || event.code === "Space" || event.code === "KeyW") setControl("jump", false);
});

controlButtons.forEach((button) => {
  const control = button.dataset.control;
  button.addEventListener("selectstart", (event) => event.preventDefault());
  button.addEventListener("contextmenu", (event) => event.preventDefault());
  button.addEventListener("dragstart", (event) => event.preventDefault());
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    setControl(control, true);
  });
  button.addEventListener("pointerup", () => setControl(control, false));
  button.addEventListener("pointercancel", () => setControl(control, false));
  button.addEventListener("lostpointercapture", () => setControl(control, false));
});

startButton.addEventListener("click", () => {
  if (world.won && !world.finalWin) {
    startLevel(world.levelIndex + 1);
    return;
  }
  resetGame();
});

fitCanvas();
startLevel(0);
world.started = false;
startButton.textContent = "START";
startButton.classList.remove("hidden");
setTelegramVisible(false);

if (new URLSearchParams(window.location.search).get("final") === "1") {
  world.started = true;
  world.won = true;
  world.finalWin = true;
  world.completedLevels = levels.length;
  world.levelIndex = levels.length - 1;
  player.collected = pickups.length;
  startButton.textContent = "AGAIN";
  startButton.classList.remove("hidden");
  setTelegramVisible(true);
}

logo.addEventListener("load", () => drawGrid());
requestAnimationFrame(loop);
