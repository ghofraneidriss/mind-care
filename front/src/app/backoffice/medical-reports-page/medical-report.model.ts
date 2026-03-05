export type ReportStatus = 'DRAFT' | 'REVIEWED' | 'APPROVED';

export interface MedicalReport {
  reportid?: number;
  patientid: number | null;
  doctorid: number | null;
  patientName?: string;
  doctorName?: string;
  doctorEmail?: string | null;
  status: ReportStatus;
  createdAt?: string | null;
  title: string;
  description: string;
  approvalByDocter?: number | null;
  approvedAt?: string | null;
}
