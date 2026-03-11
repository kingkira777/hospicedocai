const BenefitPeriodEvidence = ({data}:any) => {
  const ppsData = [
    { date: "2023-02-02", score: 70 },
    { date: "2024-03-01", score: 60 },
    { date: "2024-05-20", score: 50 },
  ];

  const vitalsData = [
    { date: "2024-01-25", weight: 132, bp: "130/80", spo2: "98%", pain: "2" },
    { date: "2024-03-08", weight: 128, bp: "125/78", spo2: "95%", pain: "3" },
    { date: "2024-05-20", weight: 122, bp: "120/76", spo2: "91%", pain: "4" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-slate-800">
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        {/* Main Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">Benefit Period Evidence</h1>
        </div>

        {/* PPS Trend Section */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-500 rounded-full"></span>
            PPS Trend (dated)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">PPS Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.pps_trend?.map((item:any, idx:number) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm font-medium text-slate-600">{item.date}</td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className={`h-full transition-all duration-500 ${item.pps_score > 60 ? 'bg-emerald-400' : item.pps_score > 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                            style={{ width: `${item.pps_score}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-900">{item.pps_score}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Vitals & Pain Section */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-rose-500 rounded-full"></span>
            Vitals & Pain (dated)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Weight</th>
                  <th className="pb-3 font-semibold">BP / HR</th>
                  <th className="pb-3 font-semibold">SpO2</th>
                  <th className="pb-3 font-semibold text-right">Pain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data?.benefit_period_evidence?.map((item:any, idx:number) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-sm font-medium text-slate-600">{item.date}</td>
                    <td className={`py-4 text-sm font-bold ${idx === 2 ? 'text-red-600' : 'text-slate-700'}`}>
                      {item.weight}
                    </td>
                    <td className="py-4 text-sm text-slate-700">{item.bp_hr}</td>
                    <td className={`py-4 text-sm ${parseInt(item.spo2) < 95 ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
                      {item.spo2}
                    </td>
                    <td className="py-4 text-right">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${item?.pain > 3 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                        {item.pain}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitPeriodEvidence;