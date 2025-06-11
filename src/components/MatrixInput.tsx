// FILE: src/components/MatrixInput.tsx
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/ThemeProvider';
import { Lock } from 'lucide-react';

interface MatrixInputProps {
  matrix: number[][];
  onChange: (matrix: number[][]) => void;
  errors?: boolean[][];
  readonly?: boolean;
  isCompleted?: boolean;
  vocabulary?: string[];
  highlightMax?: boolean;
}

export function MatrixInput({ matrix, onChange, errors, readonly, isCompleted, vocabulary, highlightMax }: MatrixInputProps) {
  const { isDark } = useTheme();
  const [displayValues, setDisplayValues] = useState<string[][]>([]);

  const maxValIndex = useMemo(() => {
    if (!highlightMax || !matrix || matrix.length === 0) return -1;
    const vector = matrix[0];
    if (!vector || vector.length === 0) return -1;
    return vector.reduce((maxIndex, currentVal, currentIndex, arr) => 
      currentVal > arr[maxIndex] ? currentIndex : maxIndex, 0);
  }, [highlightMax, matrix]);

  useEffect(() => {
    setDisplayValues(
      matrix.map(row =>
        row.map(cellValue => (cellValue === 0 && !readonly && !isCompleted) ? "" : cellValue.toFixed(4))
      )
    );
    if(isCompleted) {
        // When completed, ensure the display values are formatted correctly from the source matrix
        setDisplayValues(matrix.map(row => row.map(cell => cell.toFixed(4))));
    }
  }, [matrix, readonly, isCompleted]);

  const handleInputChange = (i: number, j: number, value: string) => {
    if (readonly) return;
    const newDisplayValues = displayValues.map(row => [...row]);
    newDisplayValues[i][j] = value;
    setDisplayValues(newDisplayValues);
  };

  const handleBlur = (i: number, j: number) => {
    if (readonly) return;
    const currentDisplayValue = displayValues[i][j];
    const parsed = parseFloat(currentDisplayValue);
    const numericValue = (isNaN(parsed) || currentDisplayValue.trim() === "" || currentDisplayValue === "-") ? 0 : parsed;
    
    const newNumericMatrix = matrix.map(row => [...row]);
    if (newNumericMatrix[i][j] !== numericValue) {
      newNumericMatrix[i][j] = numericValue;
      onChange(newNumericMatrix);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-block relative">
      {readonly && <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/50 backdrop-blur-sm rounded-md"><Lock className={`w-6 h-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} /></div>}
      
      <div className={`px-2 py-1 rounded-md`}>
        {vocabulary && (
          <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: `repeat(${vocabulary.length}, minmax(0, 1fr))` }}>
            {vocabulary.map((word, i) => (
              <div key={`word-${i}`} className={`w-16 h-6 flex items-center justify-center text-xs font-semibold rounded-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {word}
              </div>
            ))}
          </div>
        )}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrix[0]?.length || 1}, minmax(0, 1fr))` }}>
          {matrix.map((row, i) =>
            row.map((_, j) => (
              <Input
                key={`${i}-${j}`}
                type="text"
                placeholder="0"
                value={displayValues[i]?.[j] ?? ''}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleInputChange(i, j, e.target.value)}
                onBlur={() => handleBlur(i, j)}
                className={`w-16 h-12 text-center text-sm font-mono transition-colors duration-150 rounded-md ${
                  readonly || isCompleted
                    ? (highlightMax && j === maxValIndex ? (isDark ? 'border-amber-400 bg-amber-700/30 text-amber-300' : 'border-amber-500 bg-amber-100 text-amber-700') : (isDark ? 'border-green-500 bg-green-700/20 text-green-300' : 'border-green-400 bg-green-100 text-green-700'))
                    : errors?.[i]?.[j]
                      ? (isDark ? 'border-red-500 bg-red-700/20 text-red-300' : 'border-red-400 bg-red-100 text-red-700')
                      : (isDark ? 'bg-slate-700 border-slate-600 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800')
                } focus-visible:ring-offset-0 focus-visible:ring-2`}
                readOnly={readonly || isCompleted}
              />
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}