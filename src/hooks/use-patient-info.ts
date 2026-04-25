import { useState, useEffect } from 'react';
export interface PatientInfo {
  name: string;
  hn: string;
  bed: string;
  date: string;
  time: string;
}
const STORAGE_KEY = 'braden_patient_info';
const getDefaults = (): PatientInfo => {
  const now = new Date();
  return {
    name: '',
    hn: '',
    bed: '',
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().slice(0, 5),
  };
};
export function usePatientInfo() {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse patient info", e);
      }
    }
    return getDefaults();
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patientInfo));
  }, [patientInfo]);
  const updateField = (field: keyof PatientInfo, value: string) => {
    setPatientInfo((prev) => ({ ...prev, [field]: value }));
  };
  const resetPatientInfo = () => {
    const defaults = getDefaults();
    setPatientInfo(defaults);
    localStorage.removeItem(STORAGE_KEY);
  };
  const isValid = () => {
    return patientInfo.name.trim() !== '' && patientInfo.hn.trim() !== '';
  };
  return {
    patientInfo,
    updateField,
    resetPatientInfo,
    isValid,
  };
}