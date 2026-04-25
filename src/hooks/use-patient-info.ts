import { useState, useEffect, useCallback, useMemo } from 'react';
export interface PatientInfo {
  name: string;
  hn: string;
  bed: string;
  age: string;
  date: string;
  time: string;
}
const STORAGE_KEY = 'braden_pro_patient_v1';
const getDefaults = (): PatientInfo => {
  const now = new Date();
  return {
    name: '',
    hn: '',
    bed: '',
    age: '',
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().slice(0, 5),
  };
};
export function usePatientInfo() {
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...getDefaults(), ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error("Failed to parse patient info from localStorage", e);
    }
    return getDefaults();
  });
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patientInfo));
    } catch (e) {
      console.error("Failed to save patient info to localStorage", e);
    }
  }, [patientInfo]);
  const updateField = useCallback((field: keyof PatientInfo, value: string) => {
    setPatientInfo((prev) => {
      if (prev[field] === value) return prev;
      return { ...prev, [field]: value };
    });
  }, []);
  const resetPatientInfo = useCallback(() => {
    const defaults = getDefaults();
    setPatientInfo(defaults);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to remove item from localStorage", e);
    }
  }, []);
  // Age based logic for clinical engine exclusion
  const isPediatricExclusion = useMemo(() => {
    const ageNum = parseInt(patientInfo.age);
    return !isNaN(ageNum) && ageNum <= 5;
  }, [patientInfo.age]);
  const isAgeValid = useMemo(() => {
    const ageNum = parseInt(patientInfo.age);
    return !isNaN(ageNum) && ageNum > 0;
  }, [patientInfo.age]);
  // Comprehensive record validation
  const isPatientValid = useMemo(() => {
    return (
      patientInfo.name.trim() !== '' && 
      patientInfo.hn.trim() !== '' && 
      isAgeValid
    );
  }, [patientInfo.name, patientInfo.hn, isAgeValid]);
  return {
    patientInfo,
    updateField,
    resetPatientInfo,
    isPatientValid,
    isAgeValid,
    isPediatricExclusion
  };
}