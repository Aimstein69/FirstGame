import { addItem } from "./inventory.js";

export const chest = {
  x: 277,
  y: 220,
  size: 12,
  opened: false,
};

export function openChest() {
  if (chest.opened) return false;

  chest.opened = true;

  // Ajout des objets
  addItem({
    id: "batte",
    name: "Batte de baseball",
    type: "arme",
    strength: 5,
  });

  addItem({
    id: "cagoule",
    name: "Cagoule Hello Kitty",
    type: "equipement",
    charisma: 2,
  });

  return true;
}
