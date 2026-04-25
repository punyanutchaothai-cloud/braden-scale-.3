import React, { useState, useEffect, useCallback } from 'react';
import { BRADEN_CATEGORIES, calculateRiskLevel } from '@/lib/braden-data';
import { SelectableCard } from '@/components/SelectableCard';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { LogicPreview } from '@/components/LogicPreview';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { usePatientInfo } from '@/hooks/use-patient-info';
import { ShieldCheck, ChevronUp, ChevronDown, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
export function HomePage() {
  const { patientInfo, updateField, resetPatientInfo, isPatientValid, isAgeValid } = usePatientInfo();
  const [showLogic, setShowLogic] = useState(false);
  const [scores, setScores] = useState<Record<string, number | null>>({
    sensory: null,
    moisture: null,
    activity: null,
    mobility: null,
    nutrition: null,
    friction: null,
  });
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  const answeredCount = Object.values(scores).filter((v) => v !== null).length;
  const isComplete = answeredCount === 6;
  const totalScore = Object.values(scores).reduce((acc: number, curr) => acc + (curr ?? 0), 0);
  const currentRisk = isComplete ? calculateRiskLevel(totalScore, parseInt(patientInfo.age)) : null;
  useEffect(() => {
    if (isComplete) {
      if (!isPatientValid) {
        toast.warning("ข้อมูลผู้ป่วยไม่ครบถ้วน", {
          description: !isAgeValid ? "กรุณาระบุอายุที่ถูกต้อง (> 5 ปี)" : "กรุณาระบุชื่อและเลข HN",
          id: "validation-warning",
        });
      } else {
        toast.success("การประเมินเสร็จสมบูรณ์", {
          description: `สถานะ: ${currentRisk?.label}`,
          id: "assessment-complete",
          duration: 3000,
        });
      }
    }
  }, [isComplete, isPatientValid, isAgeValid, currentRisk?.label]);
  const handleSelect = (categoryId: string, value: number) => {
    setScores(prev => ({ ...prev, [categoryId]: value }));
  };
  const handleReset = () => {
    setScores({ sensory: null, moisture: null, activity: null, mobility: null, nutrition: null, friction: null });
    resetPatientInfo();
    toast.info("ล้างข้อมูลเรียบร้อยแล้ว");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCopySummary = useCallback(() => {
    if (!isComplete) {
      toast.error("การประเมินยังไม่สมบูรณ์");
      return;
    }
    const ageNum = parseInt(patientInfo.age);
    const risk = calculateRiskLevel(totalScore, ageNum);
    let nextDateStr = 'N/A';
    try {
      if (patientInfo.date && patientInfo.time) {
        const d = new Date(`${patientInfo.date}T${patientInfo.time}`);
        if (!isNaN(d.getTime())) {
          const next = new Date(d.getTime() + risk.nextIntervalHours * 3600000);
          nextDateStr = new Intl.DateTimeFormat('th-TH', { 
            day:'numeric', month:'short', year:'numeric', hour:'numeric', minute:'2-digit' 
          }).format(next);
        }
      }
    } catch (e) {
      console.error(e);
    }
    let summaryText = `[สรุปผล BRADEN SCORE + แผนการพยาบาล]\n`;
    summaryText += `วันที่ประเมิน: ${patientInfo.date} ${patientInfo.time}\n`;
    summaryText += `ชื่อ-สกุล: ${patientInfo.name || 'N/A'} | HN: ${patientInfo.hn || 'N/A'} | อายุ: ${patientInfo.age || 'N/A'} ปี\n`;
    summaryText += `--------------------------------------------\n`;
    if (ageNum > 5 || isNaN(ageNum)) {
      BRADEN_CATEGORIES.forEach(cat => {
        const val = scores[cat.id];
        summaryText += `${cat.title}: ${val}\n`;
      });
      summaryText += `--------------------------------------------\n`;
      summaryText += `คะแนน Braden รวม: ${totalScore}/23\n`;
    }
    summaryText += `ระดับความเสี่ยง: ${risk.label}\n`;
    summaryText += `ความถี่การประเมิน: ${risk.assess_frequency}\n`;
    summaryText += `ข้อวินิจฉัยทางการพยาบาล: ${risk.dx}\n`;
    summaryText += `🕒 ติดตามประเมินครั้งต่อไป: ${nextDateStr} (${risk.nextIntervalText})\n\n`;
    summaryText += `แผนการพยาบาล (Interventions):\n`;
    risk.care.forEach((item, idx) => summaryText += `${idx + 1}. ${item}\n`);
    summaryText += `--------------------------------------------\n`;
    summaryText += `บันทึกผ่าน Braden Scale Pro DSS`;
    navigator.clipboard.writeText(summaryText).then(() => {
      toast.success("คัดลอกแผนการพยาบาลลงคลิปบอร์ดแล้ว");
    }).catch(() => {
      toast.error("ไม่สามารถคัดลอกได้");
    });
  }, [scores, isComplete, patientInfo, totalScore]);
  return (
    <div className={cn(
      "min-h-screen transition-all duration-1000 ease-out pb-64 lg:pb-24", 
      isComplete ? currentRisk?.bg : "bg-slate-50 dark:bg-slate-950"
    )}>
      <div className="bg-slate-900 border-b border-slate-800 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => setShowLogic(!showLogic)} 
            className="flex items-center justify-between w-full py-3 text-slate-400 hover:text-white text-[10px] font-mono font-bold tracking-wider"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              THAI CLINICAL DECISION ENGINE v2.0
            </div>
            <div className="flex items-center gap-2">
              {showLogic ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>{showLogic ? 'ปิดส่วนประมวลผล' : 'ตรวจสอบอัลกอริทึม'}</span>
            </div>
          </button>
        </div>
        <AnimatePresence>
          {showLogic && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }} 
              className="overflow-hidden"
            >
              <LogicPreview />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ThemeToggle />
      <header className="bg-background/60 backdrop-blur-2xl border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2.5 rounded-xl shadow-xl">
                <ShieldCheck className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                  Braden Scale Pro
                  {isComplete && <Activity className={cn("w-4 h-4 animate-pulse", currentRisk?.color)} />}
                </h1>
                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">Thai Medical Guideline</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-10">
          <PatientInfoForm patientInfo={patientInfo} onUpdate={updateField} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-8 space-y-12">
            {BRADEN_CATEGORIES.map((category, index) => (
              <section 
                key={category.id} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background font-black text-sm">{index + 1}</span>
                  <div>
                    <h2 className="text-xl font-black text-foreground">{category.title}</h2>
                    <p className="text-[11px] text-muted-foreground font-medium">{category.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {category.options.map((option) => (
                    <SelectableCard 
                      key={option.value} 
                      selected={scores[category.id] === option.value} 
                      onClick={() => handleSelect(category.id, option.value)} 
                      label={option.label} 
                      description={option.description} 
                      value={option.value} 
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
          <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <ScoreDisplay 
              scores={scores} 
              patientInfo={patientInfo} 
              onReset={handleReset} 
              onCopySummary={handleCopySummary} 
              isPatientValid={isPatientValid} 
            />
          </aside>
        </div>
      </main>
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}