import { loadMap } from "./map.js";
import { getTotalCharisma, getTotalStrength, player } from "./player.js";

import {
  inventory,
  questItems,
  toggleInventory,
  useItem,
} from "./inventory.js";

import { chest, openChest } from "./chest.js";
import { isCollidingWithChest } from "./collisions.js";

import { npc } from "./npc.js";
import { quests, questMenuOpen, toggleQuestMenu } from "./quests.js";

import {
  talking,
  dialogueIndex,
  selectedChoice,
  startDialogue,
  advanceDialogue,
  getDialogueLines,
} from "./dialogue.js";

import { isWallRect, isCollidingWithNPC } from "./collisions.js";
import { startCombat } from "./figth.js";
import { createEnemy } from "./enemy.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let keys = {};
let map = null;

/* -------------------------------------------------------
   🔧 ENNEMIS
------------------------------------------------------- */
let enemies = [createEnemy(120, 400)];
let lastCombatTime = 0;

/* -------------------------------------------------------
   🔧 Resize canvas
------------------------------------------------------- */
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

/* -------------------------------------------------------
   🎮 UseItems on click
------------------------------------------------------- */
canvas.addEventListener("click", (e) => {
  if (!inventory.open.value) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const slotSize = 64;
  const cols = 6;
  const startX = 70;
  const startY = 150;

  for (let i = 0; i < 30; i++) {
    const x = startX + (i % cols) * (slotSize + 10);
    const y = startY + Math.floor(i / cols) * (slotSize + 10);

    if (
      mouseX >= x &&
      mouseX <= x + slotSize &&
      mouseY >= y &&
      mouseY <= y + slotSize
    ) {
      useItem(i);
      return;
    }
  }
});

/* -------------------------------------------------------
   🚀 Start
------------------------------------------------------- */
async function start() {
  map = await loadMap("village");
  update();
  draw();
}

/* -------------------------------------------------------
   🎮 Keydown
------------------------------------------------------- */
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  // INVENTAIRE
  if (e.key === "i" || e.key === "I") {
    toggleInventory();
    return;
  }

  // JOURNAL DE QUÊTES
  if (e.key === "j" || e.key === "J") {
    toggleQuestMenu();
    return;
  }

  // QUITTER DIALOGUE
  if (e.key === "Escape") {
    startDialogue(false);
    dialogueIndex.value = 0;
    selectedChoice.value = 0;
    return;
  }

  // SI ON EST EN DIALOGUE
  if (talking.value) {
    const entry = npc.dialogue[dialogueIndex.value];

    if (entry?.choices) {
      if (e.key === "ArrowUp") {
        selectedChoice.value = Math.max(0, selectedChoice.value - 1);
      }
      if (e.key === "ArrowDown") {
        selectedChoice.value = Math.min(
          entry.choices.length - 1,
          selectedChoice.value + 1,
        );
      }
    }

    if (e.key === "e" || e.key === "E") {
      advanceDialogue();
    }

    return;
  }

  /* -------------------------------------------------------
     🎮 INTERACTION (E)
     PRIORITÉ AU COFFRE
  ------------------------------------------------------- */
  if (e.key === "e" || e.key === "E") {
    // COFFRE EN PREMIER
    if (isNearChest()) {
      const success = openChest();

      dialogueIndex.value = 0;
      selectedChoice.value = 0;

      if (success) {
        npc.dialogue = [
          { text: "Tu ouvres le coffre..." },
          {
            text: "Tu trouves une batte de baseball et une cagoule Hello Kitty.",
            end: true,
          },
        ];
      } else {
        npc.dialogue = [{ text: "Le coffre est vide.", end: true }];
      }

      startDialogue(true);
      return;
    }

    // ENSUITE PNJ
    if (isNearNPC()) {
      startDialogue(true);
      return;
    }
  }
});

/* -------------------------------------------------------
   🎮 Keyup
------------------------------------------------------- */
window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

/* -------------------------------------------------------
   🔍 Distance joueur → PNJ
------------------------------------------------------- */
function isNearNPC() {
  const distX = Math.abs(player.x - npc.x);
  const distY = Math.abs(player.y - npc.y);
  return distX < 40 && distY < 40;
}

/* -------------------------------------------------------
   🔍 Distance joueur → COFFRE
------------------------------------------------------- */
function isNearChest() {
  const distX = Math.abs(player.x - chest.x);
  const distY = Math.abs(player.y - chest.y);
  return distX < 40 && distY < 40;
}

/* -------------------------------------------------------
   🔍 Collision joueur → ENNEMI
------------------------------------------------------- */
function isCollidingWithEnemy(player, enemy) {
  return !(
    player.x + player.size < enemy.x ||
    player.x > enemy.x + enemy.size ||
    player.y + player.size < enemy.y ||
    player.y > enemy.y + enemy.size
  );
}

