import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { FollowUp } from './followup.model';

@Injectable({ providedIn: 'root' })
export class FollowUpService {
  private readonly apiUrl = 'http://localhost:8085/api/followups';

  constructor(private readonly http: HttpClient) {}

  // ===== EXISTING CRUD =====
  getAll(): Observable<FollowUp[]> {
    return this.http.get<FollowUp[]>(this.apiUrl);
  }

  getById(id: number): Observable<FollowUp> {
    return this.http.get<FollowUp>(`${this.apiUrl}/${id}`);
  }

  getByPatientId(patientId: number): Observable<FollowUp[]> {
    return this.http.get<FollowUp[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getByCaregiverId(caregiverId: number): Observable<FollowUp[]> {
    return this.http.get<FollowUp[]>(`${this.apiUrl}/caregiver/${caregiverId}`);
  }

  create(payload: Partial<FollowUp>): Observable<FollowUp> {
    return this.http.post<FollowUp>(this.apiUrl, payload);
  }

  update(id: number, payload: Partial<FollowUp>): Observable<FollowUp> {
    return this.http.put<FollowUp>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(map(() => true));
  }

  // ===== FONCTIONNALITES AVANCEES =====

  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }

  getStatisticsByPatient(patientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics/patient/${patientId}`);
  }

  getPatientRisk(patientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patient/${patientId}/risk`);
  }

  detectCognitiveDecline(patientId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patient/${patientId}/cognitive-decline`);
  }
}
