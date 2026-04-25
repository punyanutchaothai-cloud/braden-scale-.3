import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
interface SelectableCardProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  description: string;
  value: number;
}
export function SelectableCard({ selected, onClick, label, description, value }: SelectableCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative flex flex-col p-4 cursor-pointer transition-all duration-200 border-2 group",
        selected 
          ? "border-teal-600 bg-teal-50/50 ring-1 ring-teal-600/20 shadow-md" 
          : "border-transparent bg-white hover:border-teal-200 hover:bg-slate-50/80 shadow-sm"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={cn(
          "text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded",
          selected ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-teal-700"
        )}>
          Score: {value}
        </span>
        {selected && (
          <CheckCircle2 className="w-5 h-5 text-teal-600 animate-in fade-in zoom-in duration-300" />
        )}
      </div>
      <h4 className={cn(
        "font-semibold text-base mb-1",
        selected ? "text-teal-900" : "text-foreground"
      )}>
        {label}
      </h4>
      <p className={cn(
        "text-sm leading-relaxed",
        selected ? "text-teal-800/80" : "text-muted-foreground"
      )}>
        {description}
      </p>
    </Card>
  );
}