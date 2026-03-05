export type AlertLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'NEW' | 'VIEWED' | 'RESOLVED';

export interface Alert {
  id?: number;
  patientId: number | null;
  title: string;
  description: string | null;
  level: AlertLevel;
  status: AlertStatus;
  createdAt?: string | null;
  viewedAt?: string | null;
}
