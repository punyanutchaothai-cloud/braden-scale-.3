import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PatientInfo } from '@/hooks/use-patient-info';
import { User, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
interface PatientInfoFormProps {
  patientInfo: PatientInfo;
  onUpdate: (field: keyof PatientInfo, value: string) => void;
}
export function PatientInfoForm({ patientInfo, onUpdate }: PatientInfoFormProps) {
  const inputBaseClasses = "h-11 bg-muted/50 border-input hover:border-teal-300 dark:hover:border-teal-800 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-background transition-all";
  return (
    <Card className="border-t-4 border-t-teal-600 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden bg-card">
      <CardHeader className="pb-4 bg-muted/20 border-b">
        <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-teal-600" />
          ข้อมูลผู้ป่วย (Patient Identification)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              ชื่อ-นามสกุล ผู้ป่วย
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="ระบุชื่อจริงและนามสกุล"
                value={patientInfo.name}
                onChange={(e) => onUpdate('name', e.target.value)}
                className={cn(inputBaseClasses, "pl-10")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hn" className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              เลขที่โรงพยาบาล (HN)
            </Label>
            <Input
              id="hn"
              placeholder="เช่น 123456"
              value={patientInfo.hn}
              onChange={(e) => onUpdate('hn', e.target.value)}
              className={inputBaseClasses}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bed" className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              หอผู้ป่วย / เตียง
            </Label>
            <Input
              id="bed"
              placeholder="เช่น อายุรกรรมชาย / เตียง 05"
              value={patientInfo.bed}
              onChange={(e) => onUpdate('bed', e.target.value)}
              className={inputBaseClasses}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                วันที่ประเมิน
              </Label>
              <Input
                id="date"
                type="date"
                value={patientInfo.date}
                onChange={(e) => onUpdate('date', e.target.value)}
                className={cn(inputBaseClasses, "cursor-pointer")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                เวลา
              </Label>
              <Input
                id="time"
                type="time"
                value={patientInfo.time}
                onChange={(e) => onUpdate('time', e.target.value)}
                className={cn(inputBaseClasses, "cursor-pointer")}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}