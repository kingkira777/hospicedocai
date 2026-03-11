const ClinicalPresenceTable = ({data}:any) => {
  const records = [
    {
      document: "RN Initial Assessment",
      date: "2023-01-25",
      highlights: [
        "High risk in nutritional intake and skin integrity observed.",
        "Necessary assessments for safety and mobility were completed."
      ]
    },
    {
      document: "IDG Notes",
      date: "2024-05-22",
      highlights: [
        "Detailed care plans were closed and compliance with medication guidance noted."
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            RN Admission / MD / IDG Presence
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-1/4">Document</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-1/5">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Highlights</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data?.document_highlights?.map((record:any, index:number) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5 align-top">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform"></div>
                      <span className="font-bold text-slate-900 text-sm leading-tight">
                        {record.document}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {record.date}
                    </span>
                  </td>
                  <td className="px-6 py-5 align-top">
                    <ul className="space-y-3">
                      {record.highlights.map((bullet:any, bIndex:number) => (
                        <li key={bIndex} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                          <span className="text-emerald-500 mt-1 flex-shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClinicalPresenceTable;