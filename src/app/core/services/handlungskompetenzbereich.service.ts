import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { Handlungskompetenzbereich } from '../../models/handlungskompetenzbereich.model';
import { Handlungskompetenz } from '../../models/handlungskompetenz.model';

@Injectable({
  providedIn: 'root',
})
export class HandlungskompetenzbereichService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/handlungskompetenzbereiche`;

  getAll(): Observable<Handlungskompetenzbereich[]> {
    return this.http.get<Handlungskompetenzbereich[]>(this.apiUrl);
  }

  getById(id: number): Observable<Handlungskompetenzbereich> {
    return this.http.get<Handlungskompetenzbereich>(`${this.apiUrl}/${id}`);
  }

  getByEfzId(efzId: number): Observable<Handlungskompetenzbereich[]> {
    return this.http.get<Handlungskompetenzbereich[]>(
      `${this.apiUrl}/efz/${efzId}`
    );
  }

  getByFachrichtungId(
    fachrichtungId: number
  ): Observable<Handlungskompetenzbereich[]> {
    return this.http.get<Handlungskompetenzbereich[]>(
      `${this.apiUrl}/fachrichtung/${fachrichtungId}`
    );
  }

  getHandlungskompetenzen(
    handlungskompetenzbereichId: number
  ): Observable<Handlungskompetenz[]> {
    return this.http.get<Handlungskompetenz[]>(
      `${this.apiUrl}/${handlungskompetenzbereichId}/handlungskompetenzen`
    );
  }
}