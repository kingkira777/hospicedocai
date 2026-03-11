const DisciplineNotesTable = ({data}:any) => {
  const notes = [
    {
      date: "2024-05-22",
      discipline: "MSW",
      note: "Provided psychosocial support to cope with patient anxiety and depression."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            Discipline notes (dated):
          </h2>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest w-32">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest w-32">Discipline</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data?.discipline_notes?.map((item:any, index:number) => (
                <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-6 align-top">
                    <span className="text-sm font-medium text-slate-600">
                      {item.date}
                    </span>
                  </td>
                  <td className="px-6 py-6 align-top">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200 shadow-sm">
                      {item.discipline}
                    </span>
                  </td>
                  <td className="px-6 py-6 align-top">
                    <div className="relative">
                      {/* Decorative vertical line for a "journal" feel */}
                      <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-slate-100 rounded-full"></div>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {item.note}
                      </p>
                    </div>
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

export default DisciplineNotesTable;