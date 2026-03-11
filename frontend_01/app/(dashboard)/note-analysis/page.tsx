"use client";

import React, { useState, useEffect} from 'react';

import { 
  Activity, 
  TrendingDown, 
  Lightbulb, 
  Sparkles,
  Thermometer,
  ShieldAlert,
  Clock
} from 'lucide-react';

import PatientDropdown from '@/components/risk-analysis/PatientDropdown';
import api from '@/lib/axios';
import { useAuth } from '@/hooks/use-auth';
import { message } from 'antd';


export default function NoteAnalysis() {
  const { user }:any = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedPatient, setSelectedPatient] = useState(null as any);
  const [selectedNote, setSelectedNote] = useState(null as any);
  const [patientFiles, setPatientFiles] = useState([] as any);
  const [analysisData, setAnalysisData]:any = useState(null);

  useEffect(() => {
    console.log(selectedNote);
  }, [selectedNote]);


  const fetchNoteAnalysisData = async() => {
    try {
      if(!selectedPatient || !selectedNote) return;

      const note = patientFiles.find((file:any) => file.id == selectedNote);
      const { data } = await api.post(`/analysis/note-data/${selectedPatient.id}`, {
        note : note.fileName
      });
      console.log("Fetched note analysis data:", data); 
      const { finalResults } = data;
      if(finalResults === undefined) return;
      const nonRN = finalResults.analysis_results[0].non_rn_notes;
      if(nonRN.trim() != ""){
        messageApi.warning(nonRN);
        return;
      }
      setAnalysisData(finalResults.analysis_results[0]);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchNoteAnalysisData();
  }, [selectedPatient, selectedNote]);


  const handleGenerateAI = async() => {
    try {
      if(!selectedPatient || !selectedNote){
        messageApi.warning("Please select a patient and a note");
        return;
      }
      const note = patientFiles.find((file:any) => file.id == selectedNote);
      const { data } = await api.post(`/analysis/note/${selectedNote}`, {
        patientId : selectedPatient.id,
        userId : user.id,
        note : note.fileName
      });

      console.log(data);
      const { finalResults } = data;
      const nonRN = finalResults.analysis_results[0].non_rn_notes;
      if(nonRN.trim() != ""){
        messageApi.warning(nonRN);
        return;
      }
      setAnalysisData(finalResults.analysis_results[0]);
    } catch (error) {
      console.error("Error in handleGenerateAI:", error);
    }
  }


  const handleSelectedPatient = (patient:any) => {
    console.log(`Selected Patient: `,patient);
    setSelectedPatient(patient);
    fetchPatientFiles(patient.id);
  };

  const fetchPatientFiles = async(patientId: number) => {
    try {
      const { data } = await api.post(`/file/by-patient/${patientId}`);
      console.log("Fetched file by patient:", data);
      setPatientFiles(data);
    } catch (error) {
        console.error("Error in FetchFileByPatient:", error);
    }
  };


  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      {contextHolder}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: CLINICAL CONTENT (8 Columns) --- */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Risk Justification Header */}
          <div className="bg-white border border-rose-100 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden">
            <div 
              className={"absolute top-0 right-0 px-6 py-2 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl" + (analysisData?.risk?.level == "High" ? " bg-rose-500" : analysisData?.risk?.level == "Medium" ? " bg-amber-500" : " bg-emerald-500")}
              >
              Risk Level: {analysisData?.risk?.level}
            </div>
            <h3 className="text-rose-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
              <ShieldAlert size={16} /> Risk Justification
            </h3>
            <p className="text-slate-700 leading-relaxed font-medium italic">
              {analysisData?.risk?.justification}
            </p>
          </div>

          {/* Main Clinical Summary Card */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            {/* Metadata Grid */}
            <div className="grid grid-cols-3 gap-4 pb-8 border-b border-slate-100 mb-8">
              <MetaStat label="Documented" value={analysisData?.summary?.is_documented? "Yes" : "No"}  
                success={analysisData?.summary?.is_documented} />
              <MetaStat label="Visit Date" value={analysisData?.summary?.visit_date} />
              <MetaStat label="Clinical Signature" 
                value={analysisData?.summary?.clinical_signature? "Present" : "Absent"} 
                success={analysisData?.summary?.clinical_signature} />
            </div>

            {/* Physical Assessment Section */}
            <section className="mb-10">
              <SectionHeader icon={<Thermometer size={18} />} title="Physical Assessment" color="text-indigo-600" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Vital Signs</p>
                  <div className="flex flex-wrap gap-4">
                    {
                      analysisData?.physical_assessment?.vitals.split(",").map((vital:any, index:number) => (
                        <VitalBadge key={index} label={vital.split(":")[0].trim()} value={vital.split(":")[1].trim()} />
                      ))
                    }
                  </div>
                </div>
                <div className="space-y-4">
                  <SummaryItem label="Cardiac Findings" value={analysisData?.physical_assessment?.cardiac_findings} />
                  <SummaryItem label="Skin/Wound" value={analysisData?.physical_assessment?.skin_wound_notes} />
                </div>
              </div>
            </section>

            {/* Indicators of Decline */}
            <section className="mb-10">
              <SectionHeader icon={<TrendingDown size={18} />} title="Indicators of Decline" color="text-rose-600" />
              <div className="mt-4 space-y-3">
                {analysisData?.indicators_of_decline.map((text:string, i:number) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-rose-50/30 border border-rose-100/50 text-sm font-semibold text-slate-700">
                    <span className="text-rose-400 font-black">{i + 1}.</span>
                    {text}
                  </div>
                ))}
              </div>
            </section>

            {/* Care Plan & Narrative */}
            <section>
              <SectionHeader icon={<Lightbulb size={18} />} title="Suggested Care Plan Updates" color="text-amber-600" />
              <div className="mt-4 bg-amber-50/30 rounded-3xl p-6 border border-amber-100 space-y-4">
                <p className="text-sm font-bold text-slate-700 leading-relaxed italic border-l-4 border-amber-300 pl-4">
                  "{analysisData?.suggested_care_plan_updates.join(", ")}"
                </p>
                <div className="pt-4 border-t border-amber-100/50">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Hallucination Check</p>
                  <p className="text-sm font-medium text-slate-600">
                    {analysisData?.hallucination_check}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* --- RIGHT COLUMN: AI CONTROLS (4 Columns) --- */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            
            {/* Patient & Note Selector Sidebar */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-xl">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Patient</label>
                  <PatientDropdown onSelect={handleSelectedPatient} />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select RN Note</label>
                  <div className="w-full mt-1.5 flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-400 transition-all">
                    <select 
                      onChange={(e) => setSelectedNote(e.target.value)}
                      value={selectedNote}
                      className="w-full font-bold text-slate-700 truncate mr-2 text-sm">
                      <option value="">Select Note</option>
                      {
                        patientFiles.map((note: any, i: number) => (
                          <option key={i} value={note.id}>{note.fileName}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleGenerateAI}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 group">
                  <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                  Generate AI Assistant
                </button>
              </div>
            </div>

            {/* Case Strengthening Tip */}
            <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
               <div className="absolute -bottom-4 -right-4 opacity-10">
                  <Activity size={120} />
               </div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-4">Strengthen The Case</h4>
               <p className="text-sm leading-relaxed font-medium">
                {analysisData?.strengthen_the_case}
               </p>
               <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase text-rose-300">
                  <Clock size={14} /> Documentation Gap Detected
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// --- Helper UI Components ---

function MetaStat({ label, value, success }: { label: string, value: string, success?: boolean }) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-bold ${success ? 'text-emerald-600' : 'text-slate-800'}`}>{value}</p>
    </div>
  );
}

function SectionHeader({ icon, title, color }: { icon: React.ReactNode, title: string, color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`${color} opacity-80`}>{icon}</div>
      <h4 className={`text-xs font-black uppercase tracking-widest ${color}`}>{title}</h4>
    </div>
  );
}

function VitalBadge({ label, value, alert }: { label: string, value: string, alert?: boolean }) {
  return (
    <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold ${alert ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-white border-slate-200 text-slate-600'}`}>
      <span className="opacity-50 mr-1">{label}:</span> {value}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  );
}