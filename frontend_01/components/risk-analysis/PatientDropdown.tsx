"use client";

import React, { useState, useEffect } from 'react';
import { User, ChevronDown, Search, Users, Check } from 'lucide-react';
import api from '@/lib/axios';
import { useAuth } from '@/hooks/use-auth';


type Props = {
  onSelect: (patient: any) => void;
}


export default function PatientDropdown({onSelect}: Props) {
  const { user }:any = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient]:any = useState(null);
  const [patients, setPatientList] = useState([]);




  const fetchPatientSelectList = async () => {
      try {
          const { data } = await api.get(`/patient/list-select?companyId=${user?.company.id}`);
          console.log("Fetched patient select list:", data);
          const formData:any = [];
          for(const patient of data){
              const xData = {
                  id: patient.id,
                  name: patient.firstName + ' ' + patient.lastName,
                  gender : patient.gender,
                  dateOfBirth: patient.dateOfBirth,
                  startOfCare: patient.startOfCare,
              };
              formData.push(xData);
          }
          setPatientList(formData);
      } catch (error) {
          console.error("Error in FetchPatientSelectList:", error);
      }
  };

  useEffect(() => {
    if(user){
      fetchPatientSelectList();
    }
  }, [user]);

  useEffect(() => {
    if (selectedPatient) {
      onSelect(selectedPatient);
    }
  },[selectedPatient]);

  return (  
    <div className="max-w-7xl mx-auto flex items-center justify-between px-2">
      {/* Left Side: Page Title */}
      <div>
      </div>
      {/* Right Side: Enhanced Patient Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 bg-white border p-1.5 pl-4 rounded-2xl shadow-sm transition-all duration-200 
            ${isOpen ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
        >
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Selected Patient</p>
            <p className="text-sm font-bold text-slate-800">{selectedPatient?.name} ({selectedPatient?.id})</p>
          </div>
          
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
            <User size={20} />
          </div>
          
          <ChevronDown size={16} className={`text-slate-400 mr-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
            <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-100 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-50 mb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search patient..." 
                    className="w-full bg-slate-50 border-none rounded-lg py-1.5 pl-9 pr-4 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {patients.map((patient:any) => (
                <button
                  key={patient?.id}
                  onClick={() => {
                    setSelectedPatient(patient);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      {patient.id}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                        {patient.name}
                      </p>
                      <p className={`text-[10px] font-bold uppercase ${patient.color}`}>
                        {patient.status}
                      </p>
                    </div>
                  </div>
                  {selectedPatient?.id === patient.id && (
                    <Check size={16} className="text-indigo-500" />
                  )}
                </button>
              ))}

              <div className="mt-2 pt-2 border-t border-slate-50 px-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors">
                  <Users size={14} />
                  View All Patients
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}