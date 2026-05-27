import { computed, Injectable, signal } from '@angular/core';

import { Efz } from '../../models/efz.model';
import { Fachrichtung } from '../../models/fachrichtung.model';
import { Handlungskompetenzbereich } from '../../models/handlungskompetenzbereich.model';
import { Handlungskompetenz } from '../../models/handlungskompetenz.model';
import { Modul } from '../../models/modul.model';
import { Lernort } from '../../models/lernort.model';

@Injectable({
  providedIn: 'root',
})
export class BildungsplanStateService {
  readonly efzList = signal<Efz[]>([]);
  readonly fachrichtungen = signal<Fachrichtung[]>([]);
  readonly handlungskompetenzbereiche = signal<Handlungskompetenzbereich[]>([]);
  readonly handlungskompetenzen = signal<Handlungskompetenz[]>([]);
  readonly module = signal<Modul[]>([]);

  readonly selectedEfz = signal<Efz | null>(null);
  readonly selectedFachrichtung = signal<Fachrichtung | null>(null);
  readonly selectedHandlungskompetenzbereich =
    signal<Handlungskompetenzbereich | null>(null);
  readonly selectedHandlungskompetenz = signal<Handlungskompetenz | null>(null);
  readonly selectedModul = signal<Modul | null>(null);

  readonly fachrichtungenLoaded = signal(false);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly lernorte = signal<Lernort[]>([]);
  readonly selectedLernort = signal<Lernort | null>(null);

  readonly selectedEfzId = computed(() => this.selectedEfz()?.id ?? null);
  readonly selectedFachrichtungId = computed(
    () => this.selectedFachrichtung()?.id ?? null
  );

  readonly requiresFachrichtung = computed(
    () =>
      this.selectedEfz() !== null &&
      this.fachrichtungenLoaded() &&
      this.fachrichtungen().length > 0
  );

  readonly selectedLernortId = computed(() => this.selectedLernort()?.id ?? null);

readonly visibleLernorte = computed(() => {
  const usedLernortIds = new Set(
    this.module()
      .map((modul) => modul.lernortId)
      .filter((lernortId): lernortId is number => lernortId !== undefined && lernortId !== null)
  );

  return this.lernorte().filter((lernort) => usedLernortIds.has(lernort.id));
});

readonly visibleModule = computed(() => {
  const selectedLernortId = this.selectedLernortId();

  if (!selectedLernortId) {
    return [];
  }

  return this.module().filter((modul) => modul.lernortId === selectedLernortId);
});

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

  setEfzList(efzList: Efz[]): void {
    this.efzList.set(efzList);
  }

  selectEfz(efz: Efz): void {
    this.selectedEfz.set(efz);
    this.selectedFachrichtung.set(null);

    this.fachrichtungen.set([]);
    this.fachrichtungenLoaded.set(false);

    this.clearBusinessObjectSelection();
    this.clearContextData();
  }

  setFachrichtungen(fachrichtungen: Fachrichtung[]): void {
    this.fachrichtungen.set(fachrichtungen);
    this.fachrichtungenLoaded.set(true);
  }

  selectFachrichtung(fachrichtung: Fachrichtung): void {
    this.selectedFachrichtung.set(fachrichtung);

    this.clearBusinessObjectSelection();
    this.clearContextData();
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

    setLernorte(lernorte: Lernort[]): void {
    this.lernorte.set(lernorte);
  }

  selectLernort(lernort: Lernort | null): void {
    this.selectedLernort.set(lernort);
    this.selectedModul.set(null);
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
    this.handlungskompetenzbereiche.set([]);
    this.handlungskompetenzen.set([]);
    this.module.set([]);
  }

  clearAll(): void {
    this.selectedEfz.set(null);
    this.selectedFachrichtung.set(null);
    this.fachrichtungen.set([]);
    this.fachrichtungenLoaded.set(false);
    this.selectedLernort.set(null);
    this.lernorte.set([]);

    this.clearBusinessObjectSelection();
    this.clearContextData();

    this.isLoading.set(false);
    this.error.set(null);
  }
}