/* -------------------------------------------------------
   🔄 Update
------------------------------------------------------- */
function update() {
  const now = performance.now();

  for (let enemy of enemies) {
    if (isCollidingWithEnemy(player, enemy)) {
      if (now - lastCombatTime > 1000) {
        startCombat(enemy);
        lastCombatTime = now;
      }
    }
  }

  enemies = enemies.filter((e) => !e.dead);

  if (questMenuOpen.value || inventory.open.value || talking.value) {
    draw();
    requestAnimationFrame(update);
    return;
  }

  let nextX = player.x;
  let nextY = player.y;

  if (keys["ArrowUp"] || keys["z"]) nextY -= player.speed;
  if (keys["ArrowDown"] || keys["s"]) nextY += player.speed;
  if (keys["ArrowLeft"] || keys["q"]) nextX -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) nextX += player.speed;

  if (
    !isWallRect(nextX, player.y, player.size, map) &&
    !isCollidingWithNPC(nextX, player.y, player, npc) &&
    !isCollidingWithChest(nextX, player.y, player, chest)
  ) {
    player.x = nextX;
  }

  if (
    !isWallRect(player.x, nextY, player.size, map) &&
    !isCollidingWithNPC(player.x, nextY, player, npc) &&
    !isCollidingWithChest(player.x, nextY, player, chest)
  ) {
    player.y = nextY;
  }

  draw();
  requestAnimationFrame(update);
}

/* -------------------------------------------------------
   🎨 Draw
------------------------------------------------------- */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  function truncateText(text, maxLength) {
    return text.length > maxLength
      ? text.substring(0, maxLength - 3) + "..."
      : text;
  }

  /* MAP */
  if (map) {
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tile = map.tiles[y][x];
        ctx.fillStyle = tile === 1 ? "#444" : "#2a2";
        ctx.fillRect(
          x * map.tileSize,
          y * map.tileSize,
          map.tileSize,
          map.tileSize,
        );
      }
    }
  }

  /* PNJ */
  ctx.fillStyle = "white";
  ctx.fillRect(npc.x, npc.y, npc.size, npc.size);

  /* ENNEMIS */
  for (let enemy of enemies) {
    ctx.fillStyle = "red";
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);

    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(enemy.hp + "/" + enemy.maxHP, enemy.x, enemy.y - 5);
  }

  /* COFFRE */
  ctx.fillStyle = chest.opened ? "brown" : "purple";
  ctx.fillRect(chest.x, chest.y, chest.size, chest.size);

  /* PLAYER */
  ctx.fillStyle = "yellow";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  /* HUD */
  ctx.fillStyle = "yellow";
  ctx.fillText("PV : " + player.hp + "/" + player.maxHP, 600, 30);
  ctx.fillText("Niveau : " + player.level, 600, 60);
  ctx.fillText("XP : " + player.xp + "/" + player.xpToNext, 600, 90);
  ctx.fillText("Force : " + getTotalStrength(), 600, 120);
  ctx.fillText("Défense : " + player.defense, 600, 150);
  ctx.fillText("Charisme : " + getTotalCharisma(), 600, 180);

  /* DIALOGUE */
  if (talking.value) {
    const entry = npc.dialogue[dialogueIndex.value];

    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(20, canvas.height - 160, canvas.width - 40, 140);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    const lines = getDialogueLines();
    let y = canvas.height - 120;

    for (let line of lines) {
      ctx.fillText(line, 40, y);
      y += 26;
    }

    if (entry?.choices) {
      for (let i = 0; i < entry.choices.length; i++) {
        const choice = entry.choices[i];
        const cy = canvas.height - 80 + i * 30;

        ctx.fillStyle = i === selectedChoice.value ? "yellow" : "white";
        ctx.fillText(
          (i === selectedChoice.value ? "> " : "") + choice.text,
          40,
          cy,
        );
      }
    }
  }

  /* QUEST MENU */
  if (questMenuOpen.value) {
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

    ctx.fillStyle = "white";
    ctx.font = "26px Arial";
    ctx.fillText("Quêtes", 70, 100);

    ctx.font = "20px Arial";

    if (quests.length === 0) {
      ctx.fillText("Aucune quête pour le moment.", 70, 150);
    } else {
      let y = 150;
      for (let q of quests) {
        ctx.fillText("- " + q.title + " (" + q.status + ")", 70, y);
        y += 30;
      }
    }
  }

  /* INVENTAIRE */
  if (inventory.open.value) {
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

    ctx.fillStyle = "white";
    ctx.font = "26px Arial";
    ctx.fillText("Inventaire", 70, 100);

    const slotSize = 64;
    const cols = 6;
    const startX = 70;
    const startY = 150;

    for (let i = 0; i < 30; i++) {
      const x = startX + (i % cols) * (slotSize + 10);
      const y = startY + Math.floor(i / cols) * (slotSize + 10);

      ctx.strokeStyle = "white";
      ctx.strokeRect(x, y, slotSize, slotSize);

      const item = inventory.slots[i];
      if (item) {
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.fillText(truncateText(item.name, 10), x + 5, y + 20);
      }
    }

    ctx.font = "22px Arial";
    ctx.fillText(
      "Objets de quête :",
      startX,
      startY + 5 * (slotSize + 10) + 60,
    );

    let y = startY + 5 * (slotSize + 10) + 100;
    for (let qi of questItems) {
      ctx.fillText("- " + qi.name, startX, y);
      y += 24;
    }
  }
}

start();
