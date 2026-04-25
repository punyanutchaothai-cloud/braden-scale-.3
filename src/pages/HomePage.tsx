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
import { ShieldCheck, Info, ChevronUp, ChevronDown, Activity } from 'lucide-react';
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
  const answeredCount = Object.values(scores).filter((v) => v !== null).length;
  const isComplete = answeredCount === 6;
  const totalScore = Object.values(scores).reduce((acc: number, curr) => acc + (curr ?? 0), 0);
  const currentRisk = isComplete ? calculateRiskLevel(totalScore, parseInt(patientInfo.age)) : null;
  useEffect(() => {
    if (isComplete) {
      if (!isPatientValid) {
        toast.warning("ข้อมูลผู้ป่วยไม่ครบถ้วน", {
          description: !isAgeValid ? "กรุณาระบุอายุที่ถูกต้อง (> 5 ปีสำหรับการประเมิน Braden)" : "กรุณาระบุชื่อและเลข HN",
          id: "validation-warning",
        });
      }
      toast.success("การประเมินเสร็จสมบูรณ์", {
        description: `สถานะ: ${currentRisk?.label}`,
        duration: 5000,
      });
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
    const nextDateStr = patientInfo.date && patientInfo.time 
      ? new Intl.DateTimeFormat('th-TH', { day:'numeric', month:'short', year:'numeric', hour:'numeric', minute:'2-digit' }).format(new Date(new Date(`${patientInfo.date}T${patientInfo.time}`).getTime() + risk.nextIntervalHours * 3600000))
      : 'N/A';
    let summaryText = `[สรุปผล BRADEN SCORE + แผนการพยาบาล]\n`;
    summaryText += `วันที่: ${patientInfo.date} ${patientInfo.time}\n`;
    summaryText += `ชื่อ: ${patientInfo.name || 'N/A'} | HN: ${patientInfo.hn || 'N/A'} | อายุ: ${patientInfo.age || 'N/A'} ปี\n`;
    summaryText += `--------------------------------------------\n`;
    if (ageNum > 5) {
      BRADEN_CATEGORIES.forEach(cat => {
        const val = scores[cat.id];
        summaryText += `${cat.title}: ${val}\n`;
      });
      summaryText += `--------------------------------------------\n`;
      summaryText += `คะแนนรวม: ${totalScore}/23\n`;
    }
    summaryText += `ระดับความเสี่ยง: ${risk.label}\n`;
    summaryText += `ความถี่การประเมิน: ${risk.assess_frequency}\n`;
    summaryText += `ข้อวินิจฉัย: ${risk.dx}\n`;
    summaryText += `🕒 ประเมินครั้งต่อไป: ${nextDateStr} (${risk.nextIntervalText})\n\n`;
    summaryText += `แผนการพยาบาล:\n`;
    risk.care.forEach((item, idx) => summaryText += `${idx + 1}. ${item}\n`);
    summaryText += `--------------------------------------------\n`;
    summaryText += `© Braden Scale Pro`;
    navigator.clipboard.writeText(summaryText).then(() => {
      toast.success("คัดลอกแผนการพยาบาลแล้ว");
    });
  }, [scores, isComplete, patientInfo, totalScore]);
  return (
    <div className={cn("min-h-screen transition-all duration-1000 ease-out pb-80 lg:pb-24", isComplete ? currentRisk?.bg : "bg-slate-50 dark:bg-slate-950")}>
      <div className="bg-slate-900 border-b border-slate-800 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => setShowLogic(!showLogic)} className="flex items-center justify-between w-full py-3 text-slate-400 hover:text-white text-xs font-mono font-bold">
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              Thai Medical Decision Algorithm (Revised v2)
            </div>
            <div className="flex items-center gap-2">
              {showLogic ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>{showLogic ? 'ปิดส่วนอัลกอริทึม' : 'ตรวจสอบอัลกอริทึม'}</span>
            </div>
          </button>
        </div>
        <AnimatePresence>{showLogic && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><LogicPreview /></motion.div>}</AnimatePresence>
      </div>
      <ThemeToggle />
      <header className="bg-background/60 backdrop-blur-2xl border-b sticky top-0 z-40 shadow-sm transition-all duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary p-3 rounded-2xl shadow-2xl shadow-primary/30">
                <ShieldCheck className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                  Braden Scale Pro
                  {isComplete && <Activity className={cn("w-5 h-5 animate-bounce", currentRisk?.color)} />}
                </h1>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">Decision Support System</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="mb-12"><PatientInfoForm patientInfo={patientInfo} onUpdate={updateField} /></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-8 space-y-16">
            {BRADEN_CATEGORIES.map((category, index) => (
              <section key={category.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="mb-6 flex items-center gap-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-foreground text-background font-black text-lg">{index + 1}</span>
                  <div>
                    <h2 className="text-2xl font-black text-foreground">{category.title}</h2>
                    <p className="text-muted-foreground font-medium opacity-80">{category.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.options.map((option) => (
                    <SelectableCard key={option.value} selected={scores[category.id] === option.value} onClick={() => handleSelect(category.id, option.value)} label={option.label} description={option.description} value={option.value} />
                  ))}
                </div>
              </section>
            ))}
          </div>
          <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <ScoreDisplay scores={scores} patientInfo={patientInfo} onReset={handleReset} onCopySummary={handleCopySummary} isPatientValid={isPatientValid} />
          </aside>
        </div>
      </main>
      <Toaster position="top-center" richColors closeButton expand={true} />
    </div>
  );
}