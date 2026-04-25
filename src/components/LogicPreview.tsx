import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
export function LogicPreview() {
  const [copied, setCopied] = useState(false);
  const codeSnippet = `/**
 * Braden Scale Risk Calculation Logic (Thai Locale)
 * Clinical Standard Assessment System
 */
const getRiskLevel = (score: number) => {
  if (score <= 9)  return "เสี่ยงสูงมาก (Severe Risk)";
  if (score <= 12) return "เสี่ยงสูง (High Risk)";
  if (score <= 14) return "เสี่ยงปานกลาง (Moderate Risk)";
  if (score <= 18) return "เสี่ยงเล็กน้อย (Mild Risk)";
  return "ไม่มีความเสี่ยง (No Risk)";
};
// คะแนนรวม = ผลรวมของหมวดหมู่ทั้ง 6 ด้าน (ต่ำสุด: 6, สูงสุด: 23)
const totalBradenScore = sensory + moisture + activity +
                       mobility + nutrition + friction;`;
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
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="h-4 w-px bg-slate-700 mx-2 hidden sm:block" />
          <div className="flex items-center gap-2 text-slate-400 font-mono text-sm">
            <Terminal className="w-4 h-4" />
            <span>braden-risk-engine.ts</span>
            <span className="ml-2 text-slate-600 text-xs hidden sm:inline-block">
              — Clinical Decision Logic Transparency
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-slate-400 hover:text-white hover:bg-slate-800 self-start md:self-center"
        >
          {copied ? <Check className="w-4 h-4 mr-2 text-emerald-400" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? "คัดลอกโค้ดแล้ว" : "คัดลอกโค้ดอัลกอริทึม"}
        </Button>
      </div>
      <ScrollArea className="w-full rounded-lg border border-slate-800 bg-slate-950/50 shadow-inner">
        <pre className="p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto">
          <code className="text-slate-300">
            <span className="text-slate-500 italic">{"// นิยามเกณฑ์การตัดสินใจทางคลินิก (Clinical Decision Logic)"}</span>{"\n"}
            <span className="text-sky-400">const</span> <span className="text-emerald-400">getRiskLevel</span> = (<span className="text-orange-300">score</span>: <span className="text-yellow-400">number</span>) =&gt; {"{"}{"\n"}
            {"  "}<span className="text-sky-400">if</span> (score &lt;= <span className="text-purple-400">9</span>)  <span className="text-sky-400">return</span> <span className="text-amber-300">"เสี่ยงสูงมาก (Severe Risk)"</span>;{"\n"}
            {"  "}<span className="text-sky-400">if</span> (score &lt;= <span className="text-purple-400">12</span>) <span className="text-sky-400">return</span> <span className="text-amber-300">"เสี่ยงสูง (High Risk)"</span>;{"\n"}
            {"  "}<span className="text-sky-400">if</span> (score &lt;= <span className="text-purple-400">14</span>) <span className="text-sky-400">return</span> <span className="text-amber-300">"เสี่ยงปานกลาง (Moderate Risk)"</span>;{"\n"}
            {"  "}<span className="text-sky-400">if</span> (score &lt;= <span className="text-purple-400">18</span>) <span className="text-sky-400">return</span> <span className="text-amber-300">"เสี่ยงเล็กน้อย (Mild Risk)"</span>;{"\n"}
            {"  "}{"\n"}
            {"  "}<span className="text-sky-400">return</span> <span className="text-amber-300">"ไม่มีความเสี่ยง (No Risk)"</span>;{"\n"}
            {"}"};{"\n\n"}
            <span className="text-slate-500 italic">{"// ผลรวมคะแนนจากหมวดหมู่ทางคลินิกทั้ง 6 ด้าน"}</span>{"\n"}
            <span className="text-sky-400">const</span> <span className="text-emerald-400">totalBradenScore</span> = categories.<span className="text-emerald-400">reduce</span>((acc, val) =&gt; acc + val, <span className="text-purple-400">0</span>);
          </code>
        </pre>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}