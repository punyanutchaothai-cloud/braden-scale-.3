import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PatientInfo } from '@/hooks/use-patient-info';
import { User, ClipboardList } from 'lucide-react';
interface PatientInfoFormProps {
  patientInfo: PatientInfo;
  onUpdate: (field: keyof PatientInfo, value: string) => void;
}
export function PatientInfoForm({ patientInfo, onUpdate }: PatientInfoFormProps) {
  return (
    <Card className="border-t-4 border-t-teal-600 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden bg-white">
      <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-100">
        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-teal-600" />
          ข้อมูลผู้ป่วย
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {/* ชื่อ - สกุล */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
              ชื่อ - สกุล
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="name"
                placeholder="กรอกชื่อผู้ป่วย"
                value={patientInfo.name}
                onChange={(e) => onUpdate('name', e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200 hover:border-teal-300 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>
          </div>
          {/* HN (เลขประจำตัวผู้ป่วย) */}
          <div className="space-y-2">
            <Label htmlFor="hn" className="text-sm font-semibold text-slate-700">
              HN (เลขประจำตัวผู้ป่วย)
            </Label>
            <Input
              id="hn"
              placeholder="เช่น 123456"
              value={patientInfo.hn}
              onChange={(e) => onUpdate('hn', e.target.value)}
              className="bg-slate-50 border-slate-200 hover:border-teal-300 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
          {/* เตียง */}
          <div className="space-y-2">
            <Label htmlFor="bed" className="text-sm font-semibold text-slate-700">
              เตียง
            </Label>
            <Input
              id="bed"
              placeholder="เช่น 5/1"
              value={patientInfo.bed}
              onChange={(e) => onUpdate('bed', e.target.value)}
              className="bg-slate-50 border-slate-200 hover:border-teal-300 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
          {/* วันที่ และ เวลา */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-semibold text-slate-700">
                วันที่
              </Label>
              <Input
                id="date"
                type="date"
                value={patientInfo.date}
                onChange={(e) => onUpdate('date', e.target.value)}
                className="bg-slate-50 border-slate-200 hover:border-teal-300 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-semibold text-slate-700">
                เวลา
              </Label>
              <Input
                id="time"
                type="time"
                value={patientInfo.time}
                onChange={(e) => onUpdate('time', e.target.value)}
                className="bg-slate-50 border-slate-200 hover:border-teal-300 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}