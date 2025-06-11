// FILE: src/utils/workflowData.ts
import type { Node, Edge } from '@xyflow/react';
import { 
  VOCAB, ONE_HOT_CAT, ONE_HOT_ON, ONE_HOT_SAT, W1, W2,
  matrixMultiply, matrixAdd, scalarMultiply, softmax, crossEntropyLoss
} from './matrixCalculations';

// --- FORWARD PASS CALCULATIONS ---
// Changed X_INPUT to sum only, no division by 2
const X_INPUT = matrixAdd(ONE_HOT_CAT, ONE_HOT_ON);
const H_LAYER = matrixMultiply(X_INPUT, W1);
const Z_LOGITS = matrixMultiply(H_LAYER, W2);
const Y_PRED = softmax(Z_LOGITS);
const LOSS = crossEntropyLoss(Y_PRED, ONE_HOT_SAT);


// --- Node Positions ---
const col_context = -650;
const col0 = 0, col1 = 600, col2 = 1200, col3 = 1800, col4 = 2400, col5 = 3000, col6 = 3600;
const row_mid = 400;

export const initialNodes: Node[] = [
  // --- NEW INTRODUCTION NODE ---
  { 
    id: 'intro-context', 
    type: 'context', 
    position: { x: col_context, y: row_mid }, 
    data: { 
      label: "Our Training Goal",
      description: "We'll predict a target word using its surrounding context words.",
      sentence: "the cat sat on the mat",
      targetWord: "sat",
      contextWords: ["cat", "on"],
    } 
  },

  // --- Step 1: Context & One-Hot ---
  { id: 'context-cat', type: 'wordVector', position: { x: col0, y: row_mid - 250 }, data: { label: "Context Word: 'cat'", matrix: ONE_HOT_CAT, description: "One-Hot Vector (1x5)", vocabulary: VOCAB } },
  { id: 'context-on', type: 'wordVector', position: { x: col0, y: row_mid + 250 }, data: { label: "Context Word: 'on'", matrix: ONE_HOT_ON, description: "One-Hot Vector (1x5)", vocabulary: VOCAB } },

  // --- Step 2: Averaging ---
  // Formula updated to reflect sum only
  { id: 'calc-x', type: 'calculation', position: { x: col1, y: row_mid }, data: { label: 'Sum Context Vectors (X)', formula: "X = Vcat + Von", expectedMatrix: X_INPUT, description: 'Calculate Input Vector', hint: 'Add the two one-hot vectors. This sums up where the context words are in the vocabulary.', vocabulary: VOCAB } },
  
  // --- Step 3: Hidden Layer ---
  { id: 'w1-matrix', type: 'matrix', position: { x: col2, y: row_mid - 300 }, data: { label: "Embedding Matrix (W¹)", matrix: W1, description: "5x3 Matrix" } },
  { id: 'calc-h', type: 'calculation', position: { x: col3, y: row_mid }, data: { label: 'Calculate Hidden Layer', formula: "h = X ⋅ W¹", expectedMatrix: H_LAYER, description: "The 'Context Embedding'", hint: "Multiply the 1x5 Input Vector by the 5x3 Embedding Matrix." } },

  // --- Step 4: Output Layer ---
  { id: 'w2-matrix', type: 'matrix', position: { x: col4, y: row_mid - 300 }, data: { label: "Output Matrix (W²)", matrix: W2, description: "3x5 Matrix" } },
  { id: 'calc-z', type: 'calculation', position: { x: col5, y: row_mid }, data: { label: 'Calculate Logits', formula: "Z = h ⋅ W²", expectedMatrix: Z_LOGITS, description: "Raw Vocabulary Scores", hint: "Multiply the 1x3 Hidden Layer by the 3x5 Output Matrix.", vocabulary: VOCAB } },

  // --- Step 5: Prediction & Loss ---
  { id: 'activate-y-pred', type: 'activation', position: { x: col6, y: row_mid }, data: { label: 'Get Prediction (ŷ)', formula: "ŷ = Softmax(Z)", expectedMatrix: Y_PRED, description: "Convert Scores to Probabilities", vocabulary: VOCAB, highlightMax: true } },
  { id: 'y-true', type: 'wordVector', position: { x: col6, y: row_mid + 400 }, data: { label: "Correct Answer (Y)", matrix: ONE_HOT_SAT, description: "Target: 'sat' (1x5)", vocabulary: VOCAB } },
  { id: 'calc-loss', type: 'calculation', position: { x: col6 + 700, y: row_mid }, data: { label: 'Calculate Loss', formula: "L = -Σ(Y ⋅ log(ŷ))", expectedMatrix: LOSS, description: 'Cross-Entropy Loss', hint: 'The formula measures how different the prediction is from the correct answer.' } },
];

export const initialEdges: Edge[] = [
  // Edges from the new context node
  { id: 'e-intro-cat', source: 'intro-context', target: 'context-cat', animated: true, style: { strokeWidth: 2, stroke: '#9ca3af' } },
  { id: 'e-intro-on', source: 'intro-context', target: 'context-on', animated: true, style: { strokeWidth: 2, stroke: '#9ca3af' } },
  // Commented out as requested
  // { id: 'e-intro-ytrue', source: 'intro-context', target: 'y-true', animated: true, style: { strokeWidth: 2, stroke: '#9ca3af' } },


  { id: 'e-cat-x', source: 'context-cat', target: 'calc-x', animated: true },
  { id: 'e-on-x', source: 'context-on', target: 'calc-x', animated: true },
  
  { id: 'e-x-h', source: 'calc-x', target: 'calc-h', animated: true },
  { id: 'e-w1-h', source: 'w1-matrix', target: 'calc-h', animated: true },

  { id: 'e-h-z', source: 'calc-h', target: 'calc-z', animated: true },
  { id: 'e-w2-z', source: 'w2-matrix', target: 'calc-z', animated: true },

  { id: 'e-z-ypred', source: 'calc-z', target: 'activate-y-pred', animated: true },
  
  { id: 'e-ypred-loss', source: 'activate-y-pred', target: 'calc-loss', animated: true },
  { id: 'e-ytrue-loss', source: 'y-true', target: 'calc-loss', animated: true },
];