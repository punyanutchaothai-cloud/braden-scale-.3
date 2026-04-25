import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { calculateRiskLevel } from '@/lib/braden-data';
import { cn } from '@/lib/utils';
import { AlertCircle, RotateCcw, User, Clipboard, CheckCircle2, ScrollText, Clock, Baby, ChevronUp, ChevronDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PatientInfo } from '@/hooks/use-patient-info';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
interface ScoreDisplayProps {
  scores: Record<string, number | null>;
  patientInfo: PatientInfo;
  onReset: () => void;
  onCopySummary: () => void;
  isPatientValid: boolean;
}
export function ScoreDisplay({ scores, patientInfo, onReset, onCopySummary, isPatientValid }: ScoreDisplayProps) {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(true);
  // Auto-collapse on mobile initially to prevent blocking the screen
  useEffect(() => {
    if (isMobile) setIsExpanded(false);
    else setIsExpanded(true);
  }, [isMobile]);
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
      if (isNaN(baseDate.getTime())) return "โปรดระบุวันที่ที่ถูกต้อง";
      const nextDate = new Date(baseDate.getTime() + (risk.nextIntervalHours * 3600000));
      return new Intl.DateTimeFormat('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }).format(nextDate);
    } catch (e) {
      console.warn("Date calculation failed", e);
      return "ไม่สามารถคำนวณเวลาได้";
    }
  }, [isComplete, patientInfo.date, patientInfo.time, risk.nextIntervalHours]);
  const isChild = patientInfo.age && parseInt(patientInfo.age) <= 5;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:relative lg:bottom-auto lg:z-0 lg:block p-0 sm:p-4 lg:p-0 pb-safe sm:pb-4 lg:pb-0" aria-live="polite">
      <Card className={cn(
        "rounded-none sm:rounded-3xl border-t sm:border-2 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-500 ease-in-out overflow-hidden",
        isComplete ? cn(risk.bg, risk.border, "scale-[1.01]") : "bg-card/95 border-border"
      )}>
        {isMobile && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full h-8 flex items-center justify-center border-b border-border/10 hover:bg-muted/20 transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronUp className="w-5 h-5 text-muted-foreground" />}
          </button>
        )}
        <CardContent className="p-4 md:p-8 backdrop-blur-3xl relative">
          {isComplete && <div className={cn("absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-1000", risk.bg)} />}
          <div className="flex flex-col gap-4 relative z-10">
            {/* Header: Score and Status */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={cn("text-4xl md:text-6xl font-display font-black tracking-tighter transition-all duration-1000", isComplete && !isChild ? cn("text-foreground", risk.glow) : "text-muted-foreground/20")}>
                  {isComplete && !isChild ? totalScore : "--"}
                </div>
                <div className="flex flex-col">
                  {isComplete && (
                    <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-black border shadow-sm uppercase mb-1 bg-white/80 dark:bg-black/40", risk.color, risk.border)}>
                      {risk.label}
                    </div>
                  )}
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">BRADEN STATUS</p>
                </div>
              </div>
              {!isExpanded && isMobile && (
                <div className="flex flex-col items-end">
                  <div className="text-[10px] font-black text-teal-600 uppercase">Progress: {answeredCount}/6</div>
                  <Progress value={completionPercentage} className="h-1.5 w-20 bg-muted rounded-full mt-1" />
                </div>
              )}
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={isMobile ? { height: 0, opacity: 0 } : false}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  {isChild && isComplete && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center gap-3">
                      <Baby className="w-5 h-5 text-blue-600" />
                      <span className="text-[10px] font-black text-blue-700">กุมารเวชกรรม: อายุ ≤5 ปี ไม่อยู่ในเกณฑ์ประเมิน Braden</span>
                    </div>
                  )}
                  <div className="hidden lg:flex flex-col gap-1.5 p-3 bg-background/50 backdrop-blur-md rounded-xl border border-border/50">
                    <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                      <User className="w-3 h-3 text-teal-600" /> ข้อมูลผู้ป่วย
                    </div>
                    <div className="text-sm font-black text-foreground truncate">
                      {patientInfo.name || '--- ไม่ระบุชื่อ ---'}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      HN: {patientInfo.hn || '-'} | อายุ: {patientInfo.age || '-'} ปี
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Progress</span>
                      <span className="text-[9px] font-black text-teal-600">{answeredCount} / 6</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2 bg-muted rounded-full" />
                  </div>
                  {isComplete ? (
                    <div className={cn("p-4 rounded-xl border-l-[4px] shadow-md bg-white/60 dark:bg-black/60", risk.border)}>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
                        <ScrollText className={cn("w-4 h-4", risk.color)} />
                        <h3 className={cn("text-xs font-black uppercase", risk.color)}>Nursing Care Plan</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[9px] font-black text-muted-foreground uppercase mb-0.5">วินิจฉัยทางการพยาบาล:</p>
                          <p className="text-xs font-black text-foreground">{risk.dx}</p>
                          <p className={cn("text-[10px] font-black mt-1 p-0.5 px-1.5 rounded bg-muted/50 inline-block", risk.color)}>
                            ประเมิน: {risk.assess_frequency}
                          </p>
                        </div>
                        {!isChild && (
                          <div className={cn("p-2 rounded-lg border border-dashed flex flex-col gap-1", risk.border, "bg-muted/30")}>
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground uppercase">
                              <Clock className="w-3 h-3" /> ประเมินครั้งต่อไป
                            </div>
                            <div className={cn("text-[11px] font-black", risk.color)}>
                              {nextAssessmentDisplay} ({risk.nextIntervalText})
                            </div>
                          </div>
                        )}
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                          <p className="text-[9px] font-black text-muted-foreground uppercase">แผนการดูแล:</p>
                          <ul className="space-y-1.5">
                            {risk.care.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-[11px] font-medium text-foreground/90 leading-tight">
                                <CheckCircle2 className={cn("w-3.5 h-3.5 mt-0.5 flex-shrink-0", risk.color)} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-4 rounded-xl bg-muted/50 border-2 border-dashed border-border text-muted-foreground text-[9px] font-bold justify-center">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>กรุณาตอบคำถามให้ครบถ้วน</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {/* Sticky/Fixed Actions */}
            <div className="flex gap-2">
              <button 
                onClick={onCopySummary} 
                disabled={!isComplete} 
                className={cn(
                  "flex-1 btn rounded-lg text-[10px] font-black py-3 flex gap-2 items-center justify-center border-2 transition-all", 
                  isComplete ? "bg-teal-600 text-white border-teal-500 shadow-md hover:bg-teal-700" : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Clipboard className="w-3.5 h-3.5" /> <span>{isMobile && !isExpanded ? "" : "คัดลอกสรุป"}</span>
              </button>
              <button 
                onClick={onReset} 
                className="px-4 bg-background hover:bg-muted text-muted-foreground rounded-lg text-[10px] font-black py-3 border-2 border-border/50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}