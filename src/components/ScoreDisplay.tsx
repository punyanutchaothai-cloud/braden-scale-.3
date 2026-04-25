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
    <div
      className="fixed bottom-0 left-0 right-0 z-50 lg:relative lg:bottom-auto lg:z-0 lg:block p-0 sm:p-4 lg:p-0 pb-safe sm:pb-4 lg:pb-0"
      aria-live="polite"
    >
      <Card
        className={cn(
          "rounded-none sm:rounded-3xl border-t sm:border-2 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-700 ease-in-out overflow-hidden",
          isComplete ? cn(risk.bg, risk.border, "scale-[1.02]") : "bg-card/95 border-border"
        )}
      >
        <CardContent className="p-5 md:p-8 backdrop-blur-3xl relative">
          {isComplete && (
            <div className={cn(
              "absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-1000",
              risk.bg
            )} />
          )}
          <div className="flex flex-col gap-5 relative z-10">
            <div className="space-y-5">
              <div className="hidden lg:flex flex-col gap-2 p-4 bg-background/50 backdrop-blur-md rounded-2xl border border-border/50">
                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <User className="w-3.5 h-3.5 text-teal-600" /> ข้อมูลผู้ป่วย (PATIENT ID)
                </div>
                <div className="text-base font-black text-foreground truncate">
                  {patientInfo.name || '--- ไม่ระบุชื่อ ---'}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  HN: {patientInfo.hn || '-'} | เตียง: {patientInfo.bed || '-'}
                </div>
                {isComplete && !isPatientValid && (
                  <div className="mt-2 flex items-center gap-1.5 text-[9px] text-destructive font-black p-2 bg-destructive/5 rounded-lg border border-destructive/20">
                    <AlertTriangle className="w-3 h-3" /> ข้อมูลทางคลินิกไม่ครบถ้วน
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    ความก้าวหน้าการประเมิน
                  </span>
                  <span className="text-[10px] font-black text-teal-600">
                    {answeredCount} จาก 6 หัวข้อ
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2 bg-muted rounded-full overflow-hidden" />
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "text-5xl md:text-6xl font-display font-black tracking-tighter transition-all duration-1000",
                    isComplete ? cn("text-foreground", risk.glow) : "text-muted-foreground/20"
                  )}
                >
                  {isComplete ? totalScore : "--"}
                </div>
                <div className="flex flex-col">
                  {isComplete && (
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[11px] font-black border-2 shadow-md uppercase mb-1",
                      risk.bg, risk.color, risk.border
                    )}>
                      {risk.label}
                    </div>
                  )}
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">คะแนนรวม BRADEN SCORE</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {isComplete ? (
                <div
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-2xl border-l-[6px] text-xs leading-relaxed transition-all duration-700 bg-white/40 dark:bg-black/40 backdrop-blur-xl",
                    risk.border, risk.color
                  )}
                  role="alert"
                >
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-xs mb-0.5 uppercase tracking-wide">ข้อแนะนำทางคลินิก</p>
                    <p className="opacity-90 font-medium">{risk.action}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-4 rounded-2xl bg-muted/50 border-2 border-dashed border-border text-muted-foreground text-[10px] font-bold justify-center">
                  <AlertCircle className="w-4 h-4" />
                  <span>กรุณาตอบให้ครบทั้ง 6 หมวดหมู่</span>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={onCopySummary}
                  disabled={!isComplete}
                  className={cn(
                    "flex-1 btn rounded-xl transition-all duration-300 text-[11px] font-black py-3.5 flex gap-2 items-center justify-center border-2",
                    isComplete
                      ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-500 shadow-lg hover:scale-[1.02]"
                      : "bg-muted text-muted-foreground border-border cursor-not-allowed"
                  )}
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>คัดลอกสรุปผล</span>
                </button>
                <button
                  onClick={onReset}
                  className="px-4 bg-background hover:bg-muted text-muted-foreground rounded-xl transition-all duration-300 text-[11px] font-black py-3.5 flex gap-2 items-center justify-center border-2 border-border/50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">เริ่มใหม่</span>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}