import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { calculateRiskLevel } from '@/lib/braden-data';
import { cn } from '@/lib/utils';
import { CheckCircle2, RotateCcw, Clipboard, CloudUpload, Loader2, ChevronUp, ChevronDown, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PatientInfo } from '@/hooks/use-patient-info';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useConvexAuth } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';
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
  const [isSaving, setIsSaving] = useState(false);
  const { isAuthenticated } = useConvexAuth();
  const saveAssessment = useMutation(api.assessments.saveAssessment);
  useEffect(() => {
    if (isMobile) setIsExpanded(false);
    else setIsExpanded(true);
  }, [isMobile]);
  const answeredCount = Object.values(scores).filter((v) => v !== null).length;
  const isComplete = answeredCount === 6;
  const totalScore = Object.values(scores).reduce((acc: number, curr) => acc + (curr ?? 0), 0);
  const risk = calculateRiskLevel(totalScore, patientInfo.age ? parseInt(patientInfo.age) : undefined);
  const completionPercentage = (answeredCount / 6) * 100;
  const nextAssessmentData = useMemo(() => {
    if (!isComplete) return null;
    const baseDate = patientInfo.date && patientInfo.time 
      ? new Date(`${patientInfo.date}T${patientInfo.time}`) 
      : new Date();
    const nextDate = new Date(baseDate.getTime() + (risk.nextIntervalHours * 3600000));
    const formatter = new Intl.DateTimeFormat('th-TH', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit' 
    });
    const formatted = formatter.format(nextDate);
    // Debug for transparency
    console.log(`Braden Engine: Total Score ${totalScore}, Next Interval ${risk.nextIntervalHours}h, Date: ${formatted}`);
    return { formatted, text: risk.nextIntervalText };
  }, [isComplete, patientInfo.date, patientInfo.time, risk.nextIntervalHours, risk.nextIntervalText, totalScore]);
  const handleCloudSave = async () => {
    if (!isAuthenticated) {
      toast.error("กรุณาเข้าสู่ระบบเพื่อบันทึกข้อมูลลงคลาวด์");
      return;
    }
    if (!isPatientValid) {
      toast.error("ข้อมูลผู้ป่วยไม่ครบถ้วน");
      return;
    }
    setIsSaving(true);
    try {
      await saveAssessment({
        patientName: patientInfo.name,
        patientHN: patientInfo.hn,
        patientAge: parseInt(patientInfo.age),
        assessmentDate: patientInfo.date,
        assessmentTime: patientInfo.time,
        scores: scores as any,
        totalScore,
        riskLevel: risk.label,
        diagnosis: risk.dx,
        carePlan: risk.care,
        nextAssessment: risk.nextIntervalText,
      });
      toast.success("บันทึกข้อมูลลงคลาวด์เรียบร้อยแล้ว");
    } catch (e) {
      toast.error("ไม่สามารถบันทึกข้อมูลได้");
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };
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
          <div className="flex flex-col gap-4 relative z-10">
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
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={isMobile ? { height: 0, opacity: 0 } : false}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Progress</span>
                      <span className="text-[9px] font-black text-teal-600">{answeredCount} / 6</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2 bg-muted rounded-full" />
                  </div>
                  {isComplete && (
                    <div className={cn("p-4 rounded-xl border-l-[4px] shadow-md bg-white/60 dark:bg-black/60", risk.border)}>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[9px] font-black text-muted-foreground uppercase mb-0.5">วินิจฉัยทางการพยาบาล:</p>
                          <p className="text-xs font-black text-foreground">{risk.dx}</p>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
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
                  )}
                  {isComplete && !isChild && nextAssessmentData && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                      animate={{ opacity: 1, scale: 1, y: 0 }} 
                      className={cn(
                        "mt-4 p-6 bg-gradient-to-r from-muted/80 to-background/50 rounded-3xl border-t-4 shadow-2xl border-l-8 backdrop-blur-xl",
                        risk.border
                      )}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className={cn("w-6 h-6", risk.color)} />
                        <h4 className={cn("font-black text-lg", risk.color)}>ประเมินครั้งต่อไป</h4>
                      </div>
                      <p className="text-2xl font-display font-bold text-foreground mb-1 leading-tight">
                        {nextAssessmentData.formatted}
                      </p>
                      <p className={cn("font-bold text-sm uppercase tracking-wider", risk.color)}>
                        ({nextAssessmentData.text})
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex gap-2">
              <button
                onClick={handleCloudSave}
                disabled={!isComplete || isSaving}
                className={cn(
                  "flex-1 btn rounded-lg text-[10px] font-black py-3 flex gap-2 items-center justify-center border-2 transition-all",
                  isComplete
                    ? "bg-slate-900 text-white border-slate-800 shadow-md hover:bg-slate-800"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CloudUpload className="w-3.5 h-3.5" />}
                <span>{isMobile && !isExpanded ? "" : "บันทึกลงคลาวด์"}</span>
              </button>
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