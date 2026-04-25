import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
export function LogicPreview() {
  const [copied, setCopied] = useState(false);
  const codeSnippet = `/**
 * Braden Scale Risk Algorithm v2.2 (Adult Standard)
 * Logic for Patient Age > 5
 */
const calculateRisk = (score: number, age: number) => {
  if (age <= 5) return { label: "ไม่ประเมิน (Pediatric Exclusion)", nextHours: 24 };
  if (score >= 19) return { 
    label: "ไม่เสี่ยง (No Risk)", 
    freq: "สัปดาห์ละครั้ง", nextHours: 168 
  };
  // All other risk levels: Every Shift (8 hours)
  if (score >= 16) return { label: "เสี่ยงต่ำ", freq: "ทุกวันทุกเวร", nextHours: 8 };
  if (score >= 13) return { label: "เสี่ยงปานกลาง", freq: "ทุกวันทุกเวร", nextHours: 8 };
  if (score >= 10) return { label: "เสี่ยงสูง", freq: "ทุกวันทุกเวร", nextHours: 8 };
  return { label: "เสี่ยงสูงที่สุด", freq: "ทุกวันทุกเวร", nextHours: 8 };
};`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      toast.success("คัดลอกอัลกอริทึมเรียบร้อยแล้ว");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("ไม่สามารถคัดลอกข้อมูลได้");
    }
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 mt-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 px-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-px bg-slate-700 mx-2 hidden sm:block" />
          <div className="flex items-center gap-2 text-slate-400 font-mono text-sm">
            <Terminal className="w-4 h-4" />
            <span>braden-clinical-v2.ts</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? "คัดลอกแล้ว" : "คัดลอกโค้ด"}
        </Button>
      </div>
      <ScrollArea className="w-full rounded-xl border border-slate-800 bg-slate-950/50 shadow-inner">
        <pre className="p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
          <code className="text-slate-300">
            <span className="text-slate-500 italic">{"// Clinical Logic Alignment v2.2"}</span>{"\n"}
            <span className="text-sky-400">const</span> <span className="text-emerald-400">getRiskLevel</span> = (<span className="text-orange-300">score</span>, <span className="text-orange-300">age</span>) =&gt; {"{"}{"\n"}
            {"  "}<span className="text-sky-400">if</span> (age &lt;= <span className="text-purple-400">5</span>) <span className="text-sky-400">return</span> <span className="text-amber-300">\"Pediatric Exclusion\"</span>;{"\n\n"}
            {"  "}<span className="text-sky-400">if</span> (score &gt;= <span className="text-purple-400">19</span>) <span className="text-sky-400">return</span> {"{ label: \"ไม่เสี่ยง\", freq: \"สัปดาห์ละครั้ง\", next: 168 };"}{"\n"}
            {"  "}<span className="text-sky-400">if</span> (score &gt;= <span className="text-purple-400">16</span>) <span className="text-sky-400">return</span> {"{ label: \"เสี่ยงต่ำ\", freq: \"ทุกวันทุกเวร\", next: 8 };"}{"\n"}
            {"  "}<span className="text-sky-400">if</span> (score &gt;= <span className="text-purple-400">13</span>) <span className="text-sky-400">return</span> {"{ label: \"เสี่ยงปานกลาง\", freq: \"ทุกวันทุกเวร\", next: 8 };"}{"\n"}
            {"  "}<span className="text-sky-400">if</span> (score &gt;= <span className="text-purple-400">10</span>) <span className="text-sky-400">return</span> {"{ label: \"เสี่ยงสูง\", freq: \"ทุกวันทุกเวร\", next: 8 };"}{"\n\n"}
            {"  "}<span className="text-sky-400">return</span> {"{ label: \"เสี่ยงสูงที่สุด\", freq: \"ทุกวันทุกเวร\", next: 8 };"}{"\n"}
            {"}"};
          </code>
        </pre>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}