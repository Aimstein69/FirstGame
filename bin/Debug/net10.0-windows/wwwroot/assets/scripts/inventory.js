import { player } from "./player.js";

// INVENTAIRE PRINCIPAL (30 slots)
export const inventory = {
  slots: Array(30).fill(null),
  open: { value: false },
};

// INVENTAIRE D’OBJETS DE QUÊTE
export const questItems = [];

// AJOUTER UN OBJET NORMAL
export function addItem(item) {
  const index = inventory.slots.findIndex((s) => s === null);
  if (index !== -1) {
    inventory.slots[index] = item;
  } else {
    console.warn("Inventaire plein !");
  }
}

// AJOUTER UN OBJET DE QUÊTE
export function addQuestItem(item) {
  questItems.push(item);
}

// UTILISER / ÉQUIPER UN OBJET
export function useItem(index) {
  const item = inventory.slots[index];
  if (!item) return;

  // --- CONSOMMABLE ---
  if (item.type === "consommable") {
    if (item.hp) {
      player.hp = Math.min(player.maxHP, player.hp + item.hp);
    }
    inventory.slots[index] = null;
    return;
  }

  // --- ARME ---
  if (item.type === "arme") {
    player.weapon = item;
    inventory.slots[index] = null;
    return;
  }

  // --- ÉQUIPEMENT (casque, cagoule, armure, etc.) ---
  if (item.type === "equipement") {
    player.armor = item;
    inventory.slots[index] = null;
    return;
  }
}

// OUVRIR / FERMER INVENTAIRE
export function toggleInventory() {
  inventory.open.value = !inventory.open.value;
}
