export const npc = {
  x: 168,
  y: 160,
  size: 24,
  dialogue: [
    { text: "Bonjour voyageur, j'ai besoin de ton aide." },

    {
      text: "Accepterais-tu de m'aider ?",
      choices: [
        { text: "Oui, bien sûr.", next: 2, action: "accept" },
        { text: "Non, désolé.", next: 3, action: "refuse" },
      ],
    },

    { text: "Des écolos m'ont fait signer une pétition de force..." },

    {
      text: "Dans ce coffre là-bas, il y a une batte de baseball,\nainsi qu'une cagoule très effrayante.\nC'est pour toi si tu récupères les pétitions.",
      end: true,
    },

    { text: "Très bien, peut-être une autre fois.", end: true },
  ],
};
