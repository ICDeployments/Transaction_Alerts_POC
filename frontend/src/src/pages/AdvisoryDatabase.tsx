import React, { useState } from 'react';
import { Database, Download, Search, Filter, ChevronDown, ChevronUp, Clock, User, TrendingUp, FileText, AlertCircle, Sparkles, ArrowLeft, Table, List } from 'lucide-react';
import type { AdvisoryRecord } from '../types/advisoryDb';

interface AdvisoryDatabaseProps {
  records: AdvisoryRecord[];
  onBack: () => void;
}

const AdvisoryDatabase: React.FC<AdvisoryDatabaseProps> = ({ records, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.alert_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.alert_details.entity_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.alert_details.customer_id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      record.alert_details.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const exportToJSON = () => {
    const dataStr = JSON.stringify(records, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `advisory_db_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const toggleExpand = (recordId: string) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'closed': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'escalated': return 'bg-red-100 text-red-700 border-red-300';
      case 'in review': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'open': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white px-6 py-5 shadow-strong">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              title="Back to Alerts"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
                <Database size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-22px font-bold">Advisory Database</h1>
                <p className="text-13px text-slate-300 mt-1">Investigation records for SLM training • Session-based storage</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border-2 border-slate-200">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-md font-bold text-12px flex items-center gap-2 transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List size={16} />
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-md font-bold text-12px flex items-center gap-2 transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table size={16} />
                Table
              </button>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg border border-white border-opacity-30">
              <div className="text-11px text-slate-300 uppercase tracking-wide font-bold">Total Records</div>
              <div className="text-24px font-bold">{records.length}</div>
            </div>
            <button
              onClick={exportToJSON}
              disabled={records.length === 0}
              className={`px-4 py-2.5 rounded-lg font-bold text-13px flex items-center gap-2 transition-all ${
                records.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg hover:scale-105'
                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Download size={16} />
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border-b-2 border-slate-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 flex items-center bg-slate-50 border-2 border-slate-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
            <Search size={18} className="text-slate-400 ml-4" />
            <input
              type="text"
              placeholder="Search by Alert ID, Entity Name, or Customer ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-13px bg-transparent focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border-2 border-slate-200 rounded-lg text-13px font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in review">In Review</option>
              <option value="escalated">Escalated</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="text-13px text-slate-600 font-semibold">
            Showing {filteredRecords.length} of {records.length} records
          </div>
        </div>
      </div>

      {/* Records List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
              <Database size={48} className="text-slate-400" />
            </div>
            <h3 className="text-20px font-bold text-slate-900 mb-2">
              {records.length === 0 ? 'No Records Yet' : 'No Matching Records'}
            </h3>
            <p className="text-14px text-slate-600 text-center max-w-md">
              {records.length === 0 
                ? 'Investigation records will appear here after you complete actions on alerts. All data is stored per session and will reset on refresh.'
                : 'Try adjusting your search or filter criteria to find records.'
              }
            </p>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View - DDB Style */
          <div className="bg-white rounded-xl border-2 border-slate-200 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-13px">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-11px">Alert ID</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-11px">Entity</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-11px">Risk</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-11px">Status</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-11px">AI Recommendation</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-11px">Analyst Feedback</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-11px">Final Action</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-11px">Resolution Time</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-11px">Tabs Visited</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-11px">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.map((record) => (
                    <tr key={record.record_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-blue-700">{record.alert_id}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{record.alert_details.entity_name}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-11px font-bold ${
                          record.alert_details.risk_score >= 75 ? 'bg-red-100 text-red-700' :
                          record.alert_details.risk_score >= 50 ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {record.alert_details.risk_score}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full border text-11px font-bold ${getStatusColor(record.alert_details.status)}`}>
                          {record.alert_details.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {record.ai_analysis.recommendation ? (
                          <div>
                            <div className="font-bold text-slate-900">{record.ai_analysis.recommendation}</div>
                            {record.ai_analysis.confidence_score && (
                              <div className="text-11px text-slate-600">Confidence: {(record.ai_analysis.confidence_score * 100).toFixed(0)}%</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {record.analyst_ai_feedback ? (
                          <div>
                            <div className={`font-bold ${record.analyst_ai_feedback.agreed_with_ai ? 'text-emerald-700' : 'text-red-700'}`}>
                              {record.analyst_ai_feedback.agreed_with_ai ? '✓ Agreed' : '✗ Disagreed'}
                            </div>
                            {record.analyst_ai_feedback.feedback_text && (
                              <div className="text-11px text-slate-600 truncate max-w-xs">{record.analyst_ai_feedback.feedback_text}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">No feedback</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{record.final_decision.action_taken}</div>
                        <div className="text-11px text-slate-600">{record.final_decision.final_status}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {record.final_decision.resolution_time_minutes}m
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {record.session_metadata.tabs_visited.slice(0, 3).map((tab, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-10px font-bold">
                              {tab}
                            </span>
                          ))}
                          {record.session_metadata.tabs_visited.length > 3 && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-10px font-bold">
                              +{record.session_metadata.tabs_visited.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleExpand(record.record_id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-11px font-bold transition-all hover:scale-105"
                        >
                          {expandedRecord === record.record_id ? 'Collapse' : 'Expand'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Expanded Details in Table View */}
            {expandedRecord && filteredRecords.find(r => r.record_id === expandedRecord) && (
              <div className="border-t-4 border-blue-500 bg-slate-50 p-6">
                {(() => {
                  const record = filteredRecords.find(r => r.record_id === expandedRecord)!;
                  return (
                    <div className="grid grid-cols-3 gap-6">
                      {/* AI Analysis Details */}
                      {record.ai_analysis && (record.ai_analysis.implied_risks || record.ai_analysis.analyst_considerations) && (
                        <div className="bg-white rounded-lg border-2 border-slate-200 p-4">
                          <h4 className="text-13px font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <Sparkles size={16} className="text-blue-600" />
                            AI Analysis Details
                          </h4>
                          {record.ai_analysis.implied_risks && record.ai_analysis.implied_risks.length > 0 && (
                            <div className="mb-4">
                              <div className="text-11px font-bold text-red-700 uppercase tracking-wide mb-2">Implied Risks</div>
                              <ul className="space-y-1 text-12px">
                                {record.ai_analysis.implied_risks.map((risk, idx) => (
                                  <li key={idx} className="text-slate-700 flex items-start gap-2">
                                    <span className="text-red-600 font-bold">•</span>
                                    <span>{risk}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {record.ai_analysis.analyst_considerations && record.ai_analysis.analyst_considerations.length > 0 && (
                            <div>
                              <div className="text-11px font-bold text-blue-700 uppercase tracking-wide mb-2">Considerations</div>
                              <ul className="space-y-1 text-12px">
                                {record.ai_analysis.analyst_considerations.map((consideration, idx) => (
                                  <li key={idx} className="text-slate-700 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold">✓</span>
                                    <span>{consideration}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Transaction Details */}
                      <div className="bg-white rounded-lg border-2 border-slate-200 p-4">
                        <h4 className="text-13px font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <FileText size={16} className="text-green-600" />
                          Transaction Details
                        </h4>
                        <div className="space-y-2 text-12px">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Amount:</span>
                            <span className="font-bold text-slate-900">{record.transaction_details.currency} {record.transaction_details.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Type:</span>
                            <span className="text-slate-900">{record.transaction_details.transaction_type}</span>
                          </div>
                          {record.transaction_details.merchant_name && (
                            <div className="flex justify-between">
                              <span className="text-slate-600">Merchant:</span>
                              <span className="text-slate-900">{record.transaction_details.merchant_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Analyst Actions */}
                      <div className="bg-white rounded-lg border-2 border-slate-200 p-4">
                        <h4 className="text-13px font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <User size={16} className="text-purple-600" />
                          Analyst Actions
                        </h4>
                        <div className="space-y-3">
                          {record.analyst_actions.map((action, idx) => (
                            <div key={idx} className="border-l-4 border-blue-500 pl-3">
                              <div className="text-12px font-bold text-slate-900">{action.action_label}</div>
                              {action.comments && (
                                <div className="text-11px text-slate-600 mt-1">{action.comments}</div>
                              )}
                              <div className="text-10px text-slate-500 mt-1">{new Date(action.timestamp).toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : (
          /* Card View - Original */
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div
                key={record.record_id}
                className="bg-white rounded-xl border-2 border-slate-200 shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Record Header - Compact View */}
                <div
                  className="p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleExpand(record.record_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                      {/* Alert ID & Risk Score */}
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-lg flex items-center justify-center font-bold text-18px shadow-md ${
                          record.alert_details.risk_score >= 75 ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' :
                          record.alert_details.risk_score >= 50 ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' :
                          'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                        }`}>
                          {record.alert_details.risk_score}
                        </div>
                        <div>
                          <div className="text-12px font-bold text-blue-600 mb-1">{record.alert_id}</div>
                          <div className="text-14px font-bold text-slate-900">{record.alert_details.entity_name}</div>
                        </div>
                      </div>

                      {/* Status & Type */}
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-11px font-bold uppercase tracking-wide border ${getStatusColor(record.alert_details.status)}`}>
                          {record.alert_details.status}
                        </span>
                        <span className="text-12px text-slate-600 font-medium">{record.alert_details.alert_type}</span>
                      </div>

                      {/* Transaction Amount */}
                      <div className="text-right">
                        <div className="text-11px text-slate-500 uppercase tracking-wide font-bold mb-1">Amount</div>
                        <div className="text-14px font-bold text-purple-700">
                          {record.transaction_details.currency} {record.transaction_details.amount.toLocaleString()}
                        </div>
                      </div>

                      {/* Actions Count */}
                      <div className="text-center">
                        <div className="text-11px text-slate-500 uppercase tracking-wide font-bold mb-1">Actions</div>
                        <div className="text-14px font-bold text-slate-900">{record.analyst_actions.length}</div>
                      </div>

                      {/* Time Spent */}
                      <div className="text-center">
                        <div className="text-11px text-slate-500 uppercase tracking-wide font-bold mb-1">Time</div>
                        <div className="text-14px font-bold text-slate-900">
                          {Math.floor(record.session_metadata.time_spent_seconds / 60)}m
                        </div>
                      </div>
                    </div>

                    {/* Expand Button */}
                    <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                      {expandedRecord === record.record_id ? (
                        <ChevronUp size={18} className="text-slate-600" />
                      ) : (
                        <ChevronDown size={18} className="text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRecord === record.record_id && (
                  <div className="border-t-2 border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-6 animate-slide-down">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        {/* Alert Details */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                          <h4 className="text-13px font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <AlertCircle size={16} className="text-blue-600" />
                            Alert Details
                          </h4>
                          <div className="space-y-2 text-12px">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Customer ID:</span>
                              <span className="font-mono font-bold text-slate-900">{record.alert_details.customer_id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Severity:</span>
                              <span className="font-bold text-slate-900">{record.alert_details.severity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Age:</span>
                              <span className="font-bold text-slate-900">{record.alert_details.age_days} days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Assigned To:</span>
                              <span className="font-bold text-slate-900">{record.alert_details.assigned_to || 'Unassigned'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                          <h4 className="text-13px font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <FileText size={16} className="text-purple-600" />
                            Transaction Details
                          </h4>
                          <div className="space-y-2 text-12px">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Transaction ID:</span>
                              <span className="font-mono text-slate-900">{record.transaction_details.transaction_id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Type:</span>
                              <span className="font-bold text-slate-900">{record.transaction_details.transaction_type || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Channel:</span>
                              <span className="font-bold text-slate-900">{record.transaction_details.channel || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Destination:</span>
                              <span className="font-bold text-slate-900">{record.transaction_details.destination_country || 'N/A'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Triggered Rules */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                          <h4 className="text-13px font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <TrendingUp size={16} className="text-orange-600" />
                            Triggered Rules ({record.alert_details.triggered_rules.length})
                          </h4>
                          <div className="space-y-2">
                            {record.alert_details.triggered_rules.map((rule, idx) => (
                              <div key={idx} className="text-11px bg-orange-50 text-orange-800 px-3 py-2 rounded border border-orange-200 font-medium">
                                {idx + 1}. {rule}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-4">
                        {/* AI Analysis */}
                        {record.ai_analysis.recommendation && (
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
                            <h4 className="text-13px font-bold text-slate-900 mb-3 flex items-center gap-2">
                              <Sparkles size={16} className="text-blue-600" />
                              AI Analysis
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <div className="text-11px text-slate-600 font-bold mb-1 uppercase tracking-wide">Recommendation</div>
                                <div className="text-12px font-bold text-blue-900">{record.ai_analysis.recommendation}</div>
                              </div>
                              {record.ai_analysis.confidence_score && (
                                <div>
                                  <div className="text-11px text-slate-600 font-bold mb-1 uppercase tracking-wide">Confidence</div>
                                  <div className="text-12px font-bold text-blue-900">{record.ai_analysis.confidence_score}%</div>
                                </div>
                              )}
                              {record.ai_analysis.analysis_text && (
                                <div>
                                  <div className="text-11px text-slate-600 font-bold mb-1 uppercase tracking-wide">Analysis</div>
                                  <div className="text-12px text-slate-700 leading-relaxed">{record.ai_analysis.analysis_text}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Analyst Actions */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                          <h4 className="text-13px font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <User size={16} className="text-green-600" />
                            Analyst Actions ({record.analyst_actions.length})
                          </h4>
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {record.analyst_actions.map((action, idx) => (
                              <div key={idx} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`text-11px font-bold uppercase tracking-wide px-2 py-1 rounded ${getStatusColor(action.new_status)}`}>
                                    {action.action_label}
                                  </span>
                                  <span className="text-10px text-slate-500">
                                    {new Date(action.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-12px text-slate-700 italic bg-white p-2 rounded border border-slate-200">
                                  "{action.comments}"
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Session Metadata */}
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                          <h4 className="text-13px font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <Clock size={16} className="text-slate-600" />
                            Session Metadata
                          </h4>
                          <div className="space-y-2 text-12px">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Tabs Visited:</span>
                              <span className="font-bold text-slate-900">{record.session_metadata.tabs_visited.join(', ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">View Count:</span>
                              <span className="font-bold text-slate-900">{record.session_metadata.view_count}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Time Spent:</span>
                              <span className="font-bold text-slate-900">
                                {Math.floor(record.session_metadata.time_spent_seconds / 60)}m {record.session_metadata.time_spent_seconds % 60}s
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Started:</span>
                              <span className="text-slate-900">{new Date(record.investigation_started_at).toLocaleString()}</span>
                            </div>
                            {record.investigation_completed_at && (
                              <div className="flex justify-between">
                                <span className="text-slate-600">Completed:</span>
                                <span className="text-slate-900">{new Date(record.investigation_completed_at).toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvisoryDatabase;
