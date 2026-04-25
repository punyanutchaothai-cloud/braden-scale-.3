import React, { useState, useEffect, useCallback } from 'react';
import { BRADEN_CATEGORIES, calculateRiskLevel } from '@/lib/braden-data';
import { SelectableCard } from '@/components/SelectableCard';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster, toast } from 'sonner';
import { LogicPreview } from '@/components/LogicPreview';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { usePatientInfo } from '@/hooks/use-patient-info';
import { ShieldCheck, Info, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function HomePage() {
  const { patientInfo, updateField, resetPatientInfo, isPatientValid } = usePatientInfo();
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
  useEffect(() => {
    if (isComplete && !isPatientValid) {
      toast.warning("กรุณากรอกชื่อและ HN ผู้ป่วยเพื่อให้การประเมินสมบูรณ์", {
        id: "validation-warning",
      });
    }
  }, [isComplete, isPatientValid]);
  const handleSelect = (categoryId: string, value: number) => {
    setScores(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };
  const handleReset = () => {
    setScores({
      sensory: null,
      moisture: null,
      activity: null,
      mobility: null,
      nutrition: null,
      friction: null,
    });
    resetPatientInfo();
    toast.info("ล้างข้อมูลการประเมินเรียบร้อยแล้ว");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCopySummary = useCallback(() => {
    if (!isComplete) {
      toast.error("กรุณาประเมินให้ครบทั้ง 6 หัวข้อก่อนคัดลอกสรุป");
      return;
    }
    if (!isPatientValid) {
      toast.warning("ข้อมูลผู้ป่วยไม่ครบถ้วน (ชื่อ/HN) สรุปผลอาจไม่สมบูรณ์สำหรับการบันทึกทางการแพทย์");
    }
    const totalScore = Object.values(scores).reduce((acc: number, curr) => acc + (curr ?? 0), 0);
    const risk = calculateRiskLevel(totalScore);
    let summaryText = `[สรุปผลการประเมิน Braden Scale]\n`;
    summaryText += `วันที่: ${patientInfo.date} เวลา: ${patientInfo.time}\n`;
    summaryText += `ผู้ป่วย: ${patientInfo.name || 'ไม่ได้ระบุ'}\n`;
    summaryText += `HN: ${patientInfo.hn || 'ไม่ได้ระบุ'} | เตียง: ${patientInfo.bed || 'ไม่ได้ระบุ'}\n`;
    summaryText += `----------------------------\n`;
    BRADEN_CATEGORIES.forEach(cat => {
      const val = scores[cat.id];
      const opt = cat.options.find(o => o.value === val);
      summaryText += `${cat.title}: ${val} คะแนน (${opt?.label || '-'})\n`;
    });
    summaryText += `----------------------------\n`;
    summaryText += `คะแนนรวม: ${totalScore} คะแนน\n`;
    summaryText += `ระดับความเสี่ยง: ${risk.label}\n`;
    summaryText += `คำแนะนำ: ${risk.action}\n`;
    navigator.clipboard.writeText(summaryText).then(() => {
      toast.success("คัดลอกสรุปผลการประเมินไปยังคลิปบอร์ดแล้ว");
    }).catch(() => {
      toast.error("ไม่สามารถคัดลอกข้อมูลได้");
    });
  }, [scores, isComplete, patientInfo, isPatientValid]);
  return (
    <div className="min-h-screen bg-background text-foreground pb-48 lg:pb-12 transition-colors duration-300">
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => setShowLogic(!showLogic)}
            className="flex items-center justify-between w-full py-3 text-slate-400 hover:text-white transition-colors text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              CLINICAL ALGORITHM PREVIEW
            </div>
            <div className="flex items-center gap-1">
              {showLogic ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>{showLogic ? 'HIDE' : 'SHOW'} LOGIC</span>
            </div>
          </button>
        </div>
        <AnimatePresence>
          {showLogic && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <LogicPreview />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ThemeToggle />
      <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-teal-600 p-2 rounded-xl shadow-lg shadow-teal-600/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground tracking-tight">Braden Scale Pro</h1>
                <p className="hidden sm:block text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                  Medical Risk Assessment Tool
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground font-medium bg-muted px-3 py-1.5 rounded-full">
              <Info className="w-4 h-4 text-teal-600" />
              <span>Standard Clinical Instrument</span>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="mb-12">
          <PatientInfoForm
            patientInfo={patientInfo}
            onUpdate={updateField}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-8 space-y-16">
            {BRADEN_CATEGORIES.map((category, index) => (
              <section
                key={category.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/20">
                      {index + 1}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground leading-tight">
                      {category.title}
                    </h2>
                  </div>
                  <p className="text-muted-foreground ml-14 text-lg leading-relaxed max-w-2xl">
                    {category.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 ml-0 lg:ml-14">
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
          <aside className="lg:col-span-4 lg:sticky lg:top-28">
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
      <footer className="hidden lg:block border-t mt-20 py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
            © {new Date().getFullYear()} Braden Scale Pro. Designed for healthcare professionals.
            This tool is intended for clinical decision support only.
          </p>
        </div>
      </footer>
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}