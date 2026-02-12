export function isWallRect(x, y, size, map) {
  const corners = [
    { x: x, y: y },
    { x: x + size, y: y },
    { x: x, y: y + size },
    { x: x + size, y: y + size },
  ];

  for (const c of corners) {
    const tileX = Math.floor(c.x / map.tileSize);
    const tileY = Math.floor(c.y / map.tileSize);

    if (tileX < 0 || tileY < 0 || tileX >= map.width || tileY >= map.height)
      return true;

    if (map.tiles[tileY][tileX] === 1) return true;
  }

  return false;
}

export function isCollidingWithNPC(nextX, nextY, player, npc) {
  return !(
    nextX + player.size < npc.x ||
    nextX > npc.x + npc.size ||
    nextY + player.size < npc.y ||
    nextY > npc.y + npc.size
  );
}
