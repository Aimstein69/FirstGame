import { player, getTotalStrength, getPlayerDefense, addXP } from "./player.js";

export function startCombat(enemy) {
  // Dégâts du joueur
  const playerDamage = Math.max(1, getTotalStrength() - enemy.defense);
  enemy.hp -= playerDamage;

  console.log("Tu frappes l’ennemi pour", playerDamage, "dégâts !");

  if (enemy.hp <= 0) {
    console.log("Ennemi vaincu !");
    addXP(enemy.xpReward);
    enemy.dead = true;
    return;
  }

  // Dégâts de l’ennemi
  const enemyDamage = Math.max(1, enemy.strength - getPlayerDefense());
  player.hp -= enemyDamage;

  console.log("L’ennemi te frappe pour", enemyDamage, "dégâts !");

  if (player.hp <= 0) {
    console.log("Tu es mort !");
    // plus tard : écran de game over
  }
}
