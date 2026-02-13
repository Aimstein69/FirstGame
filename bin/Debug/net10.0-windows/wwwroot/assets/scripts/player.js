export const player = {
  x: 64,
  y: 64,
  size: 24,
  speed: 3,
  // --- STATISTIQUES ---
  maxHP: 100,
  hp: 100,

  strength: 1, // Force
  charisma: 1, // Charisme
  defense: 1, // Défense

  level: 1, // Niveau
  xp: 0, // Expérience actuelle
  xpToNext: 100, // XP nécessaire pour passer au niveau 2

  // --- ÉQUIPEMENT ---
  weapon: null,
  armor: null,
};

// Dégâts du joueur
export function getPlayerDamage() {
  let base = 5 + player.strength * 2;
  if (player.weapon) {
    base += player.weapon.strength || 0;
  }
  return base;
}
// Défense du joueur
export function getPlayerDefense() {
  let base = player.defense;
  if (player.armor) {
    base += player.armor.defense || 0;
    base += player.armor.charisma || 0; // Certains équipements peuvent aussi augmenter le charisme
  }
  return base;
} // XP et montée de niveau export function addXP(amount) { player.xp += amount; while (player.xp >= player.xpToNext) { player.xp -= player.xpToNext; player.level++; player.xpToNext = Math.floor(player.xpToNext * 1.5); player.maxHP += 10; player.hp = player.maxHP; player.strength += 1; player.defense += 1; } }
export function addXP(amount) {
  player.xp += amount;
  while (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    player.level++;
    player.xpToNext = Math.floor(player.xpToNext * 1.5);
    player.maxHP += 10;
    player.hp = player.maxHP;
    player.strength += 1;
    player.defense += 1;
  }
}
export function getTotalStrength() {
  let total = player.strength;

  if (player.weapon && player.weapon.strength) {
    total += player.weapon.strength;
  }

  if (player.armor && player.armor.strength) {
    total += player.armor.strength;
  }

  return total;
}

export function getTotalCharisma() {
  let total = player.charisma;

  if (player.weapon && player.weapon.charisma) {
    total += player.weapon.charisma;
  }

  if (player.armor && player.armor.charisma) {
    total += player.armor.charisma;
  }

  return total;
}
