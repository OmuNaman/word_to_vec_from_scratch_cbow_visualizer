// FILE: src/components/workflow/MatrixNode.tsx
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { MatrixDisplay } from '@/components/MatrixDisplay';
import { useTheme } from '@/components/ThemeProvider';
import { BookText } from 'lucide-react'; // Example icon

interface MatrixNodeProps {
  data: {
    label: string;
    matrix: number[][];
    description: string;
    isInput?: boolean;
    vocabulary?: string[]; // Optional: for displaying word headers
  };
}

export function MatrixNode({ data }: MatrixNodeProps) {
  const { isDark } = useTheme();

  return (
    <Card 
      className={`min-w-[320px] max-w-[450px] transition-all duration-300 shadow-lg rounded-lg relative overflow-hidden border-2 ${
        isDark ? 'border-blue-500/50 bg-slate-800/80' : 'border-blue-400 bg-white/90'
      }`}
    >
      <div className="p-4">
        <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
                <BookText className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                <h3 className={`font-semibold text-lg ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                {data.label}
                </h3>
            </div>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {data.description}
            </p>
        </div>
        
        <div className="flex justify-center">
          <MatrixDisplay 
            matrix={data.matrix} 
            vocabulary={data.vocabulary} // Pass vocabulary to MatrixDisplay
          /> 
        </div>
      </div>
      
      {!data.isInput && (
        <Handle type="target" position={Position.Left} className="!bg-blue-500" />
      )}
      
      <Handle type="source" position={Position.Right} className="!bg-blue-500" />
    </Card>
  );
}