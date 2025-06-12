// FILE: src/components/workflow/VectorArithmeticControls.tsx
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Equal, Shuffle } from 'lucide-react';
import { semanticWords } from '@/utils/semanticData';

interface VectorArithmeticControlsProps {
  onCalculate: (wordA: string, op1: string, wordB: string, op2: string, wordC: string) => void;
}

const wordOptions = Object.keys(semanticWords);

export function VectorArithmeticControls({ onCalculate }: VectorArithmeticControlsProps) {
  const [wordA, setWordA] = useState('king');
  const [op1, setOp1] = useState('-');
  const [wordB, setWordB] = useState('man');
  const [op2, setOp2] = useState('+');
  const [wordC, setWordC] = useState('woman');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(wordA, op1, wordB, op2, wordC);
  };
  
  const randomize = () => {
    const examples = [
      {a: 'king', b: 'man', c: 'woman'},
      {a: 'cat', b: 'dog', c: 'pet'},
      {a: 'apple', b: 'fruit', c: 'orange'},
    ];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setWordA(randomExample.a);
    setWordB(randomExample.b);
    setWordC(randomExample.c);
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Select value={wordA} onValueChange={setWordA}>
          <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>{wordOptions.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
        </Select>

        <Select value={op1} onValueChange={setOp1}>
          <SelectTrigger className="w-[60px]"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="-">-</SelectItem><SelectItem value="+">+</SelectItem></SelectContent>
        </Select>

        <Select value={wordB} onValueChange={setWordB}>
          <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>{wordOptions.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
        </Select>

        <Select value={op2} onValueChange={setOp2}>
          <SelectTrigger className="w-[60px]"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="+">+</SelectItem><SelectItem value="-">-</SelectItem></SelectContent>
        </Select>

        <Select value={wordC} onValueChange={setWordC}>
          <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>{wordOptions.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" onClick={randomize}><Shuffle className="w-4 h-4" /></Button>
          <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700"><Equal className="w-4 h-4" /></Button>
      </div>
    </form>
  );
}