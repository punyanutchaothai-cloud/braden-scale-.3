import React, { useState, useEffect, useCallback } from 'react';
import { BRADEN_CATEGORIES, calculateRiskLevel } from '@/lib/braden-data';
import { SelectableCard } from '@/components/SelectableCard';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster, toast } from 'sonner';
import { LogicPreview } from '@/components/LogicPreview';
import { PatientInfoForm } from '@/components/PatientInfoForm';
import { usePatientInfo } from '@/hooks/use-patient-info';
import { ShieldCheck, Info, ChevronUp, ChevronDown, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
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
  const totalScore = Object.values(scores).reduce((acc: number, curr) => acc + (curr ?? 0), 0);
  const currentRisk = isComplete ? calculateRiskLevel(totalScore) : null;
  useEffect(() => {
    if (isComplete && !isPatientValid) {
      toast.warning("Patient Data Required", {
        description: "Please enter Name and HN for full clinical documentation.",
        id: "validation-warning",
      });
    }
    if (isComplete) {
      toast.success("Assessment Complete", {
        description: `Risk Level: ${currentRisk?.label}`,
        duration: 5000,
      });
    }
  }, [isComplete, isPatientValid, currentRisk?.label]);
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
    toast.info("Assessment Cleared");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCopySummary = useCallback(() => {
    if (!isComplete) {
      toast.error("Incomplete Assessment", { description: "Answer all 6 categories first." });
      return;
    }
    const risk = calculateRiskLevel(totalScore);
    let summaryText = `[BRADEN SCALE ASSESSMENT SUMMARY]\n`;
    summaryText += `Clinical Timestamp: ${patientInfo.date} @ ${patientInfo.time}\n`;
    summaryText += `Patient: ${patientInfo.name || 'N/A'}\n`;
    summaryText += `HN: ${patientInfo.hn || 'N/A'} | Bed: ${patientInfo.bed || 'N/A'}\n`;
    summaryText += `--------------------------------------------\n`;
    BRADEN_CATEGORIES.forEach(cat => {
      const val = scores[cat.id];
      const opt = cat.options.find(o => o.value === val);
      summaryText += `${cat.title}: ${val} (${opt?.label || '-'})\n`;
    });
    summaryText += `--------------------------------------------\n`;
    summaryText += `TOTAL SCORE: ${totalScore}/23\n`;
    summaryText += `RISK LEVEL: ${risk.label}\n`;
    summaryText += `RECOMMENDED ACTION: ${risk.action}\n`;
    navigator.clipboard.writeText(summaryText).then(() => {
      toast.success("Summary Copied to Clipboard");
      console.log(`[Clinical Audit] Summary generated for ${patientInfo.hn}. Risk: ${risk.label}`);
    }).catch(() => {
      toast.error("Clipboard Error");
    });
  }, [scores, isComplete, patientInfo, totalScore]);
  return (
    <div className={cn(
      "min-h-screen transition-all duration-1500 ease-out pb-56 lg:pb-20",
      isComplete ? currentRisk?.bg : "bg-background"
    )}>
      {/* Logic Header */}
      <div className="bg-slate-900 border-b border-slate-800 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setShowLogic(!showLogic)}
            className="flex items-center justify-between w-full py-3 text-slate-400 hover:text-white transition-colors text-xs font-mono font-bold"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
              CLINICAL ALGORITHM ENGINE v1.0
            </div>
            <div className="flex items-center gap-2">
              {showLogic ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>{showLogic ? 'MINIMIZE' : 'EXPAND'} LOGIC</span>
            </div>
          </button>
        </div>
        <AnimatePresence>
          {showLogic && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'circOut' }}
              className="overflow-hidden"
            >
              <LogicPreview />
            </motion.div>
          )}
        </AnimatePresence>
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
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">
                  Diagnostic Decision Support
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3 text-xs text-muted-foreground font-black bg-muted/50 px-5 py-2.5 rounded-full border border-border/50">
              <Info className="w-4 h-4 text-primary" />
              <span>VALIDATED CLINICAL INSTRUMENT</span>
            </div>
          </div>
        </div>
      </header>
      <main 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-24"
        aria-live="assertive"
      >
        <div className="mb-16">
          <PatientInfoForm
            patientInfo={patientInfo}
            onUpdate={updateField}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          <div className="lg:col-span-8 space-y-24">
            {BRADEN_CATEGORIES.map((category, index) => (
              <section
                key={category.id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-10">
                  <div className="flex items-center gap-6 mb-4">
                    <span className="flex items-center justify-center w-12 h-12 rounded-[20px] bg-foreground text-background font-black text-xl shadow-2xl">
                      {index + 1}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                      {category.title}
                    </h2>
                  </div>
                  <p className="text-muted-foreground ml-2 text-xl font-medium leading-relaxed max-w-2xl opacity-80">
                    {category.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          <aside className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
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
      <footer className="border-t mt-32 py-20 bg-muted/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-1 px-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          <p className="text-muted-foreground text-sm font-black tracking-widest uppercase opacity-60 mb-4">
            Clinical Safety Disclaimer
          </p>
          <p className="text-muted-foreground/60 text-xs leading-relaxed max-w-2xl mx-auto font-medium">
            © {new Date().getFullYear()} Braden Scale Pro. This software is designed for professional use by trained healthcare personnel.
            All assessment results should be clinically validated and integrated into the patient's comprehensive nursing care plan.
          </p>
        </div>
      </footer>
      <Toaster position="top-center" richColors closeButton expand={true} />
    </div>
  );
}