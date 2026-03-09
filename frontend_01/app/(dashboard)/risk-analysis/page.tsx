"use client";

import React from 'react';
import { 
  Stethoscope, 
  Lightbulb, 
  AlertTriangle, 
  Activity, 
  Calendar,
  ChevronRight,
  ClipboardList,
  CheckCircle2
} from 'lucide-react';
import PatientDropdown from '@/components/risk-analysis/PatientDropdown';

export default function DenialRiskAnalysis() {

    
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      <PatientDropdown />
      {/* --- Patient Context Header --- */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
            TJ
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Perez Tinajero JD</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                <ClipboardList size={14} /> RN Initial Assessment
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                <Calendar size={14} /> Visit Date: 01/25/2023
              </span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
          <ChevronRight className="text-slate-300" />
        </button>
      </div>

      {/* --- Main Grid: Admission vs Recertification --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Admission Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <div className="h-4 w-1 bg-indigo-500 rounded-full"></div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Admission Summary</h3>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="pb-4 border-b border-slate-50">
                <p className="text-[10px] font-bold text-indigo-500 uppercase mb-1">Primary Diagnosis</p>
                <p className="text-lg font-bold text-slate-800 leading-tight">Alzheimer's disease with late onset (G30.1)</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Secondary</p>
                  <p className="text-sm font-semibold text-slate-700">Dementia</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                  <p className="text-sm font-semibold text-emerald-600">Active</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 mt-2 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Comorbidities</p>
                <div className="flex flex-wrap gap-2">
                  {["CHF", "Hypertension", "Diabetes II", "Hypokalemia", "GERD", "IBS"].map(item => (
                    <span key={item} className="text-[10px] font-bold bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Improved Clinical Findings List */}
          <div className="bg-amber-50/40 border border-amber-100 rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                <Stethoscope size={20} />
              </div>
              <h4 className="font-bold text-amber-900">Clinical Findings</h4>
            </div>
            <ul className="space-y-4">
              <FindingItem text="Generalized weakness and fatigue even at rest" />
              <FindingItem text="Patient is bedridden and has maximum dependence on ADLs" />
              <FindingItem text="Shows confusion and disorientation" />
              <FindingItem text="Frequent aspirations leading to pneumonia" />
              <FindingItem text="Significant weight loss over 6 months" />
            </ul>
          </div>
        </div>

        {/* Recertification Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <div className="h-4 w-1 bg-slate-300 rounded-full"></div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recertification Summary</h3>
          </div>

          {/* Missing Data State (Improved visually) */}
          <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center min-h-[280px] text-center">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <AlertTriangle className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-400 font-bold text-sm">Documentation Note Not Found</p>
            <p className="text-slate-400 text-xs mt-1 italic">Missing recertification assessment for audit</p>
          </div>

          {/* Recommendations Card */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-[2rem] p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                <Lightbulb size={20} />
              </div>
              <h4 className="font-bold text-emerald-900">Recommendations</h4>
            </div>
            <ul className="space-y-4">
              <RecItem text="Apply Diclofenac Sodium Gel 1% for pain management" />
              <RecItem text="Encourage dietary compliance to manage conditions" />
              <RecItem text="Monitor blood sugar and provide insulin as needed" />
              <RecItem text="Ensure patient is kept clean and dry to prevent infection" />
            </ul>
          </div>
        </div>
      </div>

      {/* --- Final LOS Risk Stratification --- */}
      <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-8 mt-12 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
          <Activity size={120} className="text-rose-900" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="text-rose-600" size={24} />
            <h3 className="text-lg font-black text-rose-900 uppercase tracking-tighter">LOS Risk Stratification</h3>
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
            <div>
              <p className="text-rose-700/70 font-bold uppercase text-[10px] tracking-widest mb-1">Current Risk Level</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-rose-600 uppercase">High Risk</span>
                <span className="text-rose-400 font-bold">— Documentation Gap</span>
              </div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm border border-rose-200 px-6 py-3 rounded-2xl">
              <p className="text-xs font-bold text-rose-900 leading-tight italic">
                "Missing recertification assessment for audit"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function FindingItem({ text }: { text: string }) {
  return (
    <li className="flex gap-3 items-start">
      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-sm" />
      <span className="text-sm font-semibold text-amber-900/80 leading-snug">{text}</span>
    </li>
  );
}

function RecItem({ text }: { text: string }) {
  return (
    <li className="flex gap-3 items-start">
      <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
      <span className="text-sm font-semibold text-emerald-900/80 leading-snug">{text}</span>
    </li>
  );
}