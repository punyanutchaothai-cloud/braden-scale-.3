import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Search, Calendar, ChevronRight, User } from 'lucide-react';
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
      toast.success('ลบข้อมูลเรียบร้อย');
    } catch (e) {
      toast.error('ไม่สามารถลบข้อมูลได้');
    }
  };
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหาชื่อหรือ HN..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="space-y-3 pb-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              ไม่พบประวัติการประเมิน
            </div>
          ) : (
            filteredHistory.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <Card className="hover:shadow-md transition-shadow group overflow-hidden border-l-4 border-l-teal-500">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-teal-600" />
                        <span className="font-bold text-sm truncate">{item.patientName}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
                        <span>HN: {item.patientHN}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {item.assessmentDate}
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400">
                          Score: {item.totalScore} | {item.riskLevel.split('(')[0]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(item._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
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