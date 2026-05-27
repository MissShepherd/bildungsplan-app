import { computed, Injectable, signal } from '@angular/core';

import { Efz } from '../../models/efz.model';
import { Fachrichtung } from '../../models/fachrichtung.model';

@Injectable({
  providedIn: 'root',
})
export class BildungsplanStateService {
  readonly selectedEfz = signal<Efz | null>(null);
  readonly selectedFachrichtung = signal<Fachrichtung | null>(null);

  readonly fachrichtungen = signal<Fachrichtung[]>([]);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly hasEfz = computed(() => this.selectedEfz() !== null);

  readonly hasFachrichtungen = computed(() => this.fachrichtungen().length > 0);

  readonly isContextComplete = computed(() => {
    if (!this.selectedEfz()) {
      return false;
    }

    if (this.hasFachrichtungen()) {
      return this.selectedFachrichtung() !== null;
    }

    return true;
  });

  readonly contextLabel = computed(() => {
    const efz = this.selectedEfz();
    const fachrichtung = this.selectedFachrichtung();

    if (!efz) {
      return 'Kein EFZ ausgewählt';
    }

    if (fachrichtung) {
      return `${efz.titel} / ${fachrichtung.titel}`;
    }

    return efz.titel;
  });

  setSelectedEfz(efz: Efz | null): void {
    this.selectedEfz.set(efz);
    this.selectedFachrichtung.set(null);
    this.fachrichtungen.set([]);
    this.errorMessage.set(null);
  }

  setFachrichtungen(fachrichtungen: Fachrichtung[]): void {
    this.fachrichtungen.set(fachrichtungen);

    if (fachrichtungen.length === 0) {
      this.selectedFachrichtung.set(null);
    }
  }

  setSelectedFachrichtung(fachrichtung: Fachrichtung | null): void {
    this.selectedFachrichtung.set(fachrichtung);
    this.errorMessage.set(null);
  }

  setLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  setError(message: string | null): void {
    this.errorMessage.set(message);
  }

  reset(): void {
    this.selectedEfz.set(null);
    this.selectedFachrichtung.set(null);
    this.fachrichtungen.set([]);
    this.isLoading.set(false);
    this.errorMessage.set(null);
  }
}