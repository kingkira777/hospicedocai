"use client";

import React, { useState } from 'react';
import { 
  AlertCircle, CheckCircle2, FileText, User, 
  Search, ShieldAlert, ClipboardCheck, Info 
} from 'lucide-react';
import AuditTopicsSection from '@/components/adr/AuditTopicSection';

export default function MedicalAuditDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
      {/* --- Top Navigation / Header --- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute -top-2 left-3 bg-slate-50 px-1 z-10">
              Select Patient
            </label>
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm hover:border-indigo-400 transition-colors cursor-pointer min-w-[300px]">
              <User className="text-slate-400 mr-2" size={18} />
              <span className="font-semibold">TINAJERO PEREZ (16)</span>
              <Search className="ml-auto text-slate-300" size={16} />
            </div>
            
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">ID:</span>
            <span className="font-mono font-bold text-indigo-600">16</span>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-100 transition-all uppercase tracking-tight">
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
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">TINAJERO PEREZ</h1>
              <p className="text-slate-500 font-medium">71y • Van Nuys, CA</p>
              
              <div className="mt-6 space-y-4">
                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Diagnosis</p>
                  <p className="text-indigo-900 font-bold">Alzheimer's disease with late onset</p>
                </div>
                <div className="flex items-center gap-2 px-1">
                  <span className="text-sm font-bold text-slate-400">Eligibility:</span>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-0.5 rounded-full">Yes</span>
                </div>
              </div>
            </div>

            {/* ADR Risk Score Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">ADR Risk Score</h3>
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-xs font-black uppercase">
                    <ShieldAlert size={14} />
                    High Risk
                  </div>
                </div>
                <div className="text-6xl font-black text-slate-800 tracking-tighter">75</div>
              </div>
              
              <div className="mt-6">
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '75%' }}></div>
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
              "Patient exhibits symptoms like fatigue, difficulty with ADLs, high fall risk, and dyspnea on exertion. Nutritional decline observed necessitating supplements."
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
                  score={85} 
                  rating="High" 
                  ratingColor="text-rose-600 bg-rose-50"
                  findings={[
                    "Patient's condition requires continuous hospice care due to severe Alzheimer's.",
                    "Clinical notes support patient's ongoing eligibility."
                  ]}
                />
                <CategoryRow 
                  title="Governance" 
                  score={70} 
                  rating="Medium" 
                  ratingColor="text-amber-600 bg-amber-50"
                  findings={[
                    "Documentation procedures and IDG meetings regularly documented.",
                    "Continuous offer of MSW and Volunteer services recorded."
                  ]}
                />
              </tbody>
            </table>
          </div>

          <AuditTopicsSection />
        </div>

        {/* --- Sidebar Checklist (4 Columns) --- */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden sticky top-6">
            <div className="bg-indigo-600 p-6 flex items-center gap-3">
              <ClipboardCheck className="text-white" size={24} />
              <h2 className="text-white font-black uppercase tracking-tight">Audit Checklist</h2>
            </div>
            <div className="p-6 space-y-1">
              <ChecklistItem label="Election of Benefit" checked={false} />
              <ChecklistItem label="Initial Certification" checked={true} highlight />
              <ChecklistItem label="Recertification" checked={false} />
              <ChecklistItem label="F2F Encounter" checked={false} highlight />
              <ChecklistItem label="RN Initial Assessment" checked={true} highlight />
              <ChecklistItem label="Social Worker Assessment" checked={true} />
              <ChecklistItem label="Chaplain Assessment" checked={true} />
              <ChecklistItem label="IDG Notes" checked={true} highlight />
              <ChecklistItem label="Visit Notes" checked={true} highlight />
              <ChecklistItem label="Medication List / MAR" checked={true} />
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
          {findings.map((f: string, i: number) => <li key={i}>{f}</li>)}
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