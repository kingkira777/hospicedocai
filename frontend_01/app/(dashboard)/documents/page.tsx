"use client";

import React, { useState, ChangeEvent } from 'react';
import { 
  UploadCloud, 
  ChevronDown, 
  FileText, 
  Image as ImageIcon, 
  X, 
  CheckCircle2 
} from 'lucide-react';

interface FileItem {
  id: string;
  file: File;
  category: string;
  previewUrl: string;
}

const categories = ["Invoices", "Contracts", "Images", "Others"];

export default function DocumentsPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [uploadCategory, setUploadCategory] = useState<string>("Others");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        category: uploadCategory,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const filteredFiles = selectedCategory === "All" 
    ? files 
    : files.filter(f => f.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-blue-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        {/* --- Header & Category Selector --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Documents</h2>
            <p className="text-gray-500 text-sm">Upload and organize your project documents</p>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
            <span className="text-xs font-semibold text-gray-400 uppercase ml-2">Patient:</span>
            <select 
              className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {/* --- Enhanced Upload Zone --- */}
        <label className="relative group cursor-pointer block">
          <input type="file" multiple className="hidden" onChange={handleFileChange} />
          
          <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 group-hover:bg-blue-50 group-hover:border-blue-400 transition-all duration-300">
            {/* The Big Upload Icon */}
            <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
              <UploadCloud size={40} className="text-blue-500" />
            </div>
            
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">
                Click to upload <span className="text-blue-600">or drag and drop</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Any file type accepted (Max 10MB per file)
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
            Recent Files 
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
              <option value="All">All Files</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {/* --- File Grid --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredFiles.map((fileItem) => (
            <div key={fileItem.id} className="relative group animate-in fade-in zoom-in duration-300">
              {/* Remove Button */}
              <button 
                onClick={() => removeFile(fileItem.id)}
                className="absolute -top-2 -right-2 z-20 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
              >
                <X size={12} strokeWidth={3} />
              </button>
              
              <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center group-hover:border-blue-200 transition-colors">
                {fileItem.previewUrl ? (
                  <img src={fileItem.previewUrl} alt="preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FileText size={32} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                      {fileItem.file.name.split('.').pop()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-2 px-1">
                <p className="text-xs font-bold text-gray-700 truncate">{fileItem.file.name}</p>
                <p className="text-[10px] font-medium text-blue-500 uppercase tracking-widest mt-0.5">
                  {fileItem.category}
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