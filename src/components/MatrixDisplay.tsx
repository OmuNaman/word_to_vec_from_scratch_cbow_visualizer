// FILE: src/components/MatrixDisplay.tsx
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

interface MatrixDisplayProps {
  matrix: number[][];
  highlight?: boolean[][];
  vocabulary?: string[]; // Optional: for displaying word headers
}

export function MatrixDisplay({ matrix, highlight, vocabulary }: MatrixDisplayProps) {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-block"
    >
      <div className={`px-2 py-1 rounded-md`}>
        {vocabulary && (
            <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: `repeat(${vocabulary.length}, minmax(0, 1fr))` }}>
                {vocabulary.map((word, i) => (
                    <div key={`word-header-${i}`} className={`w-12 h-6 flex items-center justify-center text-xs font-semibold rounded-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {word}
                    </div>
                ))}
            </div>
        )}
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${matrix[0]?.length || 1}, minmax(0, 1fr))` }}>
          {matrix.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`w-12 h-12 flex items-center justify-center text-sm font-mono rounded-md border transition-colors duration-150 ${
                  highlight?.[i]?.[j]
                    ? (isDark ? 'bg-blue-700/30 border-blue-500/70 text-blue-300' : 'bg-blue-100 border-blue-400 text-blue-700')
                    : (isDark ? 'bg-slate-700/50 border-slate-600 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-800')
                }`}
              >
                {typeof cell === 'number' ? cell.toFixed(2) : cell} 
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}