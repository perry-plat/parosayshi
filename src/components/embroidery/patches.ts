export type WordPatch = {
  word: string;
  cx: number;
  cy: number;
  scale: number;
  rotDeg: number;
  fill: [number, number, number];
  ink: [number, number, number];
  border: [number, number, number];
};

const INK: [number, number, number] = [0.07, 0.06, 0.08];
const BORDER: [number, number, number] = [0.97, 0.965, 0.94];

export const WORD_PATCHES: WordPatch[] = [
  {
    word: "INTENTMAXING",
    cx: 0.5,
    cy: 0.37,
    scale: 0.15,
    rotDeg: -5,
    fill: [0.28, 0.49, 0.92],
    ink: INK,
    border: BORDER,
  },
  {
    word: "IS THE",
    cx: 0.55,
    cy: 0.51,
    scale: 0.15,
    rotDeg: 4,
    fill: [0.96, 0.72, 0.19],
    ink: INK,
    border: BORDER,
  },
  {
    word: "SOLULU",
    cx: 0.45,
    cy: 0.65,
    scale: 0.15,
    rotDeg: -3,
    fill: [0.9, 0.36, 0.5],
    ink: INK,
    border: BORDER,
  },
];

export const FOOTER_FABRIC: [number, number, number] = [0.16, 0.13, 0.2];
