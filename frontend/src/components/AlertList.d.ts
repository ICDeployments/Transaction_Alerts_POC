import React from 'react';
import type { Alert } from '../types';
interface AlertListProps {
    alerts: Alert[];
    selectedAlert: Alert | null;
    onSelectAlert: (alert: Alert) => void;
}
declare const AlertList: React.FC<AlertListProps>;
export default AlertList;
//# sourceMappingURL=AlertList.d.ts.map