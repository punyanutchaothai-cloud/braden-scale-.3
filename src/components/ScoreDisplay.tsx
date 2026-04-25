import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { calculateRiskLevel } from '@/lib/braden-data';
import { cn } from '@/lib/utils';
import { AlertCircle, RotateCcw, ShieldAlert, User, AlertTriangle, Clipboard } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PatientInfo } from '@/hooks/use-patient-info';
interface ScoreDisplayProps {
  scores: Record<string, number | null>;
  patientInfo: PatientInfo;
  onReset: () => void;
  onCopySummary: () => void;
  isPatientValid: boolean;
}
export function ScoreDisplay({ scores, patientInfo, onReset, onCopySummary, isPatientValid }: ScoreDisplayProps) {
  const answeredCount = Object.values(scores).filter((v) => v !== null).length;
  const isComplete = answeredCount === 6;
  const totalScore = Object.values(scores).reduce((acc: number, curr) => acc + (curr ?? 0), 0);
  const risk = calculateRiskLevel(totalScore);
  const completionPercentage = (answeredCount / 6) * 100;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:relative lg:bottom-auto lg:z-0 lg:block p-0 sm:p-4 lg:p-0">
      <Card className={cn(
        "rounded-none sm:rounded-2xl lg:rounded-3xl border-t sm:border shadow-2xl transition-all duration-500 overflow-hidden",
        isComplete ? "ring-2 ring-teal-500 lg:ring-0 border-teal-100" : "border-slate-100"
      )}>
        <CardContent className="p-4 md:p-6 lg:p-8 bg-white/95 backdrop-blur-xl">
          <div className="flex lg:flex-col items-center lg:items-stretch justify-between gap-4 lg:gap-6">
            <div className="flex-1 lg:w-full space-y-3 lg:space-y-4">
              <div className="hidden lg:flex flex-col gap-1 p-3 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <User className="w-3 h-3 text-teal-600" /> ข้อมูลผู้ป่วย
                </div>
                <div className="text-sm font-bold text-slate-900 truncate">
                  {patientInfo.name || '-'}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  HN: {patientInfo.hn || '-'} | เตียง: {patientInfo.bed || '-'}
                </div>
                {isComplete && !isPatientValid && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-red-500 font-bold">
                    <AlertTriangle className="w-3 h-3" /> กรุณาระบุชื่อและ HN
                  </div>
                )}
              </div>
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
              <div className="flex items-baseline gap-3 lg:gap-4">
                <div className={cn(
                  "text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tighter transition-colors duration-500",
                  isComplete ? "text-slate-900" : "text-slate-200"
                )}>
                  {isComplete ? totalScore : "--"}
                </div>
                {isComplete && (
                  <div className={cn(
                    "px-2 lg:px-3 py-1 rounded-full text-[10px] lg:text-xs font-bold animate-in fade-in slide-in-from-left-2 duration-500",
                    risk.bg, risk.color, risk.border, "border"
                  )}>
                    {risk.label}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 w-auto min-w-[120px] lg:w-full">
              {isComplete ? (
                <div className={cn(
                  "hidden lg:flex items-start gap-3 p-4 rounded-2xl border text-xs leading-relaxed",
                  risk.bg, risk.border, risk.color
                )}>
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-0.5">{risk.label}</p>
                    <p className="opacity-80 text-[11px]">{risk.action}</p>
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>โปรดประเมินให้ครบ</span>
                </div>
              )}
              <div className="flex lg:flex-col gap-2">
                <button
                  onClick={onCopySummary}
                  disabled={!isComplete}
                  className={cn(
                    "btn w-full rounded-xl transition-all text-xs font-bold py-2.5 flex gap-2 items-center justify-center border",
                    isComplete 
                      ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600 shadow-lg shadow-teal-600/20"
                      : "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                  )}
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">คัดลอกสรุป</span>
                  <span className="sm:hidden">คัดลอก</span>
                </button>
                <button
                  onClick={onReset}
                  className="btn bg-white hover:bg-slate-50 text-slate-500 w-full rounded-xl transition-all text-xs font-bold py-2.5 flex gap-2 items-center justify-center border border-slate-200 hover:border-slate-300"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ล้างข้อมูล</span>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Spacer for mobile to prevent content overlap with home indicator */}
      <div className="h-4 lg:hidden bg-white/90" />
    </div>
  );
}