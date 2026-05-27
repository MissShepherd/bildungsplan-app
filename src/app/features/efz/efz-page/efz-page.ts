import { Component, inject } from '@angular/core';

import { BildungsplanStateService } from '../../../core/state/bildungsplan-state.service';
import { FachrichtungService } from '../../../core/services/fachrichtung.service';
import { Efz } from '../../../models/efz.model';
import { Fachrichtung } from '../../../models/fachrichtung.model';
import { EfzSelector } from '../efz-selector/efz-selector';
import { FachrichtungSelector } from '../../fachrichtungen/fachrichtung-selector/fachrichtung-selector';

@Component({
  selector: 'app-efz-page',
  imports: [EfzSelector, FachrichtungSelector],
  templateUrl: './efz-page.html',
  styleUrl: './efz-page.css',
})
export class EfzPage {
  readonly state = inject(BildungsplanStateService);

  private readonly fachrichtungService = inject(FachrichtungService);

  onEfzSelected(efz: Efz | null): void {
    this.state.setSelectedEfz(efz);

    if (!efz) {
      return;
    }

    this.loadFachrichtungen(efz.id);
  }

  onFachrichtungSelected(fachrichtung: Fachrichtung | null): void {
    this.state.setSelectedFachrichtung(fachrichtung);
  }

  private loadFachrichtungen(efzId: number): void {
    this.state.setLoading(true);
    this.state.setError(null);

    this.fachrichtungService.getByEfzId(efzId).subscribe({
      next: (fachrichtungen) => {
        this.state.setFachrichtungen(fachrichtungen);
        this.state.setLoading(false);
      },
      error: () => {
        this.state.setFachrichtungen([]);
        this.state.setError('Die Fachrichtungen konnten nicht geladen werden.');
        this.state.setLoading(false);
      },
    });
  }
}