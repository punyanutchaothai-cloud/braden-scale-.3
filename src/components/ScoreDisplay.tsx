import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { calculateRiskLevel } from '@/lib/braden-data';
import { cn } from '@/lib/utils';
import { AlertCircle, Info } from 'lucide-react';
interface ScoreDisplayProps {
  scores: Record<string, number | null>;
  onReset: () => void;
}
export function ScoreDisplay({ scores, onReset }: ScoreDisplayProps) {
  const answeredCount = Object.values(scores).filter((v) => v !== null).length;
  const isComplete = answeredCount === 6;
  const totalScore = Object.values(scores).reduce((acc: number, curr) => acc + (curr ?? 0), 0);
  const risk = calculateRiskLevel(totalScore);
  const mobileWrapperClasses = "fixed bottom-0 left-0 right-0 z-50 lg:relative lg:bottom-auto lg:z-0";
  return (
    <div className={mobileWrapperClasses}>
      <Card className={cn(
        "rounded-none lg:rounded-xl border-t-4 border-x-0 border-b-0 lg:border-t lg:border-x lg:border-b shadow-2xl lg:shadow-soft",
        isComplete ? `lg:border-t-8 border-t-teal-600` : "lg:border-t-8 border-t-slate-200"
      )}>
        <CardContent className="p-4 md:p-6 bg-white/95 backdrop-blur-md">
          <div className="flex lg:flex-col items-center lg:items-start justify-between gap-4">
            <div className="flex-1 lg:w-full">
              <div className="flex items-center gap-2 mb-1 lg:mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  ความคืบหน้าการประเมิน
                </span>
                <span className="text-xs font-bold text-teal-600">
                  {answeredCount}/6
                </span>
              </div>
              <div className="flex items-end gap-3">
                <div className="text-4xl md:text-5xl font-display font-black text-slate-900">
                  {isComplete ? totalScore : <span className="text-slate-300">--</span>}
                </div>
                {isComplete && (
                  <div className={cn("text-lg font-bold pb-1", risk.color)}>
                    {risk.label}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-auto lg:w-full">
              {isComplete ? (
                <div className={cn("hidden lg:flex items-center gap-2 p-3 rounded-lg border text-sm", risk.bg, risk.border, risk.color)}>
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>คำแนะนำสำหรับสถานะ {risk.label}</span>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>กรุณาตอบครบทั้ง 6 หัวข้อ</span>
                </div>
              )}
              <button
                onClick={onReset}
                className="btn border border-slate-200 hover:bg-slate-50 text-slate-600 lg:w-full rounded-lg transition-colors text-sm py-2"
              >
                ล้างการประเมิน
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="h-4 lg:hidden bg-white" />
    </div>
  );
}