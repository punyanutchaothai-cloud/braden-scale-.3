import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { calculateRiskLevel } from '@/lib/braden-data';
import { cn } from '@/lib/utils';
import { AlertCircle, RotateCcw, User, AlertTriangle, Clipboard, CheckCircle2, ScrollText, Clock, Baby } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PatientInfo } from '@/hooks/use-patient-info';
import { motion, AnimatePresence } from 'framer-motion';
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
  const risk = calculateRiskLevel(totalScore, patientInfo.age ? parseInt(patientInfo.age) : undefined);
  const completionPercentage = (answeredCount / 6) * 100;
  const nextAssessmentDisplay = useMemo(() => {
    if (!isComplete) return null;
    const baseDateStr = patientInfo.date && patientInfo.time 
      ? `${patientInfo.date}T${patientInfo.time}` 
      : new Date().toISOString();
    try {
      const baseDate = new Date(baseDateStr);
      if (isNaN(baseDate.getTime())) return "โปรดระบุวันที่และเวลาที่ถูกต้อง";
      const nextDate = new Date(baseDate.getTime() + (risk.nextIntervalHours * 3600000));
      return new Intl.DateTimeFormat('th-TH', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }).format(nextDate);
    } catch (e) {
      return "ไม่สามารถคำนวณเวลาได้";
    }
  }, [isComplete, patientInfo.date, patientInfo.time, risk.nextIntervalHours]);
  const isChild = patientInfo.age && parseInt(patientInfo.age) <= 5;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:relative lg:bottom-auto lg:z-0 lg:block p-0 sm:p-4 lg:p-0 pb-safe sm:pb-4 lg:pb-0" aria-live="polite">
      <Card className={cn(
        "rounded-none sm:rounded-3xl border-t sm:border-2 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-700 ease-in-out overflow-hidden",
        isComplete ? cn(risk.bg, risk.border, "scale-[1.01]") : "bg-card/95 border-border"
      )}>
        <CardContent className="p-5 md:p-8 backdrop-blur-3xl relative">
          {isComplete && <div className={cn("absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-1000", risk.bg)} />}
          <div className="flex flex-col gap-5 relative z-10">
            {isChild && isComplete && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center gap-3"
              >
                <Baby className="w-5 h-5 text-blue-600" />
                <span className="text-[11px] font-black text-blue-700">ไม่ประเมิน Braden ในเด็กอายุ ≤5 ปี</span>
              </motion.div>
            )}
            <div className="space-y-5">
              <div className="hidden lg:flex flex-col gap-2 p-4 bg-background/50 backdrop-blur-md rounded-2xl border border-border/50">
                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <User className="w-3.5 h-3.5 text-teal-600" /> ข้อมูลผู้ป่วย
                </div>
                <div className="text-base font-black text-foreground truncate">
                  {patientInfo.name || '--- ไม่ระบุชื่อ ---'}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  HN: {patientInfo.hn || '-'} | อายุ: {patientInfo.age || '-'} ปี
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">ความก้าวหน้า</span>
                  <span className="text-[10px] font-black text-teal-600">{answeredCount} / 6</span>
                </div>
                <Progress value={completionPercentage} className="h-2 bg-muted rounded-full" />
              </div>
              <div className="flex items-center gap-4">
                <div className={cn("text-5xl md:text-6xl font-display font-black tracking-tighter transition-all duration-1000", isComplete ? cn("text-foreground", risk.glow) : "text-muted-foreground/20")}>
                  {isComplete && !isChild ? totalScore : "--"}
                </div>
                <div className="flex flex-col">
                  {isComplete && (
                    <div className={cn("px-3 py-1 rounded-full text-[11px] font-black border-2 shadow-md uppercase mb-1 bg-white/80 dark:bg-black/40", risk.color, risk.border)}>
                      {risk.label}
                    </div>
                  )}
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">BRADEN RISK STATUS</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <AnimatePresence mode="wait">
                {isComplete ? (
                  <motion.div key="care-plan-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className={cn("p-5 rounded-2xl border-l-[6px] shadow-lg bg-white/60 dark:bg-black/60", risk.border)}>
                      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/50">
                        <ScrollText className={cn("w-5 h-5", risk.color)} />
                        <h3 className={cn("text-sm font-black uppercase", risk.color)}>Nursing Care Plan</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">
                            วินิจฉัยทางการพยาบาล:
                          </p>
                          <p className="text-sm font-black text-foreground">{risk.dx}</p>
                          <p className={cn("text-[11px] font-black mt-1 p-1 px-2 rounded bg-muted/50 inline-block", risk.color)}>
                            ความถี่ประเมิน: {risk.assess_frequency}
                          </p>
                        </div>
                        {!isChild && (
                          <div className={cn("p-3 rounded-xl border border-dashed flex flex-col gap-1.5", risk.border, "bg-muted/30")}>
                            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase">
                              <Clock className="w-3.5 h-3.5" /> วันประเมินครั้งต่อไป
                            </div>
                            <div className={cn("text-xs font-black", risk.color)}>
                              {nextAssessmentDisplay} ({risk.nextIntervalText})
                            </div>
                          </div>
                        )}
                        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Interventions:</p>
                          <ul className="space-y-2">
                            {risk.care.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-xs font-medium text-foreground/90">
                                <CheckCircle2 className={cn("w-4 h-4 mt-0.5 flex-shrink-0", risk.color)} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2 p-6 rounded-2xl bg-muted/50 border-2 border-dashed border-border text-muted-foreground text-[10px] font-bold justify-center">
                    <AlertCircle className="w-4 h-4" />
                    <span>กรุณาตอบให้ครบและระบุอายุเพื่อดูแผนการพยาบาล</span>
                  </div>
                )}
              </AnimatePresence>
              <div className="flex gap-2">
                <button onClick={onCopySummary} disabled={!isComplete} className={cn("flex-1 btn rounded-xl text-[11px] font-black py-4 flex gap-2 items-center justify-center border-2", isComplete ? "bg-teal-600 text-white border-teal-500 shadow-lg" : "bg-muted text-muted-foreground cursor-not-allowed")}>
                  <Clipboard className="w-3.5 h-3.5" /> <span>คัดลอกสรุปแผน</span>
                </button>
                <button onClick={onReset} className="px-4 bg-background hover:bg-muted text-muted-foreground rounded-xl text-[11px] font-black py-4 flex border-2 border-border/50">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}