import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PatientInfo } from '@/hooks/use-patient-info';
import { User, Hash, Bed, Calendar, Clock } from 'lucide-react';
interface PatientInfoFormProps {
  patientInfo: PatientInfo;
  onUpdate: (field: keyof PatientInfo, value: string) => void;
}
export function PatientInfoForm({ patientInfo, onUpdate }: PatientInfoFormProps) {
  return (
    <Card className="border-t-4 border-t-teal-600 shadow-md animate-in fade-in slide-up duration-500">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          ข้อมูลผู้ป่วย
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-600 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" /> ชื่อ - สกุล
            </Label>
            <Input
              id="name"
              placeholder="กรอกชื่อผู้ป่วย"
              value={patientInfo.name}
              onChange={(e) => onUpdate('name', e.target.value)}
              className="bg-secondary/50 border-input hover:border-teal-200 focus:ring-teal-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hn" className="text-slate-600 flex items-center gap-2">
              <Hash className="w-4 h-4 text-teal-600" /> HN (เลขประจำตัวผู้ป่วย)
            </Label>
            <Input
              id="hn"
              placeholder="เช่น 123456"
              value={patientInfo.hn}
              onChange={(e) => onUpdate('hn', e.target.value)}
              className="bg-secondary/50 border-input hover:border-teal-200 focus:ring-teal-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bed" className="text-slate-600 flex items-center gap-2">
              <Bed className="w-4 h-4 text-teal-600" /> เตียง
            </Label>
            <Input
              id="bed"
              placeholder="เช่น 5/1"
              value={patientInfo.bed}
              onChange={(e) => onUpdate('bed', e.target.value)}
              className="bg-secondary/50 border-input hover:border-teal-200 focus:ring-teal-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-slate-600 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" /> วันที่
              </Label>
              <Input
                id="date"
                type="date"
                value={patientInfo.date}
                onChange={(e) => onUpdate('date', e.target.value)}
                className="bg-secondary/50 border-input hover:border-teal-200 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" /> เวลา
              </Label>
              <Input
                id="time"
                type="time"
                value={patientInfo.time}
                onChange={(e) => onUpdate('time', e.target.value)}
                className="bg-secondary/50 border-input hover:border-teal-200 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}