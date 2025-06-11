// FILE: src/components/workflow/CalculationNode.tsx
import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MatrixInput } from '@/components/MatrixInput';
import { useTheme } from '@/components/ThemeProvider';
import { CheckCircle, Calculator, Lightbulb, Unlock, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalculationNodeProps {
  data: {
    label: string;
    formula: string;
    description: string;
    expectedMatrix: number[][]; // This is REQUIRED
    hint: string;
    onComplete?: (nodeId: string) => void;
    disabled?: boolean;
    vocabulary?: string[];
  };
  id: string;
}

export function CalculationNode({ data, id }: CalculationNodeProps) {
  const { isDark } = useTheme();
  
  const initialMatrix = () => {
    const defaultEmptyMatrix = [[0]]; // A safe default 1x1 matrix for initialization

    // Robust checks for data.expectedMatrix validity
    if (!data.expectedMatrix || 
        !Array.isArray(data.expectedMatrix) || 
        data.expectedMatrix.length === 0 || 
        !Array.isArray(data.expectedMatrix[0]) || 
        data.expectedMatrix[0].length === 0) {
      
      console.warn(`Node ${id}: data.expectedMatrix is invalid or empty. Returning default 1x1 matrix.`, data.expectedMatrix);
      return defaultEmptyMatrix; 
    }

    // Now we are sure data.expectedMatrix has at least one row and one column
    return Array(data.expectedMatrix.length).fill(null).map(() => 
      Array(data.expectedMatrix[0].length).fill(0)
    );
  };

  const [userMatrix, setUserMatrix] = useState<number[][]>(initialMatrix());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [errors, setErrors] = useState<boolean[][]>([]);

  useEffect(() => {
    // Reset state if the node becomes active (not disabled) or expectedMatrix changes
    if (!data.disabled) {
        setUserMatrix(initialMatrix()); // Recalculate initial matrix based on current expectedMatrix
        setIsCompleted(false);
        setErrors([]);
        setShowHint(false);
    }
  }, [data.disabled, data.expectedMatrix]); // Dependency array includes expectedMatrix for proper reset

  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctAudioRef.current = new Audio('/correct.mp3');
    wrongAudioRef.current = new Audio('/wrong.mp3');
    correctAudioRef.current.load();
    wrongAudioRef.current.load();
  }, []);

  const playSound = (isCorrect: boolean) => {
    const audioElement = isCorrect ? correctAudioRef.current : wrongAudioRef.current;
    if (audioElement) {
      audioElement.currentTime = 0;
      audioElement.play().catch(e => console.error("Error playing sound:", e));
    }
  };

  const validateMatrix = (matrixToValidate: number[][]) => {
    if (data.disabled || isCompleted) return true;

    const newErrors = matrixToValidate.map((row, rIdx) => 
      row.map((cell, cIdx) => {
         const userValue = cell ?? 0;
         const expectedValue = data.expectedMatrix[rIdx]?.[cIdx] ?? NaN;
         const tolerance = 0.0001;
         return Math.abs(userValue - expectedValue) > tolerance;
      })
    );
    
    const allValid = newErrors.every(row => row.every(cellError => !cellError));
    setErrors(newErrors);
    
    if (allValid) {
      setIsCompleted(true);
      data.onComplete?.(id);
      playSound(true);
    } else {
      playSound(false);
    }
    
    return allValid;
  };

  const resetMatrix = () => {
    if (data.disabled || isCompleted) return;
    setUserMatrix(initialMatrix()); // Reset to the default empty matrix based on expected dimensions
    setErrors([]);
  };

  return (
    <Card 
      className="min-w-[320px] max-w-[400px] transition-all duration-300 relative shadow-xl rounded-lg overflow-hidden"
      style={{
        borderColor: isCompleted ? (isDark ? '#10b981' : '#059669') : (isDark ? '#475569' : '#e2e8f0'),
        borderWidth: '2px',
        opacity: data.disabled ? 0.7 : 1
      }}
    >

      <div className={`p-4 ${data.disabled ? 'pointer-events-none' : ''}`}>
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            {isCompleted ? <Unlock className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-500'}`} /> 
                         : <Calculator className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />}
            <h3 className={`font-semibold text-lg ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              {data.label}
            </h3>
            {isCompleted && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} ><CheckCircle className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-500'}`} /></motion.div>}
          </div>
          {data.description && <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{data.description}</p>}
        </div>

        <div className={`mb-4 p-3 border rounded-md text-center transition-colors duration-300 ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <div className={`text-2xl font-handwritten ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>{data.formula}</div>
        </div>

        <div className="flex items-center justify-between mb-4 gap-2">
          <Button onClick={() => setShowHint(!showHint)} variant="outline" size="sm" disabled={data.disabled || isCompleted}><Lightbulb className="w-3 h-3 mr-1" />Hint</Button>
          <Button onClick={resetMatrix} variant="outline" size="sm" disabled={data.disabled || isCompleted}><RotateCcw className="w-3 h-3 mr-1" />Reset</Button>
          <Button onClick={() => validateMatrix(userMatrix)} variant="outline" size="sm" disabled={data.disabled || isCompleted} className={`text-emerald-500 border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-500`}><CheckCircle2 className="w-3 h-3 mr-1" />Verify</Button>
        </div>

        {showHint && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`mb-4 p-3 border rounded-md transition-colors duration-300 ${isDark ? 'bg-yellow-900/20 border-yellow-600/30' : 'bg-yellow-50 border-yellow-300'}`}><p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>{data.hint}</p></motion.div>}

        <div className="flex justify-center">
          <MatrixInput
            matrix={userMatrix}
            onChange={setUserMatrix}
            errors={errors}
            readonly={data.disabled}
            isCompleted={isCompleted}
            vocabulary={data.vocabulary}
          />
        </div>
      </div>
      
      <Handle type="target" position={Position.Left} className="!bg-purple-500" />
      <Handle type="source" position={Position.Right} className="!bg-purple-500" />
    </Card>
  );
}