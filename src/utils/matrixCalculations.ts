// FILE: src/utils/matrixCalculations.ts

// --- Word2Vec Parameters ---
// Vocabulary: ['the', 'cat', 'sat', 'on', 'mat']
// Embedding Dimension: 3
// Window Size: 1
// Training Example: context=['cat', 'on'], target='sat'

export const VOCAB = ['the', 'cat', 'sat', 'on', 'mat'];

// --- One-Hot Vectors ---
export const ONE_HOT_CAT = [[0, 1, 0, 0, 0]];
export const ONE_HOT_ON = [[0, 0, 0, 1, 0]];
export const ONE_HOT_SAT = [[0, 0, 1, 0, 0]]; // Ground Truth (Y)

// --- Weight Matrices ---
// W1 (Embedding Matrix): 5x3
export const W1 = [
  [0.1, 0.8, -0.3],  // the
  [0.9, -0.2,  0.1],  // cat
  [-0.5, 0.4,  0.6],  // sat
  [-0.2, 0.7, -0.5],  // on
  [0.2, 0.8, -0.2]   // mat
];

// W2 (Output Matrix): 3x5
export const W2 = [
  [0.4, -0.1, 0.7, 0.2, 0.3],
  [-0.2, 0.3, -0.3, 0.6, -0.4],
  [0.1, 0.5, -0.2, 0.1, 0.8]
];


// --- Math Helpers ---

export function matrixMultiply(a: number[][], b: number[][]): number[][] {
  const resultRows = a.length;
  const resultCols = b[0].length;
  const innerDim = b.length;

  if (a[0].length !== b.length) {
    console.error("Matrix dimensions incompatible for multiplication:", a[0].length, "vs", b.length);
    return Array(resultRows).fill(null).map(() => Array(resultCols).fill(NaN));
  }

  const result = Array(resultRows).fill(null).map(() => Array(resultCols).fill(0));
  
  for (let i = 0; i < resultRows; i++) {
    for (let j = 0; j < resultCols; j++) {
      for (let k = 0; k < innerDim; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  
  return result;
}

export function matrixAdd(a: number[][], b: number[][]): number[][] {
  if (a.length !== b.length || a[0].length !== b[0].length) { return a; }
  return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}

export function scalarMultiply(matrix: number[][], scalar: number): number[][] {
  return matrix.map(row => row.map(val => val * scalar));
}

// Softmax function with numerical stability
export function softmax(matrix: number[][]): number[][] {
  return matrix.map(row => {
    const maxVal = Math.max(...row);
    const expRow = row.map(x => Math.exp(x - maxVal));
    const sum = expRow.reduce((acc, val) => acc + val, 0);
    if (sum === 0) return row.map(() => 1 / row.length);
    return expRow.map(x => x / sum);
  });
}

// Loss Function
export function crossEntropyLoss(y_pred: number[][], y_true: number[][]): number[][] {
  let loss = 0;
  // Assuming y_pred and y_true are single-row matrices (vectors)
  if (!y_pred[0] || !y_true[0]) return [[NaN]];

  for (let i = 0; i < y_pred[0].length; i++) {
    const epsilon = 1e-12; // To prevent log(0)
    loss += y_true[0][i] * Math.log(y_pred[0][i] + epsilon);
  }
  return [[-loss]];
}