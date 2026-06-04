import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
const Dashboard = ({ alerts }) => {
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
    return (_jsxs("div", { className: "h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 p-4", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h1", { className: "text-20px font-bold text-slate-900 mb-1", children: "Alert Analytics Dashboard" }), _jsx("p", { className: "text-12px text-slate-600", children: "Real-time monitoring and analysis of fraud alerts" })] }), _jsxs("div", { className: "grid grid-cols-4 gap-3 mb-4", children: [_jsxs("div", { className: "bg-white rounded-xl p-4 border-2 border-slate-200 shadow-medium hover:shadow-strong transition-shadow", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("div", { className: "text-11px font-bold text-slate-600 uppercase tracking-wide", children: "Total Alerts" }), _jsx("div", { className: "w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center", children: _jsx(AlertTriangle, { size: 18, className: "text-blue-600" }) })] }), _jsx("div", { className: "text-28px font-bold text-slate-900", children: totalAlerts }), _jsx("div", { className: "text-10px text-slate-500 mt-1", children: "Active cases" })] }), _jsxs("div", { className: "bg-white rounded-xl p-4 border-2 border-red-200 shadow-medium hover:shadow-strong transition-shadow", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("div", { className: "text-11px font-bold text-red-600 uppercase tracking-wide", children: "High Risk" }), _jsx("div", { className: "w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center", children: _jsx(TrendingUp, { size: 18, className: "text-red-600" }) })] }), _jsx("div", { className: "text-28px font-bold text-red-700", children: highRiskAlerts }), _jsx("div", { className: "text-10px text-red-500 mt-1", children: "Score \u2265 75" })] }), _jsxs("div", { className: "bg-white rounded-xl p-4 border-2 border-amber-200 shadow-medium hover:shadow-strong transition-shadow", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("div", { className: "text-11px font-bold text-amber-600 uppercase tracking-wide", children: "Overdue" }), _jsx("div", { className: "w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center", children: _jsx(Clock, { size: 18, className: "text-amber-600" }) })] }), _jsx("div", { className: "text-28px font-bold text-amber-700", children: overdueAlerts }), _jsx("div", { className: "text-10px text-amber-500 mt-1", children: "SLA breach" })] }), _jsxs("div", { className: "bg-white rounded-xl p-4 border-2 border-emerald-200 shadow-medium hover:shadow-strong transition-shadow", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("div", { className: "text-11px font-bold text-emerald-600 uppercase tracking-wide", children: "Closed" }), _jsx("div", { className: "w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center", children: _jsx(CheckCircle, { size: 18, className: "text-emerald-600" }) })] }), _jsx("div", { className: "text-28px font-bold text-emerald-700", children: closedAlerts }), _jsx("div", { className: "text-10px text-emerald-500 mt-1", children: "Resolved cases" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-white rounded-xl p-4 border-2 border-slate-200 shadow-medium", children: [_jsx("h3", { className: "text-14px font-bold text-slate-900 mb-3", children: "Alert Status Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 200, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: statusData, cx: "50%", cy: "50%", labelLine: false, label: ({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`, outerRadius: 70, fill: "#8884d8", dataKey: "value", children: statusData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) }), _jsx("div", { className: "mt-3 grid grid-cols-2 gap-2", children: statusData.map((item, index) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: item.color } }), _jsxs("span", { className: "text-11px text-slate-700", children: [item.name, ": ", item.value] })] }, index))) })] }), _jsxs("div", { className: "bg-white rounded-xl p-4 border-2 border-slate-200 shadow-medium", children: [_jsx("h3", { className: "text-14px font-bold text-slate-900 mb-3", children: "Severity Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 200, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: severityData, cx: "50%", cy: "50%", labelLine: false, label: ({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`, outerRadius: 70, fill: "#8884d8", dataKey: "value", children: severityData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) }), _jsx("div", { className: "mt-3 grid grid-cols-2 gap-2", children: severityData.map((item, index) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: item.color } }), _jsxs("span", { className: "text-11px text-slate-700", children: [item.name, ": ", item.value] })] }, index))) })] }), _jsxs("div", { className: "bg-white rounded-xl p-4 border-2 border-slate-200 shadow-medium", children: [_jsx("h3", { className: "text-14px font-bold text-slate-900 mb-3", children: "Risk Score Distribution" }), _jsx(ResponsiveContainer, { width: "100%", height: 200, children: _jsxs(BarChart, { data: riskScoreData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e2e8f0" }), _jsx(XAxis, { dataKey: "range", tick: { fontSize: 11 } }), _jsx(YAxis, { tick: { fontSize: 11 } }), _jsx(Tooltip, { contentStyle: {
                                                backgroundColor: '#fff',
                                                border: '2px solid #e2e8f0',
                                                borderRadius: '8px',
                                                fontSize: '11px'
                                            } }), _jsx(Bar, { dataKey: "count", fill: "#3b82f6", radius: [8, 8, 0, 0] })] }) })] }), _jsxs("div", { className: "bg-white rounded-xl p-4 border-2 border-slate-200 shadow-medium", children: [_jsx("h3", { className: "text-14px font-bold text-slate-900 mb-3", children: "SLA Status Overview" }), _jsx(ResponsiveContainer, { width: "100%", height: 200, children: _jsxs(BarChart, { data: slaData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e2e8f0" }), _jsx(XAxis, { dataKey: "status", tick: { fontSize: 11 } }), _jsx(YAxis, { tick: { fontSize: 11 } }), _jsx(Tooltip, { contentStyle: {
                                                backgroundColor: '#fff',
                                                border: '2px solid #e2e8f0',
                                                borderRadius: '8px',
                                                fontSize: '11px'
                                            } }), _jsx(Bar, { dataKey: "count", radius: [8, 8, 0, 0], children: slaData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) })] }) })] })] })] }));
};
export default Dashboard;
//# sourceMappingURL=Dashboard.js.map