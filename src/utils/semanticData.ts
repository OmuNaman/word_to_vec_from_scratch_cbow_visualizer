// FILE: src/utils/semanticData.ts

export interface WordVector {
  x: number;
  y: number;
  color: string;
}

export const semanticWords: Record<string, WordVector> = {
  // Royal cluster
  king:   { x: 4, y: 5, color: '#facc15' }, // gold
  queen:  { x: 1, y: 5, color: '#facc15' },
  man:    { x: 4, y: 2, color: '#60a5fa' }, // lightblue
  woman:  { x: 1, y: 2, color: '#60a5fa' },
  
  // Animal cluster
  dog:    { x: -3, y: -4, color: '#a16207' }, // brown
  cat:    { x: -4, y: -4.5, color: '#a16207' },
  pet:    { x: -3.5, y: -3, color: '#a16207' },

  // Fruit cluster
  apple:  { x: 5, y: -3, color: '#ef4444' }, // red
  orange: { x: 5.5, y: -4, color: '#f97316' }, // orange
};