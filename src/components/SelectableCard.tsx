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
        "relative flex flex-col p-4 cursor-pointer transition-all duration-200 border-2 group min-h-[140px]",
        selected
          ? "border-teal-600 bg-teal-50/50 dark:bg-teal-950/20 ring-1 ring-teal-600/20 shadow-md"
          : "border-transparent bg-card hover:border-teal-200 dark:hover:border-teal-800 hover:bg-accent/50 shadow-sm"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
          selected 
            ? "bg-teal-600 text-white" 
            : "bg-muted text-muted-foreground group-hover:bg-teal-100 group-hover:text-teal-700 dark:group-hover:bg-teal-900 dark:group-hover:text-teal-300"
        )}>
          Score: {value}
        </span>
        {selected && (
          <CheckCircle2 className="w-5 h-5 text-teal-600 animate-in fade-in zoom-in duration-300" />
        )}
      </div>
      <h4 className={cn(
        "font-semibold text-base mb-1 leading-tight",
        selected ? "text-teal-900 dark:text-teal-100" : "text-foreground"
      )}>
        {label}
      </h4>
      <p className={cn(
        "text-sm leading-relaxed",
        selected ? "text-teal-800/80 dark:text-teal-400/80" : "text-muted-foreground"
      )}>
        {description}
      </p>
    </Card>
  );
}