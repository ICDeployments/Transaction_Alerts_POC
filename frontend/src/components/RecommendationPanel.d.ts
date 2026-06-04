import type { Alert, ActionDecision } from '../types';
interface RecommendationPanelProps {
    alert: Alert;
    onDecision: (decision: ActionDecision) => void;
    aiAnalysisCache: Record<string, any>;
    setAiAnalysisCache: (cache: Record<string, any>) => void;
}
declare const RecommendationPanel: ({ alert, onDecision, aiAnalysisCache }: RecommendationPanelProps) => import("react").JSX.Element;
export default RecommendationPanel;
//# sourceMappingURL=RecommendationPanel.d.ts.map