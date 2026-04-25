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
  const inputBaseClasses = "h-11 bg-muted border-input hover:border-teal-300 dark:hover:border-teal-800 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-background transition-all";
  return (
    <Card className="border-t-4 border-t-teal-600 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden bg-card">
      <CardHeader className="pb-4 bg-muted/40 border-b">
        <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-teal-600" />
          Patient Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-bold text-foreground">
              Patient Name / Surname
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Enter full name"
                value={patientInfo.name}
                onChange={(e) => onUpdate('name', e.target.value)}
                className={cn(inputBaseClasses, "pl-10")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hn" className="text-sm font-bold text-foreground">
              Hospital Number (HN)
            </Label>
            <Input
              id="hn"
              placeholder="e.g. 123456"
              value={patientInfo.hn}
              onChange={(e) => onUpdate('hn', e.target.value)}
              className={inputBaseClasses}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bed" className="text-sm font-bold text-foreground">
              Ward / Bed
            </Label>
            <Input
              id="bed"
              placeholder="e.g. Ward A / Bed 05"
              value={patientInfo.bed}
              onChange={(e) => onUpdate('bed', e.target.value)}
              className={inputBaseClasses}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-bold text-foreground">
                Assessment Date
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
              <Label htmlFor="time" className="text-sm font-bold text-foreground">
                Time
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