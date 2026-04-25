import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { getScoreColor } from '@/lib/braden-data';
interface SelectableCardProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  description: string;
  value: number;
}
export function SelectableCard({ selected, onClick, label, description, value }: SelectableCardProps) {
  const scoreColors = getScoreColor(value);
  return (
    <Card
      onClick={onClick}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      className={cn(
        "relative flex flex-col p-5 cursor-pointer transition-all duration-300 border-2 group min-h-[150px] rounded-2xl",
        selected
          ? cn(scoreColors.border, scoreColors.bg, "ring-2 ring-offset-2 dark:ring-offset-background shadow-xl scale-[1.02] z-10")
          : cn("border-transparent bg-card shadow-sm hover:shadow-md", scoreColors.hover)
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-colors",
          selected
            ? cn(scoreColors.accent, "text-white shadow-lg")
            : "bg-muted text-muted-foreground group-hover:bg-muted/80"
        )}>
          Score: {value}
        </span>
        {selected && (
          <CheckCircle2 className={cn("w-6 h-6 animate-in fade-in zoom-in duration-500", scoreColors.text)} />
        )}
      </div>
      <h4 className={cn(
        "font-bold text-lg mb-2 leading-tight transition-colors",
        selected ? scoreColors.text : "text-foreground"
      )}>
        {label}
      </h4>
      <p className={cn(
        "text-sm leading-relaxed transition-colors",
        selected ? "text-foreground/80 font-medium" : "text-muted-foreground"
      )}>
        {description}
      </p>
    </Card>
  );
}