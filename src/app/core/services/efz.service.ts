import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Efz } from '../../models/efz.model';

@Injectable({
  providedIn: 'root',
})
export class EfzService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/efz';

  getAll(): Observable<Efz[]> {
    return this.http.get<Efz[]>(this.apiUrl);
  }

  getById(id: number): Observable<Efz> {
    return this.http.get<Efz>(`${this.apiUrl}/${id}`);
  }
}