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
          "rounded-none sm:rounded-3xl border-t sm:border-2 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-1000 ease-in-out overflow-hidden",
          isComplete ? cn(risk.bg, risk.border, "scale-[1.02]") : "bg-card/95 border-border"
        )}
      >
        <CardContent className="p-6 md:p-8 lg:p-10 backdrop-blur-3xl relative">
          {/* Mobile Background Glow */}
          {isComplete && (
            <div className={cn(
              "absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-1000",
              risk.bg
            )} />
          )}
          <div className="flex lg:flex-col items-center lg:items-stretch justify-between gap-6 relative z-10">
            <div className="flex-1 lg:w-full space-y-6">
              <div className="hidden lg:flex flex-col gap-2 p-4 bg-background/50 backdrop-blur-md rounded-2xl border border-border/50 animate-in fade-in zoom-in duration-500">
                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <User className="w-3.5 h-3.5 text-teal-600" /> PATIENT IDENTIFICATION
                </div>
                <div className="text-base font-black text-foreground truncate">
                  {patientInfo.name || '--- UNIDENTIFIED ---'}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  HN: {patientInfo.hn || '-'} | BED: {patientInfo.bed || '-'}
                </div>
                {isComplete && !isPatientValid && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-destructive font-black p-2 bg-destructive/5 rounded-lg border border-destructive/20">
                    <AlertTriangle className="w-3.5 h-3.5" /> MISSING CLINICAL IDENTIFIERS
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                    ASSESSMENT PROGRESS
                  </span>
                  <span className="text-[10px] font-black text-teal-600">
                    {answeredCount} OF 6 STEPS
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2.5 bg-muted rounded-full overflow-hidden" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-4">
                  <div 
                    className={cn(
                      "text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter transition-all duration-1000",
                      isComplete ? cn("text-foreground", risk.glow) : "text-muted-foreground/20"
                    )}
                    aria-label={`Total Score: ${isComplete ? totalScore : 'incomplete'}`}
                  >
                    {isComplete ? totalScore : "--"}
                  </div>
                  {isComplete && (
                    <div className={cn(
                      "px-5 py-2 rounded-full text-sm font-black animate-pulse border-4 shadow-xl",
                      risk.bg, risk.color, risk.border, "ring-8 ring-white/10 dark:ring-black/10"
                    )}>
                      {risk.label.toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">TOTAL BRADEN SCORE</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-auto min-w-[140px] lg:w-full">
              {isComplete ? (
                <div 
                  className={cn(
                    "hidden lg:flex items-start gap-4 p-6 rounded-3xl border-l-[12px] text-sm leading-relaxed transition-all duration-1000 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-inner",
                    risk.border, risk.color
                  )}
                  role="alert"
                >
                  <ShieldAlert className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-base mb-1">CLINICAL RECOMMENDATION</p>
                    <p className="opacity-90 font-medium">{risk.action}</p>
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3 p-6 rounded-3xl bg-muted/50 border-2 border-dashed border-border text-muted-foreground text-xs font-bold justify-center">
                  <AlertCircle className="w-5 h-5" />
                  <span>COMPLETE ALL 6 CATEGORIES</span>
                </div>
              )}
              <div className="flex lg:flex-col gap-3">
                <button
                  onClick={onCopySummary}
                  disabled={!isComplete}
                  className={cn(
                    "btn w-full rounded-2xl transition-all duration-300 text-xs font-black py-4 flex gap-2 items-center justify-center border-2",
                    isComplete
                      ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-500 shadow-2xl shadow-teal-600/40 hover:scale-[1.02]"
                      : "bg-muted text-muted-foreground border-border cursor-not-allowed"
                  )}
                >
                  <Clipboard className="w-4 h-4" />
                  <span className="hidden sm:inline">GENERATE CLINICAL SUMMARY</span>
                  <span className="sm:hidden">COPY</span>
                </button>
                <button
                  onClick={onReset}
                  className="btn bg-background hover:bg-muted text-muted-foreground w-full rounded-2xl transition-all duration-300 text-xs font-black py-4 flex gap-2 items-center justify-center border-2 border-border/50"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RESET ASSESSMENT</span>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Mobile risk gradient bottom overlay */}
      {isComplete && (
        <div className={cn(
          "h-6 lg:hidden w-full transition-colors duration-1000",
          risk.bg
        )} />
      )}
    </div>
  );
}