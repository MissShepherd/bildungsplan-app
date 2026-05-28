import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { Lernort } from '../../models/lernort.model';

@Injectable({
  providedIn: 'root',
})
export class LernortService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/api/lernorte`;

  getAll(): Observable<Lernort[]> {
    return this.http.get<Lernort[]>(this.apiUrl);
  }

  getById(id: number): Observable<Lernort> {
    return this.http.get<Lernort>(`${this.apiUrl}/${id}`);
  }
}