import { computed, Injectable, signal } from '@angular/core';

import { Efz } from '../../models/efz.model';
import { Fachrichtung } from '../../models/fachrichtung.model';
import { Handlungskompetenzbereich } from '../../models/handlungskompetenzbereich.model';
import { Handlungskompetenz } from '../../models/handlungskompetenz.model';
import { Lernort } from '../../models/lernort.model';
import { Modul } from '../../models/modul.model';

@Injectable({
  providedIn: 'root',
})
export class BildungsplanStateService {
  readonly efzList = signal<Efz[]>([]);
  readonly fachrichtungen = signal<Fachrichtung[]>([]);
  readonly lernorte = signal<Lernort[]>([]);
  readonly handlungskompetenzbereiche = signal<Handlungskompetenzbereich[]>([]);
  readonly handlungskompetenzen = signal<Handlungskompetenz[]>([]);
  readonly module = signal<Modul[]>([]);

  readonly selectedEfz = signal<Efz | null>(null);
  readonly selectedFachrichtung = signal<Fachrichtung | null>(null);
  readonly selectedLernort = signal<Lernort | null>(null);
  readonly selectedHandlungskompetenzbereich =
    signal<Handlungskompetenzbereich | null>(null);
  readonly selectedHandlungskompetenz = signal<Handlungskompetenz | null>(null);
  readonly selectedModul = signal<Modul | null>(null);

  readonly searchTerm = signal('');

  readonly fachrichtungenLoaded = signal(false);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly selectedEfzId = computed(() => this.selectedEfz()?.id ?? null);

  readonly selectedFachrichtungId = computed(
    () => this.selectedFachrichtung()?.id ?? null
  );

  readonly selectedLernortId = computed(() => this.selectedLernort()?.id ?? null);

  readonly hasSearchTerm = computed(() => this.normalizedSearchTerm().length > 0);

  readonly normalizedSearchTerm = computed(() =>
    this.searchTerm().trim().toLowerCase()
  );

  readonly requiresFachrichtung = computed(
    () =>
      this.selectedEfz() !== null &&
      this.fachrichtungenLoaded() &&
      this.fachrichtungen().length > 0
  );

  readonly isContextComplete = computed(() => {
    if (!this.selectedEfz()) {
      return false;
    }

    if (!this.fachrichtungenLoaded()) {
      return false;
    }

    return (
      this.fachrichtungen().length === 0 ||
      this.selectedFachrichtung() !== null
    );
  });

  readonly contextLabel = computed(() => {
    const efz = this.selectedEfz();
    const fachrichtung = this.selectedFachrichtung();

    if (!efz) {
      return 'Kein EFZ ausgewählt';
    }

    if (!fachrichtung) {
      return efz.titel;
    }

    return `${efz.titel} / ${fachrichtung.titel}`;
  });

  readonly visibleLernorte = computed(() => {
    const usedLernortIds = new Set(
      this.module()
        .map((modul) => modul.lernortId)
        .filter(
          (lernortId): lernortId is number =>
            lernortId !== undefined && lernortId !== null
        )
    );

    return this.lernorte().filter((lernort) => usedLernortIds.has(lernort.id));
  });

  readonly visibleModule = computed(() => {
    const selectedLernortId = this.selectedLernortId();

    if (!selectedLernortId) {
      return [];
    }

    return this.module().filter(
      (modul) => modul.lernortId === selectedLernortId
    );
  });

  readonly hasContextData = computed(
    () =>
      this.handlungskompetenzbereiche().length > 0 ||
      this.handlungskompetenzen().length > 0 ||
      this.module().length > 0
  );

  setEfzList(efzList: Efz[]): void {
    this.efzList.set(efzList);
  }

  selectEfz(efz: Efz): void {
    this.selectedEfz.set(efz);
    this.selectedFachrichtung.set(null);

    this.fachrichtungen.set([]);
    this.fachrichtungenLoaded.set(false);

    this.clearSearch();
    this.clearBusinessObjectSelection();
    this.clearContextData();
  }

  setFachrichtungen(fachrichtungen: Fachrichtung[]): void {
    this.fachrichtungen.set(fachrichtungen);
    this.fachrichtungenLoaded.set(true);
  }

  selectFachrichtung(fachrichtung: Fachrichtung): void {
    this.selectedFachrichtung.set(fachrichtung);

    this.clearSearch();
    this.clearBusinessObjectSelection();
    this.clearContextData();
  }

  setLernorte(lernorte: Lernort[]): void {
    this.lernorte.set(lernorte);
  }

  selectLernort(lernort: Lernort | null): void {
    this.selectedLernort.set(lernort);
    this.selectedModul.set(null);
  }

  setHandlungskompetenzbereiche(
    handlungskompetenzbereiche: Handlungskompetenzbereich[]
  ): void {
    this.handlungskompetenzbereiche.set(handlungskompetenzbereiche);
  }

  setHandlungskompetenzen(handlungskompetenzen: Handlungskompetenz[]): void {
    this.handlungskompetenzen.set(handlungskompetenzen);
  }

  setModule(module: Modul[]): void {
    this.module.set(module);
  }

  selectHandlungskompetenzbereich(
    handlungskompetenzbereich: Handlungskompetenzbereich | null
  ): void {
    this.selectedHandlungskompetenzbereich.set(handlungskompetenzbereich);
    this.selectedHandlungskompetenz.set(null);
    this.selectedModul.set(null);
  }

  selectHandlungskompetenz(
    handlungskompetenz: Handlungskompetenz | null
  ): void {
    this.selectedHandlungskompetenz.set(handlungskompetenz);
    this.selectedModul.set(null);
  }

  selectModul(modul: Modul | null): void {
    this.selectedModul.set(modul);
  }

  setSearchTerm(searchTerm: string): void {
    this.searchTerm.set(searchTerm);
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  setLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  clearBusinessObjectSelection(): void {
    this.selectedHandlungskompetenzbereich.set(null);
    this.selectedHandlungskompetenz.set(null);
    this.selectedModul.set(null);
  }

  clearContextData(): void {
    this.selectedLernort.set(null);
    this.lernorte.set([]);
    this.handlungskompetenzbereiche.set([]);
    this.handlungskompetenzen.set([]);
    this.module.set([]);
  }

  clearAll(): void {
    this.selectedEfz.set(null);
    this.selectedFachrichtung.set(null);
    this.selectedLernort.set(null);

    this.fachrichtungen.set([]);
    this.fachrichtungenLoaded.set(false);
    this.lernorte.set([]);

    this.clearSearch();
    this.clearBusinessObjectSelection();
    this.clearContextData();

    this.isLoading.set(false);
    this.error.set(null);
  }
}