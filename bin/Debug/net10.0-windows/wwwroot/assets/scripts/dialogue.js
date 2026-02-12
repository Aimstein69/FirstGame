import { npc } from "./npc.js";
import { addQuest } from "./quests.js";

export let talking = { value: false };
export let dialogueIndex = { value: 0 };
export let selectedChoice = { value: 0 };
export let questAccepted = { value: false };

export function startDialogue(state) {
  talking.value = state;
  dialogueIndex.value = 0;
  selectedChoice.value = 0;
}

export function advanceDialogue() {
  const entry = npc.dialogue[dialogueIndex.value];

  if (entry.choices) {
    const choice = entry.choices[selectedChoice.value];

    if (choice.action === "accept") {
      questAccepted.value = true;
      addQuest({
        id: "quete_pnj_1",
        title: "Aider le villageois",
        description: "Le PNJ a besoin de ton aide.",
        status: "active",
      });
    }

    if (choice.action === "refuse") {
      questAccepted.value = false;
    }

    dialogueIndex.value = choice.next;
    selectedChoice.value = 0;
    return;
  }

  if (entry.end) {
    startDialogue(false);
    return;
  }

  dialogueIndex.value++;
}

/* -------------------------------------------------------
   🔥 Renvoie un tableau de lignes à afficher
   ------------------------------------------------------- */
export function getDialogueLines() {
  const entry = npc.dialogue[dialogueIndex.value];

  if (!entry) return [];

  // Si c'est déjà un tableau → parfait
  if (Array.isArray(entry.text)) {
    return entry.text;
  }

  // Si c'est une string → on découpe sur \n
  return entry.text.split("\n");
}
