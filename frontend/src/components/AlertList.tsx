import React from 'react';
import { AlertCircle, TrendingUp, Clock, User } from 'lucide-react';
import type { Alert } from '../types';

interface AlertListProps {
  alerts: Alert[];
  selectedAlert: Alert | null;
  onSelectAlert: (alert: Alert) => void;
}

const AlertList: React.FC<AlertListProps> = ({ alerts, selectedAlert, onSelectAlert }) => {
  const getSeverityColor = (severity: string) => {
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

  const getStatusColor = (status: string) => {
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

  return (
    <div className="h-full overflow-y-auto bg-white border-r border-gray-200">
      <div className="sticky top-0 bg-actimize-primary text-white p-4 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle size={20} />
            Transaction Alerts
          </h2>
          <span className="bg-white text-actimize-primary px-3 py-1 rounded-full text-sm font-semibold">
            {alerts.length}
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {alerts.map((alert) => (
          <div
            key={alert.alert_id}
            onClick={() => onSelectAlert(alert)}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedAlert?.alert_id === alert.alert_id ? 'bg-blue-50 border-l-4 border-actimize-secondary' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {alert.transaction.transaction_id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {alert.transaction.customer_name || alert.transaction.customer_id}
                </div>
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <TrendingUp size={14} />
                <span className="font-medium">
                  {alert.transaction.currency} {alert.transaction.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={14} />
                <span>{new Date(alert.created_at).toLocaleString()}</span>
              </div>
              {alert.assigned_to && (
                <div className="flex items-center gap-2 text-gray-600">
                  <User size={14} />
                  <span>{alert.assigned_to}</span>
                </div>
              )}
            </div>

            <div className="mt-2">
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(alert.status)}`}>
                {alert.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No alerts to display</p>
        </div>
      )}
    </div>
  );
};

export default AlertList;
