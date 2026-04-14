import React from 'react';

/**
 * Returns a semi-transparent color based on the number of days for the heatmap.
 * High days -> more red, Low days -> more green.
 */
const getHeatmapColor = (avgDays) => {
  if (avgDays === null || avgDays === undefined) return 'bg-gray-50 text-gray-400';
  
  if (avgDays < 5) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  if (avgDays < 10) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (avgDays < 20) return 'bg-orange-100 text-orange-800 border-orange-200';
  return 'bg-rose-100 text-rose-800 border-rose-200';
};

const HeatmapCell = ({ value }) => {
  if (value === null || value === undefined) {
    return (
      <td className="p-3 text-center text-sm">
        <div className="w-full h-full min-h-[40px] rounded-md bg-gray-50 flex items-center justify-center text-gray-400 border border-transparent">
          -
        </div>
      </td>
    );
  }

  const bgColorClass = getHeatmapColor(value);
  
  return (
    <td className="p-2 text-center">
      <div className={`w-full h-full min-h-[40px] rounded-md flex flex-col items-center justify-center border transition-all duration-300 hover:scale-105 ${bgColorClass}`}>
        <span className="font-semibold text-sm">{value.toFixed(1)}</span>
        <span className="text-[10px] opacity-70 uppercase tracking-wider">days</span>
      </div>
    </td>
  );
};

const FrictionHeatmap = ({ frictionMap }) => {
  const departments = Object.keys(frictionMap);
  const stages = ["Drafting", "Review", "Approval", "Pilot"];

  if (departments.length === 0) {
    return <div className="text-gray-500 text-sm p-4">No data available for heatmap.</div>;
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-6">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">IFH Friction Heatmap</h3>
        <p className="text-sm text-gray-500">Average stage duration (days) indicating workflow bottlenecks.</p>
      </div>
      
      <div className="overflow-x-auto p-4">
        <table className="w-full text-left border-separate" style={{ borderSpacing: '0 8px' }}>
          <thead>
            <tr>
              <th className="font-medium text-xs text-gray-500 uppercase tracking-wider p-2 w-1/4">
                Department
              </th>
              {stages.map(stage => (
                <th key={stage} className="font-medium text-xs text-gray-500 uppercase tracking-wider text-center p-2">
                  {stage}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {departments.map((deptName) => (
              <tr key={deptName}>
                <td className="py-2 pl-2 pr-4 text-sm font-medium text-gray-700 bg-white rounded-l-lg border-y border-l border-gray-50 shadow-sm">
                  {deptName}
                </td>
                {stages.map((stage) => (
                  <HeatmapCell key={`${deptName}-${stage}`} value={frictionMap[deptName][stage]} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FrictionHeatmap;
