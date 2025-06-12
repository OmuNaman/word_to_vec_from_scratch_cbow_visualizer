// FILE: src/components/workflow/SemanticSpacePlot.tsx
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { semanticWords, WordVector } from '@/utils/semanticData';

interface SemanticSpacePlotProps {
  calculation: {
    wordA: string;
    op1: string;
    wordB: string;
    op2: string;
    wordC: string;
    result: { word: string; vector: WordVector };
  } | null;
}

const data = Object.entries(semanticWords).map(([name, { x, y, color }]) => ({
  name,
  x,
  y,
  fill: color,
}));

// Custom label for scatter plot points
const CustomizedLabel = (props: any) => {
    const { x, y, value } = props;
    return <text x={x} y={y} dy={-10} fill="#a1a1aa" fontSize={12} textAnchor="middle">{value}</text>;
};

export function SemanticSpacePlot({ calculation }: SemanticSpacePlotProps) {

  const getVector = (word: string) => semanticWords[word];

  const renderVectorArrow = () => {
    if (!calculation) return null;

    const vA = getVector(calculation.wordA);
    const vB = getVector(calculation.wordB);
    const vC = getVector(calculation.wordC);

    const scale = 30; // Scale factor for visualization
    const centerX = 400;
    const centerY = 200;

    const startX = centerX + vA.x * scale;
    const startY = centerY - vA.y * scale;

    const midX = startX + (calculation.op1 === '+' ? vB.x : -vB.x) * scale;
    const midY = startY - (calculation.op1 === '+' ? vB.y : -vB.y) * scale;
    
    const endX = midX + (calculation.op2 === '+' ? vC.x : -vC.x) * scale;
    const endY = midY - (calculation.op2 === '+' ? vC.y : -vC.y) * scale;

    const pathVariants = {
      hidden: { pathLength: 0, opacity: 0 },
      visible: (i: number) => ({
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay: i * 0.7, type: 'spring', duration: 1.5, bounce: 0 },
          opacity: { delay: i * 0.7, duration: 0.01 },
        },
      }),
    };

    return (
        <AnimatePresence>
            {calculation && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <motion.path
                        d={`M ${centerX} ${centerY} L ${startX} ${startY}`}
                        fill="none"
                        stroke="#fde047"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        variants={pathVariants}
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        key="path1"
                    />
                     <motion.path
                        d={`M ${startX} ${startY} L ${midX} ${midY}`}
                        fill="none"
                        stroke="#f87171"
                        strokeWidth="2"
                        variants={pathVariants}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                        key="path2"
                    />
                     <motion.path
                        d={`M ${midX} ${midY} L ${endX} ${endY}`}
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="2"
                        variants={pathVariants}
                        initial="hidden"
animate="visible"
                        custom={2}
                        key="path3"
                    />
                    <motion.circle
                        cx={endX}
                        cy={endY}
                        r="8"
                        fill="none"
                        stroke="#a78bfa"
                        strokeWidth="3"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [1, 1.5, 1], opacity: 1 }}
                        transition={{ delay: 2.8, duration: 1, repeat: Infinity }}
                        key="result-pulse"
                    />
                </svg>
            )}
        </AnimatePresence>
    )
  }

  return (
    <div className="w-full h-[400px] relative">
      <ResponsiveContainer>
        <ScatterChart
          width={800}
          height={400}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis type="number" dataKey="x" name="dimension 1" domain={[-8, 8]} axisLine={{stroke: "#475569"}} tick={{fill: "#94a3b8"}}/>
          <YAxis type="number" dataKey="y" name="dimension 2" domain={[-8, 8]} axisLine={{stroke: "#475569"}} tick={{fill: "#94a3b8"}}/>
          <ZAxis dataKey="name" name="word" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155'}} />
          <Scatter name="Words" data={data} fill="#8884d8" shape="circle" label={<CustomizedLabel />} />
        </ScatterChart>
      </ResponsiveContainer>
      {renderVectorArrow()}
    </div>
  );
}