import React, { useState } from 'react';
import { Copy, Check, Code2, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
export function LogicPreview() {
  const [copied, setCopied] = useState(false);
  const codeSnippet = `/**
 * Braden Scale Risk Calculation Logic
 * Clinical Standard Assessment
 */
const calculateRiskLevel = (score: number) => {
  if (score <= 9)  return "Severe Risk (เสี่ยงสูงมาก)";
  if (score <= 12) return "High Risk (เสี่ยงสูง)";
  if (score <= 14) return "Moderate Risk (เสี่ยงปานกลาง)";
  if (score <= 18) return "Mild Risk (เสี่ยงต่ำ)";
  return "No Risk (ไม่มีความเสี่ยง)";
};
// Total Score = Sum of 6 categories (6-23)
const total = sensory + moisture + activity + 
              mobility + nutrition + friction;`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      toast.success("คัดลอกโค้ดอัลกอริทึมเรียบร้อยแล้ว");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("ไม่สามารถคัดลอกข้อมูลได้");
    }
  };
  return (
    <div className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 px-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="h-4 w-px bg-slate-700 mx-2 hidden sm:block" />
            <div className="flex items-center gap-2 text-slate-400 font-mono text-sm">
              <Terminal className="w-4 h-4" />
              <span>braden-logic.ts</span>
              <span className="ml-2 text-slate-600 text-xs hidden sm:inline-block">
                — โปร่งใสและตรวจสอบได้ (Clinical Transparency)
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-slate-400 hover:text-white hover:bg-slate-800 self-start md:self-center"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? "คัดลอกแล้ว" : "คัดลอกโลจิก"}
          </Button>
        </div>
        <ScrollArea className="w-full rounded-lg border border-slate-800 bg-slate-950/50">
          <pre className="p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
            <code className="text-slate-300">
              <span className="text-slate-500 italic">{"// Clinical Logic Definition"}</span>{"\n"}
              <span className="text-sky-400">const</span> <span className="text-emerald-400">calculateRiskLevel</span> = (<span className="text-orange-300">score</span>: <span className="text-yellow-400">number</span>) =&gt; {"{"}{"\n"}
              {"  "}<span className="text-sky-400">if</span> (score &lt;= <span className="text-purple-400">9</span>)  <span className="text-sky-400">return</span> <span className="text-amber-300">"Severe Risk (เสี่ยงสูงมาก)"</span>;{"\n"}
              {"  "}<span className="text-sky-400">if</span> (score &lt;= <span className="text-purple-400">12</span>) <span className="text-sky-400">return</span> <span className="text-amber-300">"High Risk (เสี่ยงสูง)"</span>;{"\n"}
              {"  "}<span className="text-sky-400">if</span> (score &lt;= <span className="text-purple-400">14</span>) <span className="text-sky-400">return</span> <span className="text-amber-300">"Moderate Risk (เสี่ยงปานกลาง)"</span>;{"\n"}
              {"  "}<span className="text-sky-400">if</span> (score &lt;= <span className="text-purple-400">18</span>) <span className="text-sky-400">return</span> <span className="text-amber-300">"Mild Risk (เสี่ยงต่ำ)"</span>;{"\n"}
              {"  "}{"\n"}
              {"  "}<span className="text-sky-400">return</span> <span className="text-amber-300">"No Risk (ไม่มีความเสี่ยง)"</span>;{"\n"}
              {"}"};{"\n\n"}
              <span className="text-slate-500 italic">{"// Summation of 6 clinical categories"}</span>{"\n"}
              <span className="text-sky-400">const</span> <span className="text-emerald-400">totalScore</span> = categories.<span className="text-emerald-400">reduce</span>((acc, val) =&gt; acc + val, <span className="text-purple-400">0</span>);
            </code>
          </pre>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}