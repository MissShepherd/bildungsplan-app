import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { Handlungskompetenz } from '../../models/handlungskompetenz.model';
import { Modul } from '../../models/modul.model';

export interface ModulSuchkriterien {
  freitext?: string;
  beschreibung?: string;
  kennung?: string;
  lehrjahr?: number;
  lernortId?: number;
  efzId?: number;
  fachrichtungId?: number;
  fachrichtungTitel?: string;
  pflicht?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModulService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/api/module`;

  getAll(): Observable<Modul[]> {
    return this.http.get<Modul[]>(this.apiUrl);
  }

  getById(id: number): Observable<Modul> {
    return this.http.get<Modul>(`${this.apiUrl}/${id}`);
  }

  getByEfzId(efzId: number): Observable<Modul[]> {
    return this.http.get<Modul[]>(`${this.apiUrl}/efz/${efzId}`);
  }

  getByFachrichtungId(fachrichtungId: number): Observable<Modul[]> {
    return this.http.get<Modul[]>(
      `${this.apiUrl}/fachrichtung/${fachrichtungId}`
    );
  }

  getByLernortId(lernortId: number): Observable<Modul[]> {
    return this.http.get<Modul[]>(`${this.apiUrl}/lernort/${lernortId}`);
  }

  getHandlungskompetenzen(modulId: number): Observable<Handlungskompetenz[]> {
    return this.http.get<Handlungskompetenz[]>(
      `${this.apiUrl}/${modulId}/handlungskompetenzen`
    );
  }

  search(criteria: ModulSuchkriterien): Observable<Modul[]> {
    return this.http.post<Modul[]>(`${this.apiUrl}/suche`, criteria);
  }
}