import React, { useState } from 'react';
import { FileText, Calendar, CreditCard, MapPin, User, Building2, AlertCircle, Wallet, Shield, CheckCircle, Clock, TrendingUp, Globe, Lock, FileCheck, AlertTriangle, CheckCircleIcon, XCircle, AlertOctagon, Search } from 'lucide-react';
import type { Alert } from '../types';

interface AlertDetailProps {
  alert: Alert;
  onStatusChange?: (alertId: string, newStatus: string, action: string, comments?: string) => void;
  onTabChange?: (alertId: string, tabName: string) => void;
}

const AlertDetail: React.FC<AlertDetailProps> = ({ alert, onStatusChange, onTabChange }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'transactions' | 'audit' | 'payments' | 'kyc'>('summary');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<typeof actions[0] | null>(null);
  const [analystComments, setAnalystComments] = useState('');
  const { transaction } = alert;

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'transactions', label: 'Flagged Transaction' },
    { id: 'payments', label: 'Payments System' },
    { id: 'kyc', label: 'KYC/CRM System' },
    { id: 'audit', label: 'Audit Trail' },
  ] as const;

  // Actimize-style action options
  const actions = [
    { id: 'close-resolved', label: 'Close - Resolved', icon: CheckCircle, status: 'Closed', color: 'emerald' },
    { id: 'close-false-positive', label: 'Close - False Positive', icon: XCircle, status: 'Closed', color: 'slate' },
    { id: 'escalate', label: 'Escalate to Investigator', icon: AlertOctagon, status: 'Escalated', color: 'red' },
    { id: 'investigate', label: 'Investigate Further', icon: Search, status: 'In Review', color: 'amber' },
    { id: 'refer-sar', label: 'Refer for SAR Filing', icon: FileCheck, status: 'Escalated', color: 'orange' },
    { id: 'request-info', label: 'Request Additional Info', icon: AlertCircle, status: 'In Review', color: 'blue' },
  ];

  const handleTabChange = (tabId: 'summary' | 'transactions' | 'audit' | 'payments' | 'kyc') => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(alert.alert_id, tabId);
    }
  };

  const handleAction = (action: typeof actions[0]) => {
    setSelectedAction(action);
    setShowActionMenu(false);
    setShowConfirmationModal(true);
  };

  const confirmAction = () => {
    if (!analystComments.trim()) {
      return; // Don't proceed if comments are empty
    }
    
    if (onStatusChange && selectedAction) {
      onStatusChange(alert.alert_id, selectedAction.status, selectedAction.label, analystComments);
    }
    
    // Reset state
    setShowConfirmationModal(false);
    setSelectedAction(null);
    setAnalystComments('');
  };

  const cancelAction = () => {
    setShowConfirmationModal(false);
    setSelectedAction(null);
    setAnalystComments('');
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-slate-50">
      {/* Action Buttons Bar - Actimize Style */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-3 border-b-2 border-slate-700 shadow-md">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <div className="text-11px font-bold uppercase tracking-wider text-slate-400">Alert Actions</div>
            <div className="text-13px font-bold mt-0.5">Case: {alert.alert_id}</div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-13px rounded-lg shadow-md transition-all hover:shadow-lg flex items-center gap-2"
            >
              <CheckCircleIcon size={16} />
              Take Action
            </button>
            
            {/* Action Dropdown Menu */}
            {showActionMenu && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-strong border-2 border-slate-200 z-50 animate-slide-up">
                <div className="p-2">
                  {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={() => handleAction(action)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all hover:bg-${action.color}-50 group`}
                      >
                        <div className={`w-8 h-8 rounded-full bg-${action.color}-100 flex items-center justify-center group-hover:bg-${action.color}-200 transition-colors`}>
                          <Icon size={16} className={`text-${action.color}-700`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 text-13px">{action.label}</div>
                          <div className="text-10px text-slate-500">Status: {action.status}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs - Premium Design */}
      <div className="border-b-2 border-slate-200 flex bg-white shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-6 py-3.5 text-13px font-bold transition-all relative ${
              activeTab === tab.id
                ? 'text-blue-700 bg-gradient-to-b from-blue-50 to-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'summary' && (
          <div className="animate-fade-in">
            {/* Two Column Grid Layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Alert Overview - Enhanced */}
                <div className="bg-white rounded-xl p-5 border-2 border-slate-200 shadow-medium hover:shadow-strong transition-shadow">
              <div className="flex items-center gap-2 text-11px font-bold text-slate-500 mb-4 uppercase tracking-wider">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-600 to-blue-700 rounded-full"></div>
                Alert Overview
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-13px">
                <div className="group">
                  <div className="text-slate-500 text-11px font-bold mb-1.5 uppercase tracking-wide">Alert ID</div>
                  <div className="font-bold text-blue-600 text-14px">{alert.alert_id}</div>
                </div>
                <div className="group">
                  <div className="text-slate-500 text-11px font-bold mb-1.5 uppercase tracking-wide">Risk Score</div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-16px ${
                      (alert.risk_score || 0) >= 75 ? 'text-red-600' :
                      (alert.risk_score || 0) >= 50 ? 'text-amber-600' : 'text-emerald-600'
                    }`}>{alert.risk_score || 0}</span>
                    <span className="text-11px text-slate-500">/100</span>
                  </div>
                </div>
                <div className="group">
                  <div className="text-slate-500 text-11px font-bold mb-1.5 uppercase tracking-wide">Severity</div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-3 py-1 rounded-lg font-bold text-12px ${
                      alert.severity === 'Critical' ? 'bg-red-100 text-red-700 border border-red-300' :
                      alert.severity === 'High' ? 'bg-orange-100 text-orange-700 border border-orange-300' :
                      alert.severity === 'Medium' ? 'bg-amber-100 text-amber-700 border border-amber-300' :
                      'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    }`}>{alert.severity}</span>
                  </div>
                </div>
                <div className="group">
                  <div className="text-slate-500 text-11px font-bold mb-1.5 uppercase tracking-wide">Status</div>
                  <div className="font-bold text-slate-900 text-14px">{alert.status}</div>
                </div>
                <div className="group">
                  <div className="text-slate-500 text-11px font-bold mb-1.5 uppercase tracking-wide">Age</div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-14px">{alert.age_days || 0}</span>
                    <span className="text-11px text-slate-500">days</span>
                  </div>
                </div>
                <div className="group">
                  <div className="text-slate-500 text-11px font-bold mb-1.5 uppercase tracking-wide">SLA Status</div>
                  <span className={`inline-flex px-3 py-1 rounded-lg font-bold text-11px uppercase tracking-wide ${
                    alert.sla_status === 'Overdue' ? 'bg-red-100 text-red-700 border border-red-300' :
                    alert.sla_status === 'At Risk' ? 'bg-amber-100 text-amber-700 border border-amber-300' :
                    'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  }`}>
                    {alert.sla_status || 'On Time'}
                  </span>
                </div>
              </div>
            </div>

            {/* Entity Information - Enhanced */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border-2 border-blue-200 shadow-medium hover:shadow-strong transition-shadow">
              <div className="flex items-center gap-2 text-11px font-bold text-blue-700 mb-4 uppercase tracking-wider">
                <User size={16} className="text-blue-600" />
                Entity Information
              </div>
              <div className="space-y-3.5 text-13px">
                <div className="flex items-start gap-3 bg-white rounded-lg p-3 border border-blue-100">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
                    {((alert.entity_name || transaction.customer_name) || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Entity Name</div>
                    <div className="font-bold text-slate-900 text-14px">{alert.entity_name || transaction.customer_name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-blue-100">
                  <Building2 size={20} className="text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Customer ID</div>
                    <div className="font-bold text-slate-900 text-14px">{transaction.customer_id}</div>
                  </div>
                </div>
                {alert.assigned_to && (
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-blue-100">
                    <User size={20} className="text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Assigned To</div>
                      <div className="font-bold text-slate-900 text-14px">{alert.assigned_to}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-6">

            {/* Transaction Details - Enhanced */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border-2 border-purple-200 shadow-medium hover:shadow-strong transition-shadow">
              <div className="flex items-center gap-2 text-11px font-bold text-purple-700 mb-4 uppercase tracking-wider">
                <CreditCard size={16} className="text-purple-600" />
                Transaction Details
              </div>
              <div className="space-y-3.5 text-13px">
                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-purple-100">
                  <FileText size={20} className="text-purple-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Transaction ID</div>
                    <div className="font-mono font-bold text-slate-900 text-13px">{transaction.transaction_id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-purple-100">
                  <CreditCard size={20} className="text-purple-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Amount</div>
                    <div className="font-bold text-purple-700 text-16px">{transaction.currency} {transaction.amount.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-purple-100">
                  <FileText size={20} className="text-purple-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Type</div>
                    <div className="font-bold text-slate-900 text-13px">{transaction.transaction_type || 'N/A'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-purple-100">
                  <MapPin size={20} className="text-purple-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Destination</div>
                    <div className="font-bold text-slate-900 text-13px">{transaction.destination_country}</div>
                  </div>
                </div>
                {transaction.transaction_date && (
                  <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-purple-100">
                    <Calendar size={20} className="text-purple-600 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Date</div>
                      <div className="font-bold text-slate-900 text-13px">{new Date(transaction.transaction_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Triggered Rules - Enhanced */}
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-5 border-2 border-orange-200 shadow-medium hover:shadow-strong transition-shadow">
              <div className="flex items-center gap-2 text-11px font-bold text-orange-700 mb-4 uppercase tracking-wider">
                <AlertCircle size={16} className="text-orange-600" />
                Triggered Rules ({alert.rule_ids.length})
              </div>
              <div className="space-y-2.5">
                {alert.rule_ids.map((rule, idx) => (
                  <div key={idx} className="text-12px py-3 px-4 bg-white rounded-lg border-2 border-orange-100 hover:border-orange-300 transition-all shadow-sm hover:shadow-md font-medium text-slate-700 flex items-start gap-3 group">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold text-11px flex-shrink-0 group-hover:bg-orange-200 transition-colors">
                      {idx + 1}
                    </span>
                    <span className="flex-1 pt-0.5">{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Details - Enhanced */}
            {(transaction.source_account || transaction.destination_account) && (
              <div className="bg-white rounded-xl p-5 border-2 border-slate-200 shadow-medium">
                <div className="flex items-center gap-2 text-11px font-bold text-slate-600 mb-4 uppercase tracking-wider">
                  <div className="w-1 h-4 bg-gradient-to-b from-slate-600 to-slate-700 rounded-full"></div>
                  Account Details
                </div>
                <div className="space-y-3 text-13px">
                  {transaction.source_account && (
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Source Account</div>
                      <div className="font-mono font-bold text-slate-900">{transaction.source_account}</div>
                    </div>
                  )}
                  {transaction.destination_account && (
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Destination Account</div>
                      <div className="font-mono font-bold text-slate-900">{transaction.destination_account}</div>
                    </div>
                  )}
                  {transaction.originator && (
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Originator</div>
                      <div className="font-semibold text-slate-900">{transaction.originator}</div>
                    </div>
                  )}
                  {transaction.beneficiary && (
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Beneficiary</div>
                      <div className="font-semibold text-slate-900">{transaction.beneficiary}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-3 animate-fade-in">
            <div className="text-13px text-slate-700">
              <p className="mb-4 font-semibold">Related transactions for this entity:</p>
              <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-medium">
                <table className="w-full text-12px">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                    <tr className="text-left">
                      <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-wide">Date</th>
                      <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-wide">Amount</th>
                      <th className="px-4 py-3 font-bold text-slate-700 uppercase tracking-wide">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">{transaction.transaction_date ? new Date(transaction.transaction_date).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{transaction.currency} {transaction.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{transaction.transaction_type || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-4 animate-fade-in">
            {/* Account Overview */}
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-5 border-2 border-emerald-200 shadow-medium">
              <div className="flex items-center gap-2 text-11px font-bold text-emerald-700 mb-4 uppercase tracking-wider">
                <Wallet size={16} className="text-emerald-600" />
                Account Overview
              </div>
              <div className="grid grid-cols-2 gap-4 text-13px">
                <div className="bg-white rounded-lg p-3 border border-emerald-100">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Account Number</div>
                  <div className="font-mono font-bold text-slate-900">{transaction.source_account || 'ACC-001-US'}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-emerald-100">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Account Type</div>
                  <div className="font-bold text-slate-900">Business Checking</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-emerald-100">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Current Balance</div>
                  <div className="font-bold text-emerald-700 text-16px">{transaction.currency} {(transaction.amount * 45.7).toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-emerald-100">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Account Status</div>
                  <span className="inline-flex px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 font-bold text-11px border border-emerald-300">ACTIVE</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-emerald-100">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Account Opening Date</div>
                  <div className="font-medium text-slate-900">Jan 15, 2024</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-emerald-100">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Account Holder</div>
                  <div className="font-bold text-slate-900">{alert.entity_name || transaction.customer_name}</div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl p-5 border-2 border-slate-200 shadow-medium">
              <div className="flex items-center gap-2 text-11px font-bold text-slate-600 mb-4 uppercase tracking-wider">
                <CreditCard size={16} className="text-slate-600" />
                Linked Payment Methods
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-white rounded-lg border-2 border-blue-200">
                  <div className="w-12 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center text-white font-bold text-11px shadow-md">
                    VISA
                  </div>
                  <div className="flex-1">
                    <div className="font-mono font-bold text-slate-900 text-13px">{transaction.card?.panMasked || '****1111'}</div>
                    <div className="text-11px text-slate-500">Exp: {transaction.card?.expiryDate || '12/28'}</div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-10px rounded border border-emerald-300">PRIMARY</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-12 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded flex items-center justify-center text-white font-bold text-11px shadow-md">
                    MC
                  </div>
                  <div className="flex-1">
                    <div className="font-mono font-bold text-slate-900 text-13px">**** **** **** 4532</div>
                    <div className="text-11px text-slate-500">Exp: 09/27</div>
                  </div>
                  <span className="px-2 py-1 bg-slate-200 text-slate-600 font-bold text-10px rounded">BACKUP</span>
                </div>
              </div>
            </div>

            {/* Transaction Velocity */}
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-5 border-2 border-amber-200 shadow-medium">
              <div className="flex items-center gap-2 text-11px font-bold text-amber-700 mb-4 uppercase tracking-wider">
                <TrendingUp size={16} className="text-amber-600" />
                Transaction Velocity (Last 24 Hours)
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3 border border-amber-100 text-center">
                  <div className="text-slate-500 text-10px font-bold mb-1 uppercase">Transactions</div>
                  <div className="font-bold text-amber-700 text-20px">{transaction.customerContext?.previousTransactionsLast24h || 12}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-amber-100 text-center">
                  <div className="text-slate-500 text-10px font-bold mb-1 uppercase">Total Volume</div>
                  <div className="font-bold text-amber-700 text-20px">{transaction.currency} {(transaction.amount * 4.2).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-amber-100 text-center">
                  <div className="text-slate-500 text-10px font-bold mb-1 uppercase">Avg. Ticket</div>
                  <div className="font-bold text-amber-700 text-20px">{transaction.currency} {(transaction.customerContext?.averageTicketSize || 89.50).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Recent Transaction History */}
            <div className="bg-white rounded-xl p-5 border-2 border-slate-200 shadow-medium">
              <div className="flex items-center gap-2 text-11px font-bold text-slate-600 mb-4 uppercase tracking-wider">
                <Clock size={16} className="text-slate-600" />
                Recent Transaction History (Last 7 Days)
              </div>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-12px">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr className="text-left">
                      <th className="px-3 py-2 font-bold text-slate-700 text-11px uppercase">Date</th>
                      <th className="px-3 py-2 font-bold text-slate-700 text-11px uppercase">Description</th>
                      <th className="px-3 py-2 font-bold text-slate-700 text-11px uppercase">Amount</th>
                      <th className="px-3 py-2 font-bold text-slate-700 text-11px uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2 text-slate-600">{transaction.transaction_date ? new Date(transaction.transaction_date).toLocaleDateString() : new Date().toLocaleDateString()}</td>
                      <td className="px-3 py-2 font-medium text-slate-900">{transaction.transactionDetails?.merchantName || transaction.beneficiary || 'FOOD & BEVERAGE OUTLET'}</td>
                      <td className="px-3 py-2 font-bold text-red-600">-{transaction.currency} {transaction.amount.toLocaleString()}</td>
                      <td className="px-3 py-2"><span className="px-2 py-1 bg-amber-100 text-amber-700 font-bold text-10px rounded">FLAGGED</span></td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2 text-slate-600">{new Date(Date.now() - 86400000).toLocaleDateString()}</td>
                      <td className="px-3 py-2 font-medium text-slate-900">Online Purchase - Tech Store</td>
                      <td className="px-3 py-2 font-bold text-red-600">-{transaction.currency} {(transaction.amount * 0.6).toLocaleString()}</td>
                      <td className="px-3 py-2"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-10px rounded">CLEARED</span></td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2 text-slate-600">{new Date(Date.now() - 172800000).toLocaleDateString()}</td>
                      <td className="px-3 py-2 font-medium text-slate-900">Salary Deposit</td>
                      <td className="px-3 py-2 font-bold text-emerald-600">+{transaction.currency} {(transaction.amount * 12).toLocaleString()}</td>
                      <td className="px-3 py-2"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-10px rounded">CLEARED</span></td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2 text-slate-600">{new Date(Date.now() - 259200000).toLocaleDateString()}</td>
                      <td className="px-3 py-2 font-medium text-slate-900">Grocery Store</td>
                      <td className="px-3 py-2 font-bold text-red-600">-{transaction.currency} {(transaction.amount * 0.45).toLocaleString()}</td>
                      <td className="px-3 py-2"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-10px rounded">CLEARED</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2 text-slate-600">{new Date(Date.now() - 345600000).toLocaleDateString()}</td>
                      <td className="px-3 py-2 font-medium text-slate-900">Gas Station</td>
                      <td className="px-3 py-2 font-bold text-red-600">-{transaction.currency} {(transaction.amount * 0.22).toLocaleString()}</td>
                      <td className="px-3 py-2"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-10px rounded">CLEARED</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Linked Accounts */}
            <div className="bg-white rounded-xl p-5 border-2 border-slate-200 shadow-medium">
              <div className="flex items-center gap-2 text-11px font-bold text-slate-600 mb-4 uppercase tracking-wider">
                <Building2 size={16} className="text-slate-600" />
                Linked Accounts
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-13px">{transaction.source_account || 'ACC-001-US'}</div>
                    <div className="text-11px text-slate-500">Business Checking - Primary</div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-10px rounded border border-emerald-300">ACTIVE</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-13px">ACC-002-US</div>
                    <div className="text-11px text-slate-500">Savings Account</div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-10px rounded border border-emerald-300">ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'kyc' && (
          <div className="space-y-4 animate-fade-in">
            {/* Identity Verification */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border-2 border-blue-200 shadow-medium">
              <div className="flex items-center gap-2 text-11px font-bold text-blue-700 mb-4 uppercase tracking-wider">
                <Shield size={16} className="text-blue-600" />
                Identity Verification Status
              </div>
              <div className="grid grid-cols-2 gap-4 text-13px">
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">KYC Status</div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-600" />
                    <span className="font-bold text-emerald-700">VERIFIED</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Verification Date</div>
                  <div className="font-medium text-slate-900">Jan 15, 2024</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Customer Tier</div>
                  <span className="inline-flex px-2 py-1 rounded-md bg-blue-100 text-blue-700 font-bold text-11px border border-blue-300">TIER 2 - ENHANCED</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Risk Rating</div>
                  <span className="inline-flex px-2 py-1 rounded-md bg-amber-100 text-amber-700 font-bold text-11px border border-amber-300">MEDIUM RISK</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Customer ID</div>
                  <div className="font-mono font-bold text-slate-900">{transaction.customer_id}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Last Review Date</div>
                  <div className="font-medium text-slate-900">Jan 10, 2026</div>
                </div>
              </div>
            </div>

            {/* Document Verification */}
            <div className="bg-white rounded-xl p-5 border-2 border-slate-200 shadow-medium">
              <div className="flex items-center gap-2 text-11px font-bold text-slate-600 mb-4 uppercase tracking-wider">
                <FileCheck size={16} className="text-slate-600" />
                Document Verification
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-900 text-13px">Government-Issued ID</div>
                      <div className="text-11px text-slate-500">Driver's License</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-600" />
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-10px rounded border border-emerald-300">VERIFIED</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-900 text-13px">Proof of Address</div>
                      <div className="text-11px text-slate-500">Utility Bill (Dec 2025)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-600" />
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-10px rounded border border-emerald-300">VERIFIED</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-900 text-13px">Source of Funds</div>
                      <div className="text-11px text-slate-500">Employment Letter</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-600" />
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-10px rounded border border-emerald-300">VERIFIED</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-amber-600" />
                    <div>
                      <div className="font-bold text-slate-900 text-13px">Tax Identification</div>
                      <div className="text-11px text-slate-500">SSN / Tax ID</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-amber-600" />
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 font-bold text-10px rounded border border-amber-300">PENDING RENEWAL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Checks */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border-2 border-purple-200 shadow-medium">
              <div className="flex items-center gap-2 text-11px font-bold text-purple-700 mb-4 uppercase tracking-wider">
                <Lock size={16} className="text-purple-600" />
                Compliance & Screening
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100">
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-purple-600" />
                    <div>
                      <div className="font-bold text-slate-900 text-13px">PEP Screening</div>
                      <div className="text-11px text-slate-500">Politically Exposed Person Check</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-600" />
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-10px rounded border border-emerald-300">CLEAR</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={18} className="text-purple-600" />
                    <div>
                      <div className="font-bold text-slate-900 text-13px">Sanctions Screening</div>
                      <div className="text-11px text-slate-500">OFAC, UN, EU Sanctions Lists</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-600" />
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-10px rounded border border-emerald-300">CLEAR</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100">
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-purple-600" />
                    <div>
                      <div className="font-bold text-slate-900 text-13px">Adverse Media Check</div>
                      <div className="text-11px text-slate-500">Negative News Screening</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-600" />
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-10px rounded border border-emerald-300">CLEAR</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100">
                  <div className="flex items-center gap-3">
                    <FileCheck size={18} className="text-purple-600" />
                    <div>
                      <div className="font-bold text-slate-900 text-13px">AML Watchlist</div>
                      <div className="text-11px text-slate-500">Anti-Money Laundering Database</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-600" />
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold text-10px rounded border border-emerald-300">CLEAR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Profile */}
            <div className="bg-white rounded-xl p-5 border-2 border-slate-200 shadow-medium">
              <div className="flex items-center gap-2 text-11px font-bold text-slate-600 mb-4 uppercase tracking-wider">
                <User size={16} className="text-slate-600" />
                Customer Profile
              </div>
              <div className="grid grid-cols-2 gap-4 text-13px">
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Full Name</div>
                  <div className="font-bold text-slate-900">{alert.entity_name || transaction.customer_name}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Date of Birth</div>
                  <div className="font-medium text-slate-900">May 12, 1985</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Nationality</div>
                  <div className="font-medium text-slate-900">United States</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Occupation</div>
                  <div className="font-medium text-slate-900">Business Owner</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Residential Address</div>
                  <div className="font-medium text-slate-900 text-12px">
                    {transaction.transactionDetails?.merchantLocation.city || 'San Francisco'}, {transaction.transactionDetails?.merchantLocation.state || 'CA'}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Contact Number</div>
                  <div className="font-mono font-medium text-slate-900">+1 (555) 123-4567</div>
                </div>
              </div>
            </div>

            {/* Enhanced Due Diligence Notes */}
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-5 border-2 border-orange-200 shadow-medium">
              <div className="flex items-center gap-2 text-11px font-bold text-orange-700 mb-4 uppercase tracking-wider">
                <AlertCircle size={16} className="text-orange-600" />
                Enhanced Due Diligence Notes
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-lg border border-orange-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-11px font-bold text-slate-500">JAN 10, 2026</div>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold text-9px rounded">ANNUAL REVIEW</span>
                  </div>
                  <div className="text-12px text-slate-700 leading-relaxed">
                    Annual KYC review completed. All documents verified and up to date. Customer business remains consistent with original profile.
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-orange-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-11px font-bold text-slate-500">JAN 15, 2024</div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold text-9px rounded">ONBOARDING</span>
                  </div>
                  <div className="text-12px text-slate-700 leading-relaxed">
                    Initial KYC verification completed successfully. All required documents submitted and verified. Customer approved for Tier 2 services.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-3 animate-fade-in">
            <div className="text-13px">
              <div className="bg-white rounded-xl p-5 border-2 border-slate-200 space-y-4 shadow-medium">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 mt-1.5 flex-shrink-0 shadow-md"></div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-14px mb-1">Alert Created</div>
                    <div className="text-12px text-slate-600 mb-2">{new Date(alert.created_at).toLocaleString()}</div>
                    <div className="text-12px bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-200 font-medium">
                      System detected {alert.rule_ids.length} rule violation{alert.rule_ids.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                {alert.assigned_to && (
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 mt-1.5 flex-shrink-0 shadow-md"></div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 text-14px mb-1">Assigned</div>
                      <div className="text-12px text-slate-600 mb-2">{new Date(alert.created_at).toLocaleString()}</div>
                      <div className="text-12px bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg border border-emerald-200 font-medium">
                        Assigned to {alert.assigned_to}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 mt-1.5 flex-shrink-0 shadow-md"></div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 text-14px mb-1">Current Status: {alert.status}</div>
                    <div className="text-12px text-slate-600">{new Date(alert.created_at).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && selectedAction && (
        <div className="fixed inset-0 z-[200] bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-strong overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${
              selectedAction.color === 'emerald' ? 'from-emerald-600 to-emerald-700' :
              selectedAction.color === 'red' ? 'from-red-600 to-red-700' :
              selectedAction.color === 'amber' ? 'from-amber-600 to-amber-700' :
              selectedAction.color === 'orange' ? 'from-orange-600 to-orange-700' :
              selectedAction.color === 'blue' ? 'from-blue-600 to-blue-700' :
              'from-slate-600 to-slate-700'
            } text-white px-6 py-5 border-b-2 border-opacity-50`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
                  <selectedAction.icon size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-20px font-bold">Confirm Action</h3>
                  <p className="text-13px opacity-90 mt-1">{selectedAction.label}</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Alert Info Summary */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6 border-2 border-slate-200">
                <div className="grid grid-cols-2 gap-4 text-13px">
                  <div>
                    <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Alert ID</div>
                    <div className="font-bold text-slate-900">{alert.alert_id}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Entity</div>
                    <div className="font-bold text-slate-900">{alert.entity_name || alert.transaction.customer_name}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">Current Status</div>
                    <div className="font-bold text-slate-900">{alert.status}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-11px font-bold mb-1 uppercase tracking-wide">New Status</div>
                    <div className={`font-bold ${
                      selectedAction.color === 'emerald' ? 'text-emerald-700' :
                      selectedAction.color === 'red' ? 'text-red-700' :
                      selectedAction.color === 'amber' ? 'text-amber-700' :
                      selectedAction.color === 'orange' ? 'text-orange-700' :
                      selectedAction.color === 'blue' ? 'text-blue-700' :
                      'text-slate-700'
                    }`}>{selectedAction.status}</div>
                  </div>
                </div>
              </div>

              {/* Analyst Comments - Mandatory */}
              <div className="mb-6">
                <label className="block mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-14px font-bold text-slate-900">Analyst Comments</span>
                    <span className="text-11px font-bold text-red-600 uppercase tracking-wide bg-red-50 px-2 py-0.5 rounded border border-red-200">Required</span>
                  </div>
                  <textarea
                    value={analystComments}
                    onChange={(e) => setAnalystComments(e.target.value)}
                    placeholder="Enter your investigation notes and reasoning for this action..."
                    className="w-full h-32 px-4 py-3 border-2 border-slate-300 rounded-lg text-13px focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none placeholder:text-slate-400"
                    autoFocus
                  />
                </label>
                <div className="flex items-center gap-2 text-11px text-slate-600">
                  <FileText size={14} className="text-slate-400" />
                  <span>
                    {analystComments.length} characters
                    {analystComments.trim().length === 0 && (
                      <span className="text-red-600 font-bold ml-2">• Comments are required to proceed</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={confirmAction}
                  disabled={!analystComments.trim()}
                  className={`flex-1 py-3 px-6 rounded-lg font-bold text-14px transition-all ${
                    analystComments.trim()
                      ? `${
                          selectedAction.color === 'emerald' ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800' :
                          selectedAction.color === 'red' ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' :
                          selectedAction.color === 'amber' ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800' :
                          selectedAction.color === 'orange' ? 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800' :
                          selectedAction.color === 'blue' ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' :
                          'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800'
                        } text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95`
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircleIcon size={18} />
                    Confirm & Submit
                  </div>
                </button>
                <button
                  onClick={cancelAction}
                  className="px-6 py-3 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-bold text-14px hover:bg-slate-50 hover:border-slate-400 transition-all hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
              </div>

              {/* Warning Notice */}
              {analystComments.trim() && (
                <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-lg p-3 flex items-start gap-3">
                  <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-12px text-blue-800">
                    <div className="font-bold mb-1">Action will be recorded</div>
                    <div>This action and your comments will be logged in the audit trail and cannot be undone.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertDetail;
