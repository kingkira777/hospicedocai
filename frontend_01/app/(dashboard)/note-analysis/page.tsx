"use client";

import React from 'react';
import { 
  Activity, 
  FileText, 
  Stethoscope, 
  TrendingDown, 
  Lightbulb, 
  Sparkles,
  Search,
  ChevronDown,
  Thermometer,
  ShieldAlert,
  Clock
} from 'lucide-react';

export default function NoteAnalysis() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: CLINICAL CONTENT (8 Columns) --- */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Risk Justification Header */}
          <div className="bg-white border border-rose-100 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 px-6 py-2 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
              Risk Level: High
            </div>
            <h3 className="text-rose-900 font-black uppercase text-xs tracking-widest mb-3 flex items-center gap-2">
              <ShieldAlert size={16} /> Risk Justification
            </h3>
            <p className="text-slate-700 leading-relaxed font-medium italic">
              "Documented with hemodynamic instability (BP 155/81), respiratory distress, and acute mental status changes with confusion and loss of recognition."
            </p>
          </div>

          {/* Main Clinical Summary Card */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            {/* Metadata Grid */}
            <div className="grid grid-cols-3 gap-4 pb-8 border-b border-slate-100 mb-8">
              <MetaStat label="Documented" value="Yes" success />
              <MetaStat label="Visit Date" value="01/25/2023" />
              <MetaStat label="Clinical Signature" value="Yes" success />
            </div>

            {/* Physical Assessment Section */}
            <section className="mb-10">
              <SectionHeader icon={<Thermometer size={18} />} title="Physical Assessment" color="text-indigo-600" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Vital Signs</p>
                  <div className="flex flex-wrap gap-4">
                    <VitalBadge label="Temp" value="98.5" />
                    <VitalBadge label="Pulse" value="68" />
                    <VitalBadge label="Resp" value="16" />
                    <VitalBadge label="BP" value="155/81" alert />
                    <VitalBadge label="O2" value="92%" alert />
                  </div>
                </div>
                <div className="space-y-4">
                  <SummaryItem label="Cardiac Findings" value="Hypertension; Edema in bilateral lower extremities." />
                  <SummaryItem label="Skin/Wound" value="Fungal skin infections on arms and neck; ongoing topical treatment." />
                </div>
              </div>
            </section>

            {/* Indicators of Decline */}
            <section className="mb-10">
              <SectionHeader icon={<TrendingDown size={18} />} title="Indicators of Decline" color="text-rose-600" />
              <div className="mt-4 space-y-3">
                {[
                  "Patient bedridden with maximum dependence on ADLs.",
                  "Generalized weakness and fatigue even at rest.",
                  "Shortness of breath on mild exertion.",
                  "Loss of weight by more than 10% over 6 months.",
                  "Recurrent aspiration pneumonia."
                ].map((text, i) => (
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
                  "Ensure patient receives regular skin assessments and dietary management to control blood sugar. Monitor respiratory distress and ensure supplemental oxygen use."
                </p>
                <div className="pt-4 border-t border-amber-100/50">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Hallucination Check</p>
                  <p className="text-sm font-medium text-slate-600">Patient is awake with confusion, disorientation, and loss of recognition.</p>
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
                  <button className="w-full mt-1.5 flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-400 transition-all">
                    <span className="font-bold text-slate-700">TINAJERO PEREZ</span>
                    <ChevronDown size={16} className="text-slate-400" />
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select RN Note</label>
                  <button className="w-full mt-1.5 flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-indigo-400 transition-all">
                    <span className="font-bold text-slate-700 truncate mr-2 text-sm">16_PEREZ TINAJERO J - RN...</span>
                    <ChevronDown size={16} className="text-slate-400" />
                  </button>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 group">
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
                Ensure the complete documentation of patient's height, weight, and a detailed nutritional intake analysis to closely monitor impacts on health status.
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