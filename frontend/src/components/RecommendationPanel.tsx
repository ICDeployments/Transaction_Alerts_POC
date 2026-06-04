import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Sparkles, AlertTriangle, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import type { Alert, ActionDecision, FraudAnalysis } from '../types';

interface RecommendationPanelProps {
  alert: Alert;
  onDecision: (decision: ActionDecision) => void;
  aiAnalysisCache: Record<string, any>;
  setAiAnalysisCache: (cache: Record<string, any>) => void;
}

const RecommendationPanel = ({ alert, onDecision, aiAnalysisCache }: RecommendationPanelProps) => {
  const [analystNotes, setAnalystNotes] = useState('');
  const [selectedDecision, setSelectedDecision] = useState<'Accept' | 'Reject' | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<FraudAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedConsiderations, setExpandedConsiderations] = useState<Set<number>>(new Set());

  // Load AI analysis from cache (API call is now handled in App.tsx)
  useEffect(() => {
    const alertId = alert.alert_id;
    
    // Check if we have cached analysis for this alert
    if (aiAnalysisCache[alertId]) {
      console.log(`Loading cached AI analysis for alert: ${alertId}`);
      setAiAnalysis(aiAnalysisCache[alertId].analysis);
      setError(aiAnalysisCache[alertId].error || null);
      // All considerations are collapsed by default
      setExpandedConsiderations(new Set());
    } else {
      // Reset state if switching to an alert without cached data yet
      setAiAnalysis(null);
      setError(null);
      setExpandedConsiderations(new Set());
    }
  }, [alert.alert_id, aiAnalysisCache]);

  const toggleConsideration = (index: number) => {
    setExpandedConsiderations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSubmit = (decision: 'Accept' | 'Reject') => {
    const recommendation = aiAnalysis?.recommended_action || getRecommendation().action;
    
    const actionDecision: ActionDecision = {
      alert_id: alert.alert_id,
      decision,
      recommendation,
      analyst_notes: analystNotes.trim() || undefined,
      timestamp: new Date().toISOString(),
    };
    
    onDecision(actionDecision);
    setSelectedDecision(decision);
    
    // Reset after animation completes
    setTimeout(() => {
      setAnalystNotes('');
      setSelectedDecision(null);
    }, 3000);
  };

  const getRecommendation = () => {
    const riskScore = alert.risk_score || 0;
    const severity = alert.severity;

    if (riskScore >= 75 || severity === 'Critical' || severity === 'High') {
      return {
        action: 'Escalate',
        reason: 'High risk score and/or critical severity indicates potential fraud',
        color: 'text-red-700',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    } else if (riskScore >= 50 || severity === 'Medium') {
      return {
        action: 'Investigate Further',
        reason: 'Medium risk requires additional investigation',
        color: 'text-amber-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
      };
    } else {
      return {
        action: 'Close',
        reason: 'Low risk score suggests legitimate transaction',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
      };
    }
  };

  // Get display recommendation (AI if available, fallback otherwise)
  const getDisplayRecommendation = () => {
    const fallback = getRecommendation();
    
    if (!aiAnalysis) return fallback;

    const action = aiAnalysis.recommended_action;
    let color = fallback.color;
    let bgColor = fallback.bgColor;
    let borderColor = fallback.borderColor;

    if (action === 'Escalate') {
      color = 'text-red-700';
      bgColor = 'bg-red-50';
      borderColor = 'border-red-200';
    } else if (action === 'Investigate Further') {
      color = 'text-amber-700';
      bgColor = 'bg-amber-50';
      borderColor = 'border-amber-200';
    } else if (action === 'Close') {
      color = 'text-emerald-700';
      bgColor = 'bg-emerald-50';
      borderColor = 'border-emerald-200';
    }

    return {
      action,
      reason: aiAnalysis.risk_explanation,
      color,
      bgColor,
      borderColor,
    };
  };

  const recommendation = getDisplayRecommendation();
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="overflow-y-auto flex-1">
        <div className="p-6 space-y-5">
          {/* Error State - Enhanced */}
          {error && (
            <div className="p-5 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl shadow-medium">
              <div className="flex items-center gap-3 text-14px text-yellow-900">
                <AlertTriangle size={24} className="text-yellow-600 flex-shrink-0" />
                <div>
                  <div className="font-bold mb-1">Attention Required</div>
                  <div className="text-13px text-yellow-800">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* AI Recommendation Card - Premium Design */}
          <div className={`p-6 rounded-xl border-2 shadow-strong transition-all hover:shadow-glow-blue ${recommendation.bgColor} ${recommendation.borderColor}`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-glow-blue">
                {aiAnalysis ? <Sparkles size={32} /> : <AlertTriangle size={32} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-11px text-slate-500 font-bold uppercase tracking-widest mb-3">
                  {aiAnalysis ? (
                    <>
                      <CheckCircle size={16} className="text-emerald-600" />
                      Intelligent Analysis
                    </>
                  ) : (
                    'Quick Assessment'
                  )}
                </div>
                <div className={`text-22px font-bold ${recommendation.color} mb-4 tracking-tight`}>
                  {recommendation.action}
                </div>
                <div className="text-14px text-slate-700 leading-relaxed font-medium">
                  {recommendation.reason}
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis Details - Only show if AI analysis is available */}
          {aiAnalysis && (
            <div className="space-y-4 animate-fade-in">
              {/* Analyst Considerations - Expandable Design with Always-Visible Supporting Data */}
              {aiAnalysis.analyst_considerations && aiAnalysis.analyst_considerations.length > 0 && (
                <div className="bg-white rounded-xl border-2 border-blue-200 p-5 shadow-medium hover:shadow-strong transition-shadow">
                  <div className="flex items-center gap-2 text-13px font-bold text-blue-700 mb-4 uppercase tracking-wider">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <CheckCircle size={20} className="text-blue-600" />
                    </div>
                    Key Considerations
                    <span className="ml-auto bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-12px font-bold">
                      {aiAnalysis.analyst_considerations.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {aiAnalysis.analyst_considerations.map((item, idx) => {
                      const isExpanded = expandedConsiderations.has(idx);
                      const hasChildren = item.children && item.children.length > 0;
                      
                      return (
                        <div key={idx} className="bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-blue-100 overflow-hidden transition-all hover:border-blue-300 hover:shadow-md">
                          {/* Main Consideration - Clickable Header */}
                          <button
                            onClick={() => toggleConsideration(idx)}
                            className="w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-blue-50"
                          >
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-13px flex-shrink-0 shadow-sm mt-0.5">
                              ✓
                            </span>
                            <span className="flex-1 font-semibold text-slate-800 text-14px pt-0.5">
                              {item.consideration}
                            </span>
                            {hasChildren && (
                              <div className="flex-shrink-0 mt-0.5">
                                {isExpanded ? (
                                  <ChevronDown size={20} className="text-blue-600 transition-transform" />
                                ) : (
                                  <ChevronRight size={20} className="text-blue-400 transition-transform" />
                                )}
                              </div>
                            )}
                          </button>
                          
                          {/* Supporting Data - Expandable Section */}
                          {hasChildren && isExpanded && (
                            <div className="px-4 pb-4 animate-fade-in">
                              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg p-4 border-2 border-slate-700 shadow-inner">
                                <div className="flex items-center gap-2 text-11px font-bold text-blue-400 mb-3 uppercase tracking-wider">
                                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  Supporting Data
                                  <span className="ml-auto bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full text-10px font-bold">
                                    {item.children.length} items
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  {item.children.map((child, childIdx) => (
                                    <div key={childIdx} className="flex items-start gap-2 bg-slate-700/40 p-3 rounded-lg border border-slate-600/50 hover:bg-slate-700/60 hover:border-slate-500 transition-all">
                                      <span className="text-blue-400 font-bold flex-shrink-0 mt-0.5 text-15px">•</span>
                                      <span className="flex-1 text-slate-200 text-13px leading-relaxed">{child}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Child Count Indicator (when collapsed) */}
                          {hasChildren && !isExpanded && (
                            <div className="px-4 pb-3">
                              <div className="text-11px text-slate-500 font-medium flex items-center gap-2">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">
                                  {item.children.length} supporting data point{item.children.length !== 1 ? 's' : ''}
                                </span>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analyst Notes - Enhanced */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-5 shadow-medium">
            <label className="flex items-center gap-2 text-14px font-bold text-slate-700 mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <MessageSquare size={20} className="text-slate-600" />
              </div>
              Analyst Notes
            </label>
            <textarea
              value={analystNotes}
              onChange={(e) => setAnalystNotes(e.target.value)}
              placeholder="Add your detailed analysis and decision rationale here..."
              className="w-full px-4 py-3 text-14px border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all font-medium placeholder:text-slate-400"
              rows={4}
            />
          </div>

          {/* Action Buttons - Premium Design */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => handleSubmit('Accept')}
              disabled={selectedDecision !== null}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-15px transition-all ${
                selectedDecision === 'Accept'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-glow-green scale-105'
                  : selectedDecision === 'Reject'
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 shadow-strong hover:shadow-glow-green hover:scale-105 active:scale-95'
              }`}
            >
              <ThumbsUp size={22} />
              Accept Analysis
            </button>
            <button
              onClick={() => handleSubmit('Reject')}
              disabled={selectedDecision !== null}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-15px transition-all ${
                selectedDecision === 'Reject'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-glow-red scale-105'
                  : selectedDecision === 'Accept'
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-strong hover:shadow-glow-red hover:scale-105 active:scale-95'
              }`}
            >
              <ThumbsDown size={22} />
              Reject Analysis
            </button>
          </div>

          {/* Confirmation Message - Enhanced with Animation */}
          {selectedDecision && (
            <div className={`text-center text-14px font-bold py-5 px-6 rounded-xl shadow-glow-blue animate-bounce-in ${
              selectedDecision === 'Accept' 
                ? 'bg-gradient-to-r from-emerald-100 via-emerald-50 to-emerald-100 text-emerald-700 border-2 border-emerald-300' 
                : 'bg-gradient-to-r from-red-100 via-red-50 to-red-100 text-red-700 border-2 border-red-300'
            }`}>
              <div className="flex items-center justify-center gap-3">
                <span className={`text-24px animate-pulse ${selectedDecision === 'Accept' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {selectedDecision === 'Accept' ? '✓' : '✗'}
                </span>
                <div>
                  <div className="text-16px font-bold mb-1">
                    Feedback Recorded Successfully
                  </div>
                  <div className="text-13px opacity-90">
                    You {selectedDecision === 'Accept' ? 'agreed' : 'disagreed'} with the AI recommendation
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationPanel;
