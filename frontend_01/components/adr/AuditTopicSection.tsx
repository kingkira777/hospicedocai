"use client";

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRightCircle 
} from 'lucide-react';

// --- Types & Data ---
interface AuditTopic {
  id: number;
  topic_name: string;
  status: 'PASS' | 'NEEDS WORK';
  finding: string[];
  recommendation: string[];
}


export default function AuditTopicsSection({data}: {data: AuditTopic[]}) {
  const [openId, setOpenId] = useState<number | null>(1); // Default first one open

  return (
    <div className="max-w-7xl mx-auto mt-12 mb-20">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          ADR Audit Topics <span className="text-indigo-400 font-medium text-sm">(1-15)</span>
        </h2>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
          Detailed Analysis
        </div>
      </div>

      <div className="space-y-3">
        {data?.map((topic) => (
          <div 
            key={topic.id} 
            className={`group bg-white border rounded-2xl transition-all duration-200 ${
              openId === topic.id 
              ? 'border-indigo-200 shadow-md' 
              : 'border-slate-100 hover:border-slate-200 hover:shadow-sm'
            }`}
          >
            {/* Header / Trigger */}
            <button 
              onClick={() => setOpenId(openId === topic.id ? null : topic.id)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-slate-300 group-hover:text-indigo-400 transition-colors">
                  {topic.id.toString().padStart(2, '0')}
                </span>
                <h3 className={`font-bold text-sm md:text-base transition-colors ${
                  openId === topic.id ? 'text-indigo-700' : 'text-slate-700'
                }`}>
                  {topic.topic_name}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter transition-all ${
                  topic.status === 'PASS' 
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                  : 'bg-orange-50 text-orange-600 border border-orange-100 shadow-sm animate-pulse'
                }`}>
                  {topic.status}
                </span>
                {openId === topic.id ? (
                  <ChevronUp className="text-slate-400" size={18} />
                ) : (
                  <ChevronDown className="text-slate-300" size={18} />
                )}
              </div>
            </button>

            {/* Content Body */}
            {openId === topic.id && (
              <div className="px-5 pb-6 pt-0 animate-in slide-in-from-top-2 duration-300">
                <div className="ml-10 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-50 pt-5">
                  {/* Findings */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-indigo-400" />
                      Findings
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {topic.finding.join(', ')}
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                      <ArrowRightCircle size={12} />
                      Recommendations
                    </p>
                    <p className="text-sm text-indigo-900/80 leading-relaxed font-semibold bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                      {topic.recommendation.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}