import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { AlertCircle, TrendingUp, Clock, User } from 'lucide-react';
const AlertList = ({ alerts, selectedAlert, onSelectAlert }) => {
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Critical':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'High':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Low':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'Open':
                return 'bg-green-100 text-green-800';
            case 'In Review':
                return 'bg-blue-100 text-blue-800';
            case 'Escalated':
                return 'bg-red-100 text-red-800';
            case 'Closed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    return (_jsxs("div", { className: "h-full overflow-y-auto bg-white border-r border-gray-200", children: [_jsx("div", { className: "sticky top-0 bg-actimize-primary text-white p-4 z-10", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h2", { className: "text-lg font-semibold flex items-center gap-2", children: [_jsx(AlertCircle, { size: 20 }), "Transaction Alerts"] }), _jsx("span", { className: "bg-white text-actimize-primary px-3 py-1 rounded-full text-sm font-semibold", children: alerts.length })] }) }), _jsx("div", { className: "divide-y divide-gray-200", children: alerts.map((alert) => (_jsxs("div", { onClick: () => onSelectAlert(alert), className: `p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedAlert?.alert_id === alert.alert_id ? 'bg-blue-50 border-l-4 border-actimize-secondary' : ''}`, children: [_jsx("div", { className: "flex items-start justify-between mb-2", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "font-semibold text-gray-900", children: alert.transaction.transaction_id }), _jsx("span", { className: `px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`, children: alert.severity })] }), _jsx("div", { className: "text-sm text-gray-600", children: alert.transaction.customer_name || alert.transaction.customer_id })] }) }), _jsxs("div", { className: "space-y-1 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-gray-700", children: [_jsx(TrendingUp, { size: 14 }), _jsxs("span", { className: "font-medium", children: [alert.transaction.currency, " ", alert.transaction.amount.toLocaleString()] })] }), _jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(Clock, { size: 14 }), _jsx("span", { children: new Date(alert.created_at).toLocaleString() })] }), alert.assigned_to && (_jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(User, { size: 14 }), _jsx("span", { children: alert.assigned_to })] }))] }), _jsx("div", { className: "mt-2", children: _jsx("span", { className: `inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(alert.status)}`, children: alert.status }) })] }, alert.alert_id))) }), alerts.length === 0 && (_jsxs("div", { className: "p-8 text-center text-gray-500", children: [_jsx(AlertCircle, { size: 48, className: "mx-auto mb-4 text-gray-300" }), _jsx("p", { children: "No alerts to display" })] }))] }));
};
export default AlertList;
//# sourceMappingURL=AlertList.js.map