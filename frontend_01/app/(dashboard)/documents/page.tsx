"use client";

import React, { useState, ChangeEvent } from 'react';
import { 
  UploadCloud, 
  ChevronDown, 
  FileText, 
  Image as ImageIcon, 
  X, 
  CheckCircle2,
  UploadCloudIcon,
  Loader2
} from 'lucide-react';

import { message } from 'antd';
import PatientDropdown from '@/components/risk-analysis/PatientDropdown';
import api from '@/lib/axios';
import { DOCUMENT_CHECKLIST } from '@/constant/documents';
import { useAuth } from '@/hooks/use-auth';
import { showConfirmationDialog } from '@/lib/utils';

export default function DocumentsPage() {
  const { user }:any = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [files, setFiles] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [uploadCategory, setUploadCategory] = useState<string>("Others");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const FetchFileByPatient = async (patientId: number) => {
    try {
      const { data } = await api.post(`/file/by-patient/${patientId}`,{
        category: (selectedCategory === 'all') ? null : selectedCategory
      });
      console.log("Fetched file by patient:", data);
      if(data){
        const updatedFiles = data.map((file: any) => ({
          id: file.id,
          file: file.fileName,
          category: file.category,
          previewUrl: null,
        }));
        setFiles(updatedFiles);
      }
    } catch (error) {
      console.error("Error in FetchFileByPatient:", error);
    }
  };


  const handleSelectedPatient = (patient: any) => {
    setSelectedPatient(patient);
    FetchFileByPatient(patient.id);
  };


  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      
      if(selectedPatient === null){
        messageApi.error("Please select a patient");
        return;
      }
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('patientId',  selectedPatient?.id || '');
        formData.append('userId', user.id || '');

        for (let i = 0; i < e.target.files.length; i++) {
          formData.append('files', e.target.files[i]);
        }

        const { data } = await api.post('/file/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Upload response:', data);
        messageApi.success("Files uploaded successfully!");
        FetchFileByPatient(selectedPatient.id);
        setIsUploading(false);
      } catch (error) {
        console.error("Error in handleFileChange:", error);
        setIsUploading(false);
      }
    }
  };

  const removeFile = (id: string) => {

    showConfirmationDialog('Are you sure?', 'Do you really want to delete this file?').then(async (confirmed) => {
      if (confirmed) {
        console.log('File deleted:', id);
        try {
            await api.post(`/file/delete/${id}`);
            setFiles((prev) => prev.filter((f) => f.id !== id));
            messageApi.success("File deleted successfully!");
            FetchFileByPatient(selectedPatient.id);
        } catch (error) {
            console.error("Error in FetchFileByPatient:", error);
            messageApi.error("Failed to delete file.");
        }
      } else {
        console.log('File deletion cancelled');
      }
    });
  };

  const filteredFiles = selectedCategory === "all" 
    ? files 
    : files.filter(f => f.category === selectedCategory);
  console.log(filteredFiles);


  return (
    <div className="max-w-4xl mx-auto p-8 bg-blue-100 min-h-screen">
      {contextHolder}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        {/* --- Header & Category Selector --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Documents</h2>
            <p className="text-gray-500 text-sm">Upload and organize your project documents</p>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <PatientDropdown onSelect={handleSelectedPatient} />
            
          </div>
        </div>



        {/* --- Enhanced Upload Zone --- */}
        <label className={`relative group cursor-pointer block ${isUploading ? 'pointer-events-none opacity-80' : ''}`}>
          <input type="file" multiple className="hidden" onChange={handleFileChange} />
          
          <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 group-hover:bg-blue-50 group-hover:border-blue-400 transition-all duration-300">
            {/* The Icon/Spinner Container */}
            <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
              {isUploading ? (
                <Loader2 size={40} className="text-blue-500 animate-spin" />
              ) : (
                <UploadCloud size={40} className="text-blue-500" />
              )}
            </div>
            
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">
                {isUploading ? "Uploading files..." : (
                  <>Click to upload <span className="text-blue-600">or drag and drop</span></>
                )}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {isUploading ? "Please wait a moment" : "Any file type accepted (Max 10MB per file)"}
              </p>
            </div>
            
            {/* Visual Indicator for Selected Category */}
            <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
              <CheckCircle2 size={12} />
              Uploading as {uploadCategory}
            </div>
          </div>
        </label>

        <hr className="my-10 border-gray-100" />

        {/* --- Gallery Controls --- */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            Uploaded Files 
            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
              {filteredFiles.length}
            </span>
          </h3>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Filter:</span>
            <select 
              className="text-sm font-medium text-gray-600 bg-transparent focus:outline-none cursor-pointer"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Files</option>
              {DOCUMENT_CHECKLIST.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {/* --- File Grid --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredFiles.map((fileItem) => (
            <div key={fileItem?.id} className="relative group animate-in fade-in zoom-in duration-300">
              {/* Remove Button */}
              <button 
                onClick={() => removeFile(fileItem?.id)}
                className="absolute -top-2 -right-2 z-20 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
              >
                <X size={12} strokeWidth={3} />
              </button>
              
              <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center group-hover:border-blue-200 transition-colors">
                {fileItem.previewUrl ? (
                  <img src={fileItem?.previewUrl} alt="preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={32} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                      {fileItem?.file}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-2 px-1">
                <p className="text-xs font-bold text-gray-700 truncate">{fileItem?.file}</p>
                <p className="text-[10px] font-medium text-blue-500 uppercase tracking-widest mt-0.5">
                  {fileItem?.category}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm italic">No files found matching this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}