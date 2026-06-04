import React from 'react';
import type { Alert } from '../types';
interface AlertDetailProps {
    alert: Alert;
    onStatusChange?: (alertId: string, newStatus: string, action: string, comments?: string) => void;
    onTabChange?: (alertId: string, tabName: string) => void;
}
declare const AlertDetail: React.FC<AlertDetailProps>;
export default AlertDetail;
//# sourceMappingURL=AlertDetail.d.ts.map