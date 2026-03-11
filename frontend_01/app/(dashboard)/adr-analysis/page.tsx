"use client";

import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, CheckCircle2, FileText, User, 
  Search, ShieldAlert, ClipboardCheck, Info 
} from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import PatientDropdown from '@/components/risk-analysis/PatientDropdown';
import { REQUIRED_DOCUMENTS } from '@/constant/documents';
import api from '@/lib/axios';
import { message } from 'antd';


import AuditTopicsSection from '@/components/adr/AuditTopicSection';
import ADREvidenceTable from '@/components/adr/ADREvidenceTable';
import BenefitPeriodEvidence from '@/components/adr/BenefitPeriodEvidence';
import ClinicalPresenceTable from '@/components/adr/ClinicalPresenceTable';
import DisciplineNotesTable from '@/components/adr/DisciplineNotesTable';


export default function MedicalAuditDashboard() {
  const { user }:any = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedPatient, setSelectedPatient] = useState(null as any);
  const [analysisData, setAnalysisData]:any = useState({});
  const [patientFiles, setPatientFiles]:any = useState([]);
  const [requiredFiles, setRequiredFiles]:any = useState(0);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (selectedPatient) {
      fetchPatientFiles();
      fetchSavedAdrData();
    }
  }, [selectedPatient]);


  const handleSelectedPatient = (patient:any) => {
    console.log(`Selected Patient: `,patient);
    setSelectedPatient(patient);
  };

  const fetchPatientAnalysisData = async () => {
    try {
        if(!selectedPatient) {
          messageApi.warning("Please select a patient");  
          return
        };
        setLoading(true);
        const { data } = await api.post(`/analysis/adr-analyze/${selectedPatient.id}`, {
            userId: user?.id
        });
        console.log("Fetched patient analysis data:", data);
        setAnalysisData(data);
        setLoading(false);
    } catch (error) {
        console.error("Error in FetchPatientAnalysisData:", error);
    }
  };
  
  const fetchSavedAdrData = async () => {
    try {
        if(!selectedPatient) return;
        const { data } = await api.post(`/analysis/adr-data/${selectedPatient.id}`);
        console.log("Fetched saved ADR data:", data);
        if(data === null || data === 'null') return;
        setAnalysisData(data);
    } catch (error) {
        console.error("Error in FetchSavedAdrData:", error);
    }
  };

  const fetchPatientFiles = async() => {
    try {
      const { data } = await api.post(`/file/by-patient/${selectedPatient.id}`);
      console.log("Fetched file by patient:", data);
      const files = data.map((file: any) => file.category);
      const filteredFiles = files.filter((file: any) => REQUIRED_DOCUMENTS.includes(file));
      setRequiredFiles(filteredFiles.length);
      setPatientFiles(files);
    } catch (error) {
        console.error("Error in FetchFileByPatient:", error);
    }
  };




  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
      {contextHolder}
      {/* --- Top Navigation / Header --- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <PatientDropdown onSelect={handleSelectedPatient} />
          </div>
        </div>

        <button 
          // disabled={requiredFiles !== REQUIRED_DOCUMENTS.length
          disabled={loading}
          onClick={fetchPatientAnalysisData}
          className="flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-100 transition-all uppercase tracking-tight">
          <AlertCircle size={18} />
          Incomplete Required Documents
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- Main Content Area (8 Columns) --- */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Patient Overview & Risk Score Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Identity */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">{selectedPatient?.name}</h1>
              <p className="text-slate-500 font-medium">
                {selectedPatient?.gender.toUpperCase()}, {analysisData?.patient_details?.age} years old, {analysisData?.patient_details?.address}
              </p>
              
              <div className="mt-6 space-y-4">
                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Diagnosis</p>
                  <p className="text-indigo-900 font-bold">
                    {analysisData?.patient_details?.diagnosis}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-1">
                  <span className="text-sm font-bold text-slate-400">Eligibility:</span>
                  {
                    (analysisData?.patient_details?.eligibility === "Yes") ? (
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-0.5 rounded-full">Yes</span> 
                    ):
                    (
                      <span className="text-sm font-bold text-rose-600 bg-rose-50 px-3 py-0.5 rounded-full">No</span>
                    )
                  }
                </div>
              </div>
            </div>

            {/* ADR Risk Score Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">ADR Risk Score</h3>
                  <div 
                    className={"mt-2 inline-flex items-center gap-1.5 bg-rose-50  px-3 py-1 rounded-lg text-xs font-black uppercase" + (analysisData?.status === "High" ? " text-rose-600" : " text-amber-600")}
                  >
                    <ShieldAlert size={14} />
                    {analysisData?.status}
                  </div>
                </div>
                <div className="text-6xl font-black text-slate-800 tracking-tighter">
                  {analysisData?.overall_score}
                </div>
              </div>
              
              <div className="mt-6">
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    className={"h-full rounded-full" + (analysisData?.status === "High" ? " bg-rose-600" : " bg-amber-600")}
                    style={{ width: '75%' }}></div>
                </div>
                <div className="grid grid-cols-3 mt-4 text-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Medical</p>
                    <p className="text-sm font-bold text-rose-600">High</p>
                  </div>
                  <div className="border-x border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Governance</p>
                    <p className="text-sm font-bold text-amber-600">Medium</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Fraud</p>
                    <p className="text-sm font-bold text-amber-600">Medium</p>
                  </div>
                </div>
              </div>
            </div>
          </div>



          {/* Symptom Summary */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Info size={16} className="text-indigo-500" />
              Symptom Summary (ADR Lens)
            </h3>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl italic border-l-4 border-indigo-400">
              {analysisData?.symptoms_summary?.map((symptom:any) => symptom).join(", ")}
            </p>
          </div>

          {/* Symptom Summary */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Info size={16} className="text-red-500" />
              Missing Documents
            </h3>
            <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl italic border-l-4 border-red-400">
              {analysisData?.missing_documents?.map((symptom:any) => symptom).join(", ")}
            </p>
          </div>

          {/* Categories Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 uppercase text-sm tracking-widest">Analysis Categories</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase bg-white">
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Findings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <CategoryRow 
                  title="Medical Necessity" 
                  score={analysisData?.categories?.medical_necessity?.score} 
                  rating={analysisData?.categories?.medical_necessity?.rating} 
                  ratingColor={analysisData?.categories?.medical_necessity?.rating === "High" ? "text-rose-600 bg-rose-50" : "text-amber-600 bg-amber-50"}
                  findings={analysisData?.categories?.medical_necessity?.findings}
                />
                <CategoryRow 
                  title="Governance" 
                  score={analysisData?.categories?.governance?.score} 
                  rating={analysisData?.categories?.governance?.rating} 
                  ratingColor={analysisData?.categories?.governance?.rating === "High" ? "text-rose-600 bg-rose-50" : "text-amber-600 bg-amber-50"}
                  findings={analysisData?.categories?.governance?.findings}
                />
                <CategoryRow 
                  title="Fraud/Misrep" 
                  score={analysisData?.categories?.fraud_misrepresentation?.score} 
                  rating={analysisData?.categories?.fraud_misrepresentation?.rating} 
                  ratingColor={analysisData?.categories?.fraud_misrepresentation?.rating === "High" ? "text-rose-600 bg-rose-50" : "text-amber-600 bg-amber-50"}
                  findings={analysisData?.categories?.fraud_misrepresentation?.findings}
                />
              </tbody>
            </table>
          </div>


          


          <ADREvidenceTable data={analysisData?.adr_evidence_table} />
          <BenefitPeriodEvidence data={analysisData} />
          <ClinicalPresenceTable data={analysisData} />
          <DisciplineNotesTable data={analysisData} />
          <AuditTopicsSection data={analysisData?.audit_topics} />
        </div>


        {/* --- Sidebar Checklist (4 Columns) --- */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden sticky top-16">
            <div className="bg-indigo-600 p-6 flex items-center gap-3">
              <ClipboardCheck className="text-white" size={24} />
              <h2 className="text-white font-black uppercase tracking-tight">Audit Checklist</h2>
            </div>
            <div className="p-6 space-y-1">
              <ChecklistItem label="Initial Certification" checked={patientFiles?.includes('Initial Certification')} />
              <ChecklistItem label="Election of Benefit" checked={patientFiles?.includes('Election of Benefit')}  />
              <ChecklistItem label="Initial Certification" checked={patientFiles?.includes('Initial Certification')} highlight />
              <ChecklistItem label="Recertification" checked={patientFiles?.includes('Recertification')} />
              <ChecklistItem label="F2F Encounter" checked={patientFiles?.includes('F2F Encounter')} highlight />
              <ChecklistItem label="F2F Addendum" checked={patientFiles?.includes('F2F Addendum')} highlight />
              <ChecklistItem label="RN Initial Assessment" checked={patientFiles?.includes('RN Initial Assessment')} highlight />
              <ChecklistItem label="Social Worker Initial Assessment" checked={patientFiles?.includes('Social Worker Initial Assessment')} />
              <ChecklistItem label="Chaplain Initial Assessment" checked={patientFiles?.includes('Chaplain Initial Assessment')} />
              <ChecklistItem label="Physician / Referring Notes" checked={patientFiles?.includes('Physician / Referring Notes')} highlight />
              <ChecklistItem label="Plan of Care" checked={patientFiles?.includes('Plan of Care')} highlight />
              <ChecklistItem label="IDG Notes" checked={patientFiles.includes('IDG Notes')} highlight />
              <ChecklistItem label="Visit Notes" checked={patientFiles?.includes('Visit Notes')} highlight />
              <ChecklistItem label="Phone Notes" checked={patientFiles?.includes('Phone Notes')} highlight />
              <ChecklistItem label="Medication List / MAR" checked={patientFiles?.includes('Medication List / MAR')} />
              <ChecklistItem label="Labs / Imaging" checked={patientFiles?.includes('Labs / Imaging')} />
              <ChecklistItem label="Other Supporting Documents" checked={patientFiles?.includes('Other Supporting Documents')} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- Sub-Components for Cleanliness ---

function CategoryRow({ title, score, rating, ratingColor, findings }: any) {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-5 font-bold text-slate-800">{title}</td>
      <td className="px-6 py-5 font-mono font-bold text-slate-500">{score}</td>
      <td className="px-6 py-5">
        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${ratingColor}`}>
          {rating}
        </span>
      </td>
      <td className="px-6 py-5">
        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
          {findings?.map((f: string, i: number) => <li key={i}>{f}</li>)}
        </ul>
      </td>
    </tr>
  )
}

function ChecklistItem({ label, checked, highlight }: { label: string, checked: boolean, highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${checked ? 'bg-emerald-50/30' : 'hover:bg-slate-50'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${checked ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
          {checked && <CheckCircle2 size={14} className="text-white" />}
        </div>
        <span className={`text-sm font-semibold ${checked ? 'text-slate-800' : 'text-slate-400'} ${highlight && !checked ? 'text-rose-500' : ''}`}>
          {label}
        </span>
      </div>
      {checked && <CheckCircle2 size={16} className="text-emerald-500" />}
    </div>
  )
}