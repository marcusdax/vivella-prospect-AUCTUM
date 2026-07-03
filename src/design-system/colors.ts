export const colors = {
  parchment: '#F5F0EB',
  rootEarth: '#5C3D2E',
  neuralAmber: '#D4A24A',
  dawnRose: '#E8B4B4',
  flourishGreen: '#7A8B6F',
  deepBark: '#3D2B1F',
  warmStone: '#C4B5A5',
  softMist: '#E8E2DB',
} as const;

export type ColorName = keyof typeof colors;
