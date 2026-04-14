import React from 'react';

/**
 * Reusable KPI Card component.
 * Features a modern generic presentation with optional icons and label accents.
 */
const KPICard = ({ title, value, subtitle, icon, valueColorClass, extraInfo }) => {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-500 font-medium text-sm tracking-wide">{title}</h3>
        {icon && (
          <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      
      <div>
        <div className="flex items-baseline space-x-2">
          <span className={`text-4xl font-bold tracking-tight ${valueColorClass || 'text-gray-900'}`}>
            {value}
          </span>
          {subtitle && (
            <span className="text-sm font-semibold text-gray-400">
              {subtitle}
            </span>
          )}
        </div>
        
        {extraInfo && (
          <div className="mt-3">
            {extraInfo}
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
