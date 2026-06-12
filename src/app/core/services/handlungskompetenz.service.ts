import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { Handlungskompetenz } from '../../models/handlungskompetenz.model';
import { Modul } from '../../models/modul.model';

@Injectable({
  providedIn: 'root',
})
export class HandlungskompetenzService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/handlungskompetenzen`;

  getAll(): Observable<Handlungskompetenz[]> {
    return this.http.get<Handlungskompetenz[]>(this.apiUrl);
  }

  getById(id: number): Observable<Handlungskompetenz> {
    return this.http.get<Handlungskompetenz>(`${this.apiUrl}/${id}`);
  }

  getByEfzId(efzId: number): Observable<Handlungskompetenz[]> {
    return this.http.get<Handlungskompetenz[]>(
      `${this.apiUrl}/efz/${efzId}`
    );
  }

  getByFachrichtungId(fachrichtungId: number): Observable<Handlungskompetenz[]> {
    return this.http.get<Handlungskompetenz[]>(
      `${this.apiUrl}/fachrichtung/${fachrichtungId}`
    );
  }

  getModule(handlungskompetenzId: number): Observable<Modul[]> {
    return this.http.get<Modul[]>(
      `${this.apiUrl}/${handlungskompetenzId}/module`
    );
  }
}