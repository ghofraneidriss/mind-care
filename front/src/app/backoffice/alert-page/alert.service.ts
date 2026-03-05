import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Alert, AlertLevel, AlertStatus } from './alert.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly apiUrl = 'http://localhost:8085/api/alerts';

  constructor(private readonly http: HttpClient) {}

  // ===== EXISTING CRUD =====
  getAll(): Observable<Alert[]> {
    return this.http.get<Alert[]>(this.apiUrl);
  }

  getById(id: number): Observable<Alert> {
    return this.http.get<Alert>(`${this.apiUrl}/${id}`);
  }

  getByPatientId(patientId: number): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getByLevel(level: AlertLevel): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}/level/${level}`);
  }

  getByStatus(status: AlertStatus): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.apiUrl}/status/${status}`);
  }

  create(payload: Partial<Alert>): Observable<Alert> {
    return this.http.post<Alert>(this.apiUrl, payload);
  }

  update(id: number, payload: Partial<Alert>): Observable<Alert> {
    return this.http.put<Alert>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(map(() => true));
  }

  // ===== FONCTIONNALITES AVANCEES =====

  markAsViewed(id: number): Observable<Alert> {
    return this.http.patch<Alert>(`${this.apiUrl}/${id}/view`, {});
  }

  resolveAlert(id: number): Observable<Alert> {
    return this.http.patch<Alert>(`${this.apiUrl}/${id}/resolve`, {});
  }

  escalateAlert(id: number): Observable<Alert> {
    return this.http.patch<Alert>(`${this.apiUrl}/${id}/escalate`, {});
  }

  resolveAllByPatient(patientId: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/patient/${patientId}/resolve-all`, {});
  }

  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }
}
