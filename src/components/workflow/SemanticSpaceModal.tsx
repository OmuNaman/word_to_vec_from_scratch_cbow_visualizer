// FILE: src/components/workflow/SemanticSpaceModal.tsx
import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VectorArithmeticControls } from './VectorArithmeticControls';
import { SemanticSpacePlot } from './SemanticSpacePlot';
import { semanticWords, WordVector } from '@/utils/semanticData';

interface SemanticSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Calculation = {
    wordA: string;
    op1: string;
    wordB: string;
    op2: string;
    wordC: string;
    result: { word: string; vector: WordVector };
}

export function SemanticSpaceModal({ isOpen, onClose }: SemanticSpaceModalProps) {
  const [calculation, setCalculation] = useState<Calculation | null>(null);

  const findClosestWord = (targetVector: WordVector): { word: string; vector: WordVector } => {
    let closestWord = '';
    let minDistance = Infinity;

    Object.entries(semanticWords).forEach(([word, vector]) => {
      const distance = Math.sqrt(Math.pow(vector.x - targetVector.x, 2) + Math.pow(vector.y - targetVector.y, 2));
      if (distance < minDistance) {
        minDistance = distance;
        closestWord = word;
      }
    });

    return { word: closestWord, vector: semanticWords[closestWord] };
  };

  const handleCalculate = (wordA: string, op1: string, wordB: string, op2: string, wordC: string) => {
    const vecA = semanticWords[wordA];
    const vecB = semanticWords[wordB];
    const vecC = semanticWords[wordC];

    let resultX = vecA.x;
    resultX += op1 === '+' ? vecB.x : -vecB.x;
    resultX += op2 === '+' ? vecC.x : -vecC.x;

    let resultY = vecA.y;
    resultY += op1 === '+' ? vecB.y : -vecB.y;
    resultY += op2 === '+' ? vecC.y : -vecC.y;
    
    const resultVector = { x: resultX, y: resultY, color: '#a78bfa' }; // purple for result
    const closest = findClosestWord(resultVector);
    
    setCalculation({ wordA, op1, wordB, op2, wordC, result: closest });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] bg-slate-900/90 backdrop-blur-md border-slate-700 text-white flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">The Semantic Space</DialogTitle>
          <DialogDescription>
            This is what a trained embedding space looks like. The positions of words are not random; they capture meaning.
            Use the controls below to perform vector arithmetic and see the relationships for yourself.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow">
            <SemanticSpacePlot calculation={calculation} />
        </div>
        <div className="shrink-0">
          <VectorArithmeticControls onCalculate={handleCalculate} />
          {calculation && (
            <div className="mt-4 p-3 text-center bg-slate-800/50 rounded-lg">
                <p className="text-lg">
                    Result of <span className="font-mono text-amber-400">{`${calculation.wordA} ${calculation.op1} ${calculation.wordB} ${calculation.op2} ${calculation.wordC}`}</span> is closest to: 
                    <span className="font-bold text-2xl text-purple-400 ml-2">{calculation.result.word}</span>
                </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}