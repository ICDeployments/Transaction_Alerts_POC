import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import type { Alert } from '../types';

interface DashboardProps {
  alerts: Alert[];
}

const Dashboard: React.FC<DashboardProps> = ({ alerts }) => {
  // Calculate statistics
  const totalAlerts = alerts.length;
  const highRiskAlerts = alerts.filter(a => (a.risk_score || 0) >= 75).length;
  const overdueAlerts = alerts.filter(a => a.sla_status === 'Overdue').length;
  const closedAlerts = alerts.filter(a => a.status === 'Closed').length;

  // Data for Status Distribution Pie Chart
  const statusData = [
    { name: 'Open', value: alerts.filter(a => a.status === 'Open').length, color: '#3b82f6' },
    { name: 'In Review', value: alerts.filter(a => a.status === 'In Review').length, color: '#f59e0b' },
    { name: 'Escalated', value: alerts.filter(a => a.status === 'Escalated').length, color: '#ef4444' },
    { name: 'Closed', value: alerts.filter(a => a.status === 'Closed').length, color: '#10b981' },
  ].filter(item => item.value > 0);

  // Data for Severity Distribution Pie Chart
  const severityData = [
    { name: 'Critical', value: alerts.filter(a => a.severity === 'Critical').length, color: '#dc2626' },
    { name: 'High', value: alerts.filter(a => a.severity === 'High').length, color: '#f97316' },
    { name: 'Medium', value: alerts.filter(a => a.severity === 'Medium').length, color: '#f59e0b' },
    { name: 'Low', value: alerts.filter(a => a.severity === 'Low').length, color: '#10b981' },
  ].filter(item => item.value > 0);

  // Data for Risk Score Distribution Bar Chart
  const riskScoreData = [
    { range: '0-25', count: alerts.filter(a => (a.risk_score || 0) < 25).length },
    { range: '25-50', count: alerts.filter(a => (a.risk_score || 0) >= 25 && (a.risk_score || 0) < 50).length },
    { range: '50-75', count: alerts.filter(a => (a.risk_score || 0) >= 50 && (a.risk_score || 0) < 75).length },
    { range: '75-100', count: alerts.filter(a => (a.risk_score || 0) >= 75).length },
  ];

  // Data for SLA Status Bar Chart
  const slaData = [
    { status: 'On Time', count: alerts.filter(a => a.sla_status === 'On Time' || !a.sla_status).length, color: '#10b981' },
    { status: 'At Risk', count: alerts.filter(a => a.sla_status === 'At Risk').length, color: '#f59e0b' },
    { status: 'Overdue', count: alerts.filter(a => a.sla_status === 'Overdue').length, color: '#ef4444' },
  ];



  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      {/* Header - More Compact */}
      <div className="mb-4">
        <h1 className="text-20px font-bold text-slate-900 mb-1">Alert Analytics Dashboard</h1>
        <p className="text-12px text-slate-600">Real-time monitoring and analysis of fraud alerts</p>
      </div>

      {/* KPI Cards - More Compact */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-xl p-4 border-2 border-slate-200 shadow-medium hover:shadow-strong transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-11px font-bold text-slate-600 uppercase tracking-wide">Total Alerts</div>
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <AlertTriangle size={18} className="text-blue-600" />
            </div>
          </div>
          <div className="text-28px font-bold text-slate-900">{totalAlerts}</div>
          <div className="text-10px text-slate-500 mt-1">Active cases</div>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-red-200 shadow-medium hover:shadow-strong transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-11px font-bold text-red-600 uppercase tracking-wide">High Risk</div>
            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
              <TrendingUp size={18} className="text-red-600" />
            </div>
          </div>
          <div className="text-28px font-bold text-red-700">{highRiskAlerts}</div>
          <div className="text-10px text-red-500 mt-1">Score ≥ 75</div>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-amber-200 shadow-medium hover:shadow-strong transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-11px font-bold text-amber-600 uppercase tracking-wide">Overdue</div>
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock size={18} className="text-amber-600" />
            </div>
          </div>
          <div className="text-28px font-bold text-amber-700">{overdueAlerts}</div>
          <div className="text-10px text-amber-500 mt-1">SLA breach</div>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-emerald-200 shadow-medium hover:shadow-strong transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="text-11px font-bold text-emerald-600 uppercase tracking-wide">Closed</div>
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle size={18} className="text-emerald-600" />
            </div>
          </div>
          <div className="text-28px font-bold text-emerald-700">{closedAlerts}</div>
          <div className="text-10px text-emerald-500 mt-1">Resolved cases</div>
        </div>
      </div>

      {/* Charts Grid - More Compact */}
      <div className="grid grid-cols-2 gap-4">
        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-xl p-4 border-2 border-slate-200 shadow-medium">
          <h3 className="text-14px font-bold text-slate-900 mb-3">Alert Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-11px text-slate-700">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Distribution Pie Chart */}
        <div className="bg-white rounded-xl p-4 border-2 border-slate-200 shadow-medium">
          <h3 className="text-14px font-bold text-slate-900 mb-3">Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {severityData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-11px text-slate-700">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Score Distribution Bar Chart */}
        <div className="bg-white rounded-xl p-4 border-2 border-slate-200 shadow-medium">
          <h3 className="text-14px font-bold text-slate-900 mb-3">Risk Score Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={riskScoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '11px'
                }} 
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* SLA Status Bar Chart */}
        <div className="bg-white rounded-xl p-4 border-2 border-slate-200 shadow-medium">
          <h3 className="text-14px font-bold text-slate-900 mb-3">SLA Status Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={slaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="status" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '11px'
                }} 
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {slaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
