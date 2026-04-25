import React, { useState, useMemo } from 'react';
import { BRADEN_CATEGORIES } from '@/lib/braden-data';
import { SelectableCard } from '@/components/SelectableCard';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster, toast } from 'sonner';
import { ShieldCheck, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
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
    toast.info("Assessment reset");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className="min-h-screen bg-slate-50/50 pb-32 lg:pb-0">
      <ThemeToggle />
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-teal-600 p-2 rounded-xl shadow-lg shadow-teal-600/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-slate-900">Braden Scale Pro</h1>
                <p className="hidden sm:block text-xs text-muted-foreground font-medium uppercase tracking-wider">Pressure Ulcer Risk Assessment</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 font-medium">
              <Info className="w-4 h-4" />
              <span>Evidence-based clinical tool</span>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {BRADEN_CATEGORIES.map((category, index) => (
              <section key={category.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm">
                      {index + 1}
                    </span>
                    <h2 className="text-2xl font-display font-bold text-slate-900">{category.title}</h2>
                  </div>
                  <p className="text-slate-500 ml-11">{category.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-0 lg:ml-11">
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
          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 relative">
            <ScoreDisplay scores={scores} onReset={handleReset} />
          </aside>
        </div>
      </main>
      <footer className="hidden lg:block border-t border-slate-200 mt-12 py-8 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Braden Scale Pro. Clinical use only. Developed for professional healthcare environments.</p>
        </div>
      </footer>
      <Toaster position="top-center" richColors />
    </div>
  );
}