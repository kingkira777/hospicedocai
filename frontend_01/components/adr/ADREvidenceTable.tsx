

const ADREvidenceTable = ({data}:any) => {


  return (
    <div className="max-w-4xl mx-auto">
      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-slate-900 px-6 py-5">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
            <span className="bg-blue-500 w-2 h-6 rounded-full"></span>
            ADR Evidence Table 
            <span className="text-slate-400 font-normal text-sm block sm:inline italic">
              (Auto-built: Dates + Measurements + Notes)
            </span>
          </h2>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-40">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-48">Measurements</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Evidence / Clinical Notes</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              
              {
                data && data.map((item:any, index:number) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-8 align-top">
                      <span className="inline-flex items-center px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                        {item?.date}
                      </span>
                    </td>
                    <td className="px-6 py-8 align-top">
                      <div className="grid grid-cols-1 gap-1 text-sm text-slate-600">
                        <p><span className="font-semibold text-slate-900 w-16 inline-block text-xs uppercase text-slate-400">PPS:</span> {item?.measurements?.pps}</p>
                        <p><span className="font-semibold text-slate-900 w-16 inline-block text-xs uppercase text-slate-400">Weight:</span> {item?.measurements?.weight}</p>
                        <p><span className="font-semibold text-slate-900 w-16 inline-block text-xs uppercase text-slate-400">MAC:</span> {item?.measurements?.mac}</p>
                        <p><span className="font-semibold text-slate-900 w-16 inline-block text-xs uppercase text-slate-400">BP/HR:</span> {item?.measurements?.bp_hr}</p>
                        <p><span className="font-semibold text-slate-900 w-16 inline-block text-xs uppercase text-slate-400">SPO2:</span> {item?.measurements?.spo2}</p>
                        <p><span className="font-semibold text-slate-900 w-16 inline-block text-xs uppercase text-slate-400">Pain:</span> {item?.measurements?.pain}</p>
                      </div>
                    </td>
                    <td className="px-6 py-8 align-top">
                      <div className="bg-blue-50/50 p-4 rounded-lg border-l-4 border-blue-400">
                        <div className="text-slate-700 leading-relaxed text-sm">
                          <ul>
                            {item?.evidence_narrative.map((e:any, i:number) => <li key={i}>{e}</li>)}
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      
      </div>
    </div>
  );
};

export default ADREvidenceTable;