import React, { useState, useEffect } from 'react';
import KPICard from './KPICard';
import FrictionHeatmap from './FrictionHeatmap';
import PortfolioSnapshot from './PortfolioSnapshot';
import { getDashboardMetrics } from '../services/kpiService';
import HeroBanner from '@/components/command-center/HeroBanner';

const CommandCenter = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded for this exercise per the spec
  const organizationId = "org_001";

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await getDashboardMetrics(organizationId);
        setMetrics(data);
        setError(null);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard metrics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [organizationId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading Command Center data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-md text-center">
          <div className="text-red-500 mb-4 flex justify-center">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Retry Fetching
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      notation: "compact", // E.g., 250K
      compactDisplay: "short"
    }).format(val);
  };

  const getDiriColor = (label) => {
    switch(label) {
      case 'High': return 'text-emerald-600';
      case 'Moderate': return 'text-yellow-600';
      case 'Low': return 'text-rose-600';
      default: return 'text-gray-900';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <HeroBanner />

        {/* Top KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="DIRI Readiness Index" 
            value={`${metrics.diri.percentage.toFixed(0)}%`} 
            subtitle={metrics.diri.label}
            valueColorClass={getDiriColor(metrics.diri.label)}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            extraInfo={<div className="h-1.5 w-full bg-gray-100 rounded-full mt-2"><div className={`h-1.5 rounded-full ${metrics.diri.label === 'High' ? 'bg-emerald-500' : metrics.diri.label === 'Moderate' ? 'bg-yellow-500' : 'bg-rose-500'}`} style={{width: `${metrics.diri.percentage}%`}}></div></div>}
          />
          <KPICard 
            title="ITRI Trust Index" 
            value={`${metrics.itri.toFixed(1)}%`} 
            valueColorClass="text-blue-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          />
          <KPICard 
            title="ROI-M Pipeline" 
            value={formatCurrency(metrics.roiPipeline)} 
            valueColorClass="text-emerald-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <KPICard 
            title="Innovation Velocity" 
            value={metrics.velocity}
            subtitle="trans. / 30d"
            valueColorClass="text-indigo-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
        </div>

        {/* Middle KPI row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <KPICard 
            title="Time-to-Decision" 
            value={metrics.timeToDecision.toFixed(1)}
            subtitle="days on avg"
            valueColorClass="text-purple-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <KPICard 
            title="Participation Rate" 
            value={`${metrics.participationRate.toFixed(1)}%`}
            valueColorClass="text-teal-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745V16c0 1.1.9 2 2 2h14a2 2 0 002-2v-2.745M21 9.255A23.931 23.931 0 0112 11c-3.183 0-6.22-.62-9-1.745V10c0 1.1.9 2 2 2h14a2 2 0 002-2V9.255z" /></svg>}
          />
        </div>

        {/* Heatmap & Snapshot */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          <FrictionHeatmap frictionMap={metrics.frictionMap} />
          <PortfolioSnapshot topIdeas={metrics.topIdeas} />
        </div>

      </div>
    </div>
  );
};

export default CommandCenter;
