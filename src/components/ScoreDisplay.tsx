import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { calculateRiskLevel } from '@/lib/braden-data';
import { cn } from '@/lib/utils';
import { AlertCircle, Info, RotateCcw, ShieldAlert } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
interface ScoreDisplayProps {
  scores: Record<string, number | null>;
  onReset: () => void;
}
export function ScoreDisplay({ scores, onReset }: ScoreDisplayProps) {
  const answeredCount = Object.values(scores).filter((v) => v !== null).length;
  const isComplete = answeredCount === 6;
  const totalScore = Object.values(scores).reduce((acc: number, curr) => acc + (curr ?? 0), 0);
  const risk = calculateRiskLevel(totalScore);
  const completionPercentage = (answeredCount / 6) * 100;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:relative lg:bottom-auto lg:z-0 lg:block p-0 sm:p-4 lg:p-0">
      <Card className={cn(
        "rounded-none sm:rounded-2xl lg:rounded-3xl border-t-0 sm:border-t lg:border shadow-2xl transition-all duration-500 overflow-hidden",
        isComplete ? "ring-2 ring-teal-500 lg:ring-0" : "ring-0"
      )}>
        <CardContent className="p-5 md:p-8 bg-white/90 backdrop-blur-xl">
          <div className="flex lg:flex-col items-center lg:items-stretch justify-between gap-6">
            <div className="flex-1 lg:w-full space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    ความคืบหน้า {answeredCount}/6
                  </span>
                  <span className="text-[10px] font-bold text-teal-600">
                    {Math.round(completionPercentage)}%
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-1.5 bg-slate-100" />
              </div>
              <div className="flex items-baseline gap-4">
                <div className={cn(
                  "text-5xl md:text-6xl font-display font-black tracking-tighter transition-colors duration-500",
                  isComplete ? "text-slate-900" : "text-slate-200"
                )}>
                  {isComplete ? totalScore : "--"}
                </div>
                {isComplete && (
                  <div className={cn(
                    "px-3 py-1 rounded-full text-sm font-bold animate-in fade-in slide-in-from-left-2 duration-500",
                    risk.bg, risk.color, risk.border, "border"
                  )}>
                    {risk.label}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 w-auto lg:w-full">
              {isComplete ? (
                <div className={cn(
                  "hidden lg:flex items-start gap-3 p-4 rounded-2xl border text-sm leading-relaxed",
                  risk.bg, risk.border, risk.color
                )}>
                  <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-0.5">ผลการประเมิน: {risk.label}</p>
                    <p className="opacity-80">คะแนนรวม {totalScore} บ่งบอกถึงระดับความเสี่ยงที่ควรเฝ้าระวังตามแนวทางเวชปฏิบัติ</p>
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>โปรดประเมินให้ครบทั้ง 6 หัวข้อเพื่อสรุปผลความเสี่ยง</span>
                </div>
              )}
              <div className="flex lg:flex-col gap-2">
                <button
                  onClick={onReset}
                  className="btn bg-slate-100 hover:bg-slate-200 text-slate-600 w-full rounded-xl transition-all text-sm font-bold py-3 flex gap-2 items-center justify-center border border-transparent hover:border-slate-300"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>ล้างข้อมูล</span>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Mobile safety spacer */}
      <div className="h-6 lg:hidden bg-slate-50/50" />
    </div>
  );
}