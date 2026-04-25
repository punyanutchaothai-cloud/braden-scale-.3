import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Search, Calendar, ChevronRight, User, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
export function AssessmentHistory() {
  const history = useQuery(api.assessments.listAssessments);
  const deleteMutation = useMutation(api.assessments.deleteAssessment);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredHistory = (history ?? []).filter(item =>
    item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.patientHN.includes(searchTerm)
  );
  const handleDelete = async (id: any) => {
    try {
      await deleteMutation({ id });
      toast.success('ลบข้อมูลการประเมินเรียบร้อยแล้ว');
    } catch (e) {
      toast.error('ไม่สามารถลบข้อมูลได้ในขณะนี้');
    }
  };
  const getRiskDotColor = (label: string) => {
    if (label.includes('Severe')) return 'bg-red-500';
    if (label.includes('High')) return 'bg-orange-500';
    if (label.includes('Moderate')) return 'bg-amber-500';
    if (label.includes('Mild')) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative px-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหาตามชื่อ หรือ เลข HN..."
          className="pl-11 h-11 bg-muted/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="space-y-4 pb-10">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">ไม่พบประวัติการประเมินในระบบคลาวด์</p>
              <p className="text-muted-foreground/60 text-xs mt-1">ข้อมูลที่บันทึกจะแสดงในรายการนี้</p>
            </div>
          ) : (
            filteredHistory.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                layout
              >
                <Card className="hover:shadow-md transition-all group overflow-hidden border-l-4 border-l-teal-500 bg-card/50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-teal-600" />
                        <span className="font-bold text-sm truncate text-foreground">{item.patientName}</span>
                        <div className={cn("w-2 h-2 rounded-full", getRiskDotColor(item.riskLevel))} />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground font-mono">
                        <span className="bg-muted px-1.5 py-0.5 rounded">HN: {item.patientHN}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {item.assessmentDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.assessmentTime} น.
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400">
                          SCORE: {item.totalScore}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[120px]">
                          {item.riskLevel.split('(')[0]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive lg:opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-teal-500 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}