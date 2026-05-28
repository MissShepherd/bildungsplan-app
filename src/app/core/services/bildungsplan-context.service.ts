import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { Lernort } from '../../models/lernort.model';
import { Handlungskompetenzbereich } from '../../models/handlungskompetenzbereich.model';
import { Handlungskompetenz } from '../../models/handlungskompetenz.model';
import { Modul } from '../../models/modul.model';
import { HandlungskompetenzbereichService } from './handlungskompetenzbereich.service';
import { HandlungskompetenzService } from './handlungskompetenz.service';
import { LernortService } from './lernort.service';
import { ModulService } from './modul.service';

export interface BildungsplanContextData {
  lernorte: Lernort[];
  handlungskompetenzbereiche: Handlungskompetenzbereich[];
  handlungskompetenzen: Handlungskompetenz[];
  module: Modul[];
}

@Injectable({
  providedIn: 'root',
})
export class BildungsplanContextService {
  private readonly hkbService = inject(HandlungskompetenzbereichService);
  private readonly hkService = inject(HandlungskompetenzService);
  private readonly lernortService = inject(LernortService);
  private readonly modulService = inject(ModulService);

  loadByEfz(efzId: number): Observable<BildungsplanContextData> {
    return forkJoin({
      lernorte: this.lernortService.getAll(),
      handlungskompetenzbereiche: this.hkbService.getByEfzId(efzId),
      handlungskompetenzen: this.hkService.getByEfzId(efzId),
      module: this.modulService.getByEfzId(efzId),
    });
  }

  loadByFachrichtung(
    fachrichtungId: number
  ): Observable<BildungsplanContextData> {
    return forkJoin({
      lernorte: this.lernortService.getAll(),
      handlungskompetenzbereiche:
        this.hkbService.getByFachrichtungId(fachrichtungId),
      handlungskompetenzen:
        this.hkService.getByFachrichtungId(fachrichtungId),
      module: this.modulService.getByFachrichtungId(fachrichtungId),
    });
  }
}