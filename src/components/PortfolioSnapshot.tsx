import React from 'react';

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

const getStageBadge = (stage) => {
  const styles = {
    Drafting: 'bg-gray-100 text-gray-700',
    Review: 'bg-blue-100 text-blue-700',
    Approval: 'bg-purple-100 text-purple-700',
    Pilot: 'bg-indigo-100 text-indigo-700',
  };
  const className = styles[stage] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${className}`}>
      {stage}
    </span>
  );
};

const getPathwayBadge = (pathway) => {
  const isFastTrack = pathway === 'Fast-Track';
  const className = isFastTrack ? 'bg-orange-100 text-orange-700' : 'bg-teal-100 text-teal-700';
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${className}`}>
      {pathway}
    </span>
  );
};

const PortfolioSnapshot = ({ topIdeas }) => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-6">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-white to-gray-50">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Innovation Portfolio Snapshot</h3>
          <p className="text-sm text-gray-500">Top 5 ideas ranked by AI Score</p>
        </div>
        <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Idea Title
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stage
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pathway
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                AI Score
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Potential Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {topIdeas.map((idea, index) => (
              <tr key={idea.id} className="hover:bg-gray-50/80 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs mr-3">
                      #{index + 1}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{idea.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {idea.departmentName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStageBadge(idea.stage)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPathwayBadge(idea.pathway)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-gray-900 mr-2">{idea.aiScore}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5 flex-shrink-0">
                      <div 
                        className="bg-indigo-500 h-1.5 rounded-full" 
                        style={{ width: `${Math.min(idea.aiScore, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">
                  {formatCurrency(idea.potentialValue)}
                </td>
              </tr>
            ))}
            {topIdeas.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                  No ideas available to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioSnapshot;
