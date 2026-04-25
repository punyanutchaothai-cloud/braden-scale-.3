import React, { useState, useCallback } from 'react';
import { BRADEN_CATEGORIES, calculateRiskLevel } from '@/lib/braden-data';
import { SelectableCard } from '@/components/SelectableCard';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { LogicPreview } from '@/components/LogicPreview';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { usePatientInfo } from '@/hooks/use-patient-info';
import { ShieldCheck, Activity, History, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Authenticated, Unauthenticated } from 'convex/react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SignInForm } from '@/components/SignInForm';
import { SignOutButton } from '@/components/SignOutButton';
import { AssessmentHistory } from '@/components/AssessmentHistory';
export function HomePage() {
  const { patientInfo, updateField, resetPatientInfo, isPatientValid } = usePatientInfo();
  const [showLogic, setShowLogic] = useState(false);
  const [scores, setScores] = useState<Record<string, number | null>>({
    sensory: null, moisture: null, activity: null, mobility: null, nutrition: null, friction: null,
  });
  const answeredCount = Object.values(scores).filter((v) => v !== null).length;
  const isComplete = answeredCount === 6;
  const totalScore = Object.values(scores).reduce((acc: number, curr) => acc + (curr ?? 0), 0);
  const currentRisk = isComplete ? calculateRiskLevel(totalScore, parseInt(patientInfo.age)) : null;
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
    if (!isComplete || !currentRisk) return;
    const now = new Date(`${patientInfo.date}T${patientInfo.time}:00`);
    const nextTime = new Date(now.getTime() + currentRisk.nextIntervalHours * 3600000);
    const formatThaiDateTime = (date: Date, intervalText: string) => {
      const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      const day = date.getDate();
      const month = thaiMonths[date.getMonth()];
      const year = date.getFullYear() + 543;
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day} ${month} ${year} ${hours}:${minutes} ${intervalText}`;
    };
    const nextText = formatThaiDateTime(nextTime, currentRisk.nextIntervalText);
    const ageNum = parseInt(patientInfo.age || '0', 10);
    const showNext = patientInfo.age && ageNum > 5;
    let summaryText = `[BRADEN ASSESSMENT]\nDate: ${patientInfo.date} ${patientInfo.time}\nPatient: ${patientInfo.name} (${patientInfo.hn})\nHN: ${patientInfo.hn}\nAge: ${patientInfo.age} ปี\nScore: ${totalScore}/23\nRisk: ${currentRisk.label}\nDX: ${currentRisk.dx}`;
    if (showNext) {
      summaryText += `\nNext: ประเมินครั้งต่อไป ${nextText}`;
    }
    navigator.clipboard.writeText(summaryText);
    toast.success("คัดลอกสรุปเรียบร้อยแล้ว");
  }, [isComplete, patientInfo, totalScore, currentRisk]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={cn(
      "min-h-screen transition-all duration-1000 ease-out pb-64 lg:pb-24",
      isComplete ? currentRisk?.bg : "bg-slate-50 dark:bg-slate-950"
    )}>
      <div className="bg-slate-900 border-b border-slate-800 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button onClick={() => setShowLogic(!showLogic)} className="py-3 text-slate-400 hover:text-white text-[10px] font-mono font-bold tracking-wider flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            CLINICAL ENGINE v2.0
          </button>
          <div className="flex items-center gap-4">
            <Authenticated>
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-1.5 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                    <History className="w-3.5 h-3.5" /> ประวัติ
                  </button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center gap-2">
                      <History className="w-5 h-5 text-teal-600" /> ประวัติการประเมิน
                    </SheetTitle>
                  </SheetHeader>
                  <AssessmentHistory />
                </SheetContent>
              </Sheet>
              <SignOutButton />
            </Authenticated>
            <Unauthenticated>
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-1.5 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                    <LogIn className="w-3.5 h-3.5" /> เข้าสู่ระบบ
                  </button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader className="mb-6">
                    <SheetTitle>Healthcare Cloud Login</SheetTitle>
                  </SheetHeader>
                  <SignInForm />
                </SheetContent>
              </Sheet>
            </Unauthenticated>
          </div>
        </div>
        <AnimatePresence>{showLogic && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><LogicPreview /></motion.div>}</AnimatePresence>
      </div>
      <ThemeToggle />
      <header className="bg-background/60 backdrop-blur-2xl border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2.5 rounded-xl shadow-xl"><ShieldCheck className="w-6 h-6 text-primary-foreground" /></div>
            <div>
              <h1 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">Braden Scale Pro {isComplete && <Activity className={cn("w-4 h-4 animate-pulse", currentRisk?.color)} />}</h1>
              <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">Thai Medical Guideline</p>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <PatientInfoForm patientInfo={patientInfo} onUpdate={updateField} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-10">
          <div className="lg:col-span-8 space-y-12">
            {BRADEN_CATEGORIES.map((category, index) => (
              <section key={category.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background font-black text-sm">{index + 1}</span>
                  <div><h2 className="text-xl font-black text-foreground">{category.title}</h2><p className="text-[11px] text-muted-foreground font-medium">{category.description}</p></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {category.options.map((option) => (
                    <SelectableCard key={option.value} selected={scores[category.id] === option.value} onClick={() => handleSelect(category.id, option.value)} label={option.label} description={option.description} value={option.value} />
                  ))}
                </div>
              </section>
            ))}
          </div>
          <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <ScoreDisplay scores={scores} patientInfo={patientInfo} onReset={handleReset} onCopySummary={handleCopySummary} isPatientValid={isPatientValid} />
          </aside>
        </div>
      </main>
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}