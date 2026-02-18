export interface Recommendation {
    id: number;
    content: string;
    type: string;
    status: string;
    createdAt: string;
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RecommendationService {
    private readonly apiUrl = 'http://localhost:8084/api/recommendations'
    constructor(private readonly http: HttpClient) { }

    getAll(): Observable<Recommendation[]> {
        return this.http.get<Recommendation[]>(this.apiUrl);
    }

    approve(id: number): Observable<Recommendation> {
        return this.http.put<Recommendation>((`${this.apiUrl}/${id}/approve`), {});
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
