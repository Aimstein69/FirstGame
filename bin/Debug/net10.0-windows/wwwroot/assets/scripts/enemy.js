export function createEnemy(x, y) {
  return {
    x,
    y,
    size: 32,

    maxHP: 30,
    hp: 30,

    strength: 2,
    defense: 0,

    xpReward: 125, // XP donné quand tu le tues
    lootReward: {
      id: "potion",
      name: "Potion de soin",
      type: "consommable",
      heal: 20,
    },
    lootQuest: "pétitions", // objet que le joueur doit récupérer pour que le coffre soit ouvert
  };
}
