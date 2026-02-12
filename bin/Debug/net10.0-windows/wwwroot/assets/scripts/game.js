import { loadMap } from "./map.js";
import { player } from "./player.js";
import { npc } from "./npc.js";
import { quests, questMenuOpen, toggleQuestMenu } from "./quests.js";
import { getDialogueLines } from "./dialogue.js";
import {
  talking,
  dialogueIndex,
  selectedChoice,
  startDialogue,
  advanceDialogue,
} from "./dialogue.js";
import { isWallRect, isCollidingWithNPC } from "./collisions.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let keys = {};
let map = null;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

async function start() {
  map = await loadMap("village");
  update();
  draw();
}

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if (e.key === "j" || e.key === "J") {
    toggleQuestMenu();
    return;
  }

  if (e.key === "Escape") {
    startDialogue(false);
    return;
  }

  if (talking.value) {
    const entry = npc.dialogue[dialogueIndex.value];

    if (entry.choices) {
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

  if (e.key === "e" || e.key === "E") {
    if (isNearNPC()) {
      startDialogue(true);
    }
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function isNearNPC() {
  const distX = Math.abs(player.x - npc.x);
  const distY = Math.abs(player.y - npc.y);
  return distX < 40 && distY < 40;
}

function update() {
  if (questMenuOpen.value) {
    draw();
    requestAnimationFrame(update);
    return;
  }

  if (talking.value) {
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
    !isCollidingWithNPC(nextX, player.y, player, npc)
  ) {
    player.x = nextX;
  }

  if (
    !isWallRect(player.x, nextY, player.size, map) &&
    !isCollidingWithNPC(player.x, nextY, player, npc)
  ) {
    player.y = nextY;
  }

  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

  ctx.fillStyle = "blue";
  ctx.fillRect(npc.x, npc.y, npc.size, npc.size);

  ctx.fillStyle = "yellow";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  /* -------------------------------------------------------
     🔥 Dialogue multi‑lignes corrigé
  ------------------------------------------------------- */
  if (talking.value) {
    const entry = npc.dialogue[dialogueIndex.value];

    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(20, canvas.height - 160, canvas.width - 40, 140);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    // 🔥 Utilisation de getDialogueLines()
    const lines = getDialogueLines();
    let y = canvas.height - 120;

    for (let line of lines) {
      ctx.fillText(line, 40, y);
      y += 26;
    }

    if (entry.choices) {
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
}

start();
