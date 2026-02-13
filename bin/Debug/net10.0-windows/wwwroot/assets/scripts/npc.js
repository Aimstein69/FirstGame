export const npc = {
  x: 192,
  y: 180,
  size: 24,
  dialogue: [
    { text: "Bonjour voyageur, j'ai besoin de ton aide." },

    {
      text: "Accepterais-tu de m'aider ?",
      choices: [
        { text: "Oui, bien sûr.", next: 2, action: "accept" },
        { text: "Non, désolé.", next: 4, action: "refuse" }, // ← CORRECTION ICI
      ],
    },

    { text: "Des écolos m'ont fait signer une pétition de force..." },

    {
      text: "Dans ce coffre là-bas, il y a une batte de baseball,\nainsi qu'une cagoule très effrayante.\nC'est pour toi, va me récuperé les pétitions !",
      end: true,
    },

    { text: "Très bien, peut-être une autre fois.", end: true }, // ← message refus
  ],
};
export const chestDialogue = {
  opened: [
    { text: "Tu ouvres le coffre..." },
    {
      text: "Tu trouves une batte de baseball et une cagoule Hello Kitty.",
      end: true,
    },
  ],
  empty: [{ text: "Le coffre est vide.", end: true }],
};
