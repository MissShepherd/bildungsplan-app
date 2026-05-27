import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Fachrichtung } from '../../models/fachrichtung.model';

@Injectable({
  providedIn: 'root',
})
export class FachrichtungService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/fachrichtungen';

  getAll(): Observable<Fachrichtung[]> {
    return this.http.get<Fachrichtung[]>(this.apiUrl);
  }

  getByEfzId(efzId: number): Observable<Fachrichtung[]> {
    return this.http.get<Fachrichtung[]>(`${this.apiUrl}/efz/${efzId}`);
  }

  getById(id: number): Observable<Fachrichtung> {
    return this.http.get<Fachrichtung>(`${this.apiUrl}/${id}`);
  }
}