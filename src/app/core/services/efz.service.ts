import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import { Efz } from '../../models/efz.model';

@Injectable({
  providedIn: 'root',
})
export class EfzService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_BASE_URL}/api/efz`;

  getAll(): Observable<Efz[]> {
    return this.http.get<Efz[]>(this.apiUrl);
  }

  getById(id: number): Observable<Efz> {
    return this.http.get<Efz>(`${this.apiUrl}/${id}`);
  }
}