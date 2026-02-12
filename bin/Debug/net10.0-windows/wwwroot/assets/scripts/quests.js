export let quests = [];

export let questMenuOpen = { value: false };

export function toggleQuestMenu() {
  questMenuOpen.value = !questMenuOpen.value;
}
export function addQuest(quest) {
  // Vérifie si la quête existe déjà
  const exists = quests.some((q) => q.id === quest.id);

  if (!exists) {
    quests.push(quest);
  }
}
