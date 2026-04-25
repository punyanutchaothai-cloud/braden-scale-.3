import React, { useState } from 'react';
import { BRADEN_CATEGORIES } from '@/lib/braden-data';
import { SelectableCard } from '@/components/SelectableCard';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster, toast } from 'sonner';
import { ShieldCheck, Info } from 'lucide-react';
export function HomePage() {
  const [scores, setScores] = useState<Record<string, number | null>>({
    sensory: null,
    moisture: null,
    activity: null,
    mobility: null,
    nutrition: null,
    friction: null,
  });
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
    toast.info("ล้างข้อมูลการประเมินเรียบร้อยแล้ว");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className="min-h-screen bg-slate-50/50 pb-40 lg:pb-12">
      <ThemeToggle />
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm transition-shadow duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-teal-600 p-2 rounded-xl shadow-lg shadow-teal-600/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-slate-900 tracking-tight">Braden Scale Pro</h1>
                <p className="hidden sm:block text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                  การประเมินความเสี่ยงแผลกดทับ
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-full">
              <Info className="w-4 h-4 text-teal-600" />
              <span>เครื่องมือทางคลินิกมาตรฐาน</span>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-16">
            {BRADEN_CATEGORIES.map((category, index) => (
              <section 
                key={category.id} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" 
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900 text-white font-bold text-base shadow-lg shadow-slate-900/20">
                      {index + 1}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 leading-tight">
                      {category.title}
                    </h2>
                  </div>
                  <p className="text-slate-500 ml-14 text-lg leading-relaxed max-w-2xl">
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
          {/* Sticky Sidebar Container */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 transition-all duration-300">
            <ScoreDisplay scores={scores} onReset={handleReset} />
          </aside>
        </div>
      </main>
      <footer className="hidden lg:block border-t border-slate-200 mt-20 py-12 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm leading-relaxed max-w-lg mx-auto">
            © {new Date().getFullYear()} Braden Scale Pro. ออกแบบมาเพื่อบุคลากรทางการแพทย์ 
            ข้อมูลนี้ใช้ประกอบการตัดสินใจทางคลินิกเท่านั้น
          </p>
        </div>
      </footer>
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}