// FILE: src/components/SelfAttentionWorkflow.tsx
import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { MatrixNode } from '@/components/workflow/MatrixNode';
import { CalculationNode } from '@/components/workflow/CalculationNode';
import { ActivationNode } from '@/components/workflow/ActivationNode';
import { WordVectorNode } from '@/components/workflow/WordVectorNode';
import { ContextNode } from '@/components/workflow/ContextNode'; // Import the new node
import { initialNodes as rawInitialNodes, initialEdges } from '@/utils/workflowData';

const nodeTypes = {
  matrix: MatrixNode,
  calculation: CalculationNode,
  activation: ActivationNode,
  wordVector: WordVectorNode,
  context: ContextNode, // Register the new node type
};

function Word2VecWorkflowContent({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: (isDark: boolean) => void }) {
  const [completedNodeIds, setCompletedNodeIds] = useState<Set<string>>(new Set());
  
  const handleNodeComplete = useCallback((nodeId: string) => {
    setCompletedNodeIds(prev => new Set(prev).add(nodeId));
  }, []);

  const processedNodes = useMemo(() => {
    // Start with all static nodes completed
    const initialCompleted = new Set(['intro-context', 'context-cat', 'context-on', 'w1-matrix', 'w2-matrix', 'y-true']);
    const allCompleted = new Set([...initialCompleted, ...completedNodeIds]);

    return rawInitialNodes.map(node => {
      if (node.type === 'calculation' || node.type === 'activation') {
        let disabled = true;
        
        switch(node.id) {
          case 'calc-x':
            disabled = !(allCompleted.has('context-cat') && allCompleted.has('context-on'));
            break;
          case 'calc-h':
            disabled = !(allCompleted.has('calc-x') && allCompleted.has('w1-matrix'));
            break;
          case 'calc-z':
            disabled = !(allCompleted.has('calc-h') && allCompleted.has('w2-matrix'));
            break;
          case 'activate-y-pred':
            disabled = !allCompleted.has('calc-z');
            break;
          case 'calc-loss':
            disabled = !(allCompleted.has('activate-y-pred') && allCompleted.has('y-true'));
            break;
          default:
            disabled = true;
            break;
        }

        return {
          ...node,
          data: {
            ...node.data,
            onComplete: handleNodeComplete,
            disabled: disabled,
          },
        };
      }
      return { ...node, data: { ...node.data, disabled: false } }; // Ensure non-calc nodes aren't disabled
    });
  }, [completedNodeIds, handleNodeComplete]);

  const [nodes, setNodes, onNodesChange] = useNodesState(processedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const resetWorkflow = () => {
    setCompletedNodeIds(new Set());
  };
  
  useEffect(() => {
    setNodes(processedNodes);
  }, [completedNodeIds, setNodes]); // Only re-process nodes when completion state changes

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className={`h-screen w-full transition-colors duration-300 relative overflow-hidden ${
       isDark ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Header */}
      <div className={`sticky top-4 mx-4 z-50 flex items-center justify-between backdrop-blur-md shadow-lg rounded-lg p-4 transition-colors duration-300 ${
        isDark ? 'bg-slate-800/70 border-slate-700/50' : 'bg-white/80 border-slate-300/60'
      }`}>
        <div className="flex items-center gap-4">
          <img 
            src="/image.png" 
            alt="Vizuara AI Labs" 
            className="h-8"
          />
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Word2Vec from Scratch (CBOW)
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={resetWorkflow}
            variant="outline"
            size="sm"
            className={`flex items-center gap-2 transition-colors duration-150 ${
              isDark 
                ? 'text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-slate-100' 
                : 'text-slate-700 border-slate-300 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        </div>
      </div>

      {/* Main content with flow */}
      <div className="h-full pt-4">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="workflow-canvas"
        >
          <Background 
            gap={24}
            size={1.5}
            color={isDark ? '#334155' : '#cbd5e1'}
          />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export function SelfAttentionWorkflow() {
  const [isDark, setIsDark] = useState(true);

  const handleThemeToggle = (newIsDark: boolean) => {
    setIsDark(newIsDark);
  };

  return (
    <ThemeProvider isDark={isDark}>
      <Word2VecWorkflowContent isDark={isDark} onToggleTheme={handleThemeToggle} />
    </ThemeProvider>
  );
}