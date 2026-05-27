import { computed, Injectable, signal, WritableSignal } from '@angular/core';

import { Efz } from '../../models/efz.model';
import { Fachrichtung } from '../../models/fachrichtung.model';

@Injectable({
  providedIn: 'root',
})
export class BildungsplanStateService {
  readonly selectedEfz = signal<Efz | null>(null);
  readonly selectedFachrichtung = signal<Fachrichtung | null>(null);

  readonly selectedEfzId = signal<number | null>(null);
  readonly selectedFachrichtungId = signal<number | null>(null);

  readonly fachrichtungen = signal<Fachrichtung[]>([]);
  readonly fachrichtungenLoaded = signal(false);

  readonly selectedLernortIds = signal<number[]>([]);
  readonly selectedLehrjahre = signal<number[]>([]);
  readonly selectedModultypen = signal<string[]>([]);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  readonly hasSelectedEfz = computed(() => this.selectedEfzId() !== null);

  readonly hasSelectedFachrichtung = computed(
    () => this.selectedFachrichtungId() !== null
  );

  readonly hasFachrichtungen = computed(
    () => this.fachrichtungen().length > 0
  );

  readonly requiresFachrichtung = computed(() =>
    this.selectedEfzId() !== null &&
    this.fachrichtungenLoaded() &&
    this.fachrichtungen().length > 0
  );

  readonly isContextComplete = computed(() =>
    this.selectedEfzId() !== null &&
    this.fachrichtungenLoaded() &&
    (
      this.fachrichtungen().length === 0 ||
      this.selectedFachrichtungId() !== null
    )
  );

  readonly hasActiveFilters = computed(() =>
    this.selectedEfzId() !== null ||
    this.selectedFachrichtungId() !== null ||
    this.selectedLernortIds().length > 0 ||
    this.selectedLehrjahre().length > 0 ||
    this.selectedModultypen().length > 0
  );

  setSelectedEfz(efz: Efz | null): void {
    this.selectedEfz.set(efz);
    this.selectedEfzId.set(efz?.id ?? null);

    this.selectedFachrichtung.set(null);
    this.selectedFachrichtungId.set(null);

    this.fachrichtungen.set([]);
    this.fachrichtungenLoaded.set(false);

    this.selectedLernortIds.set([]);
    this.selectedLehrjahre.set([]);
    this.selectedModultypen.set([]);
  }

  setSelectedFachrichtung(fachrichtung: Fachrichtung | null): void {
    this.selectedFachrichtung.set(fachrichtung);
    this.selectedFachrichtungId.set(fachrichtung?.id ?? null);
  }

  setEfz(efzId: number): void {
    this.selectedEfz.set(null);
    this.selectedEfzId.set(efzId);

    this.selectedFachrichtung.set(null);
    this.selectedFachrichtungId.set(null);

    this.fachrichtungen.set([]);
    this.fachrichtungenLoaded.set(false);

    this.selectedLernortIds.set([]);
    this.selectedLehrjahre.set([]);
    this.selectedModultypen.set([]);
  }

  setFachrichtung(fachrichtungId: number): void {
    this.selectedFachrichtung.set(null);
    this.selectedFachrichtungId.set(fachrichtungId);
  }

  setFachrichtungen(fachrichtungen: Fachrichtung[]): void {
    this.fachrichtungen.set(fachrichtungen);
    this.fachrichtungenLoaded.set(true);
  }

  clearFachrichtungen(): void {
    this.fachrichtungen.set([]);
    this.fachrichtungenLoaded.set(false);
  }

  setLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  setError(error: string | null): void {
    this.error.set(error);
  }

  toggleLernort(lernortId: number): void {
    this.toggleNumberValue(this.selectedLernortIds, lernortId);
  }

  toggleLehrjahr(lehrjahr: number): void {
    this.toggleNumberValue(this.selectedLehrjahre, lehrjahr);
  }

  toggleModultyp(modultyp: string): void {
    this.toggleStringValue(this.selectedModultypen, modultyp);
  }

  clearFilters(): void {
    this.selectedEfz.set(null);
    this.selectedEfzId.set(null);

    this.selectedFachrichtung.set(null);
    this.selectedFachrichtungId.set(null);

    this.fachrichtungen.set([]);
    this.fachrichtungenLoaded.set(false);

    this.selectedLernortIds.set([]);
    this.selectedLehrjahre.set([]);
    this.selectedModultypen.set([]);

    this.isLoading.set(false);
    this.error.set(null);
  }

  private toggleNumberValue(target: WritableSignal<number[]>, value: number): void {
    const currentValues = target();

    if (currentValues.includes(value)) {
      target.set(currentValues.filter((item) => item !== value));
      return;
    }

    target.set([...currentValues, value]);
  }

  private toggleStringValue(target: WritableSignal<string[]>, value: string): void {
    const currentValues = target();

    if (currentValues.includes(value)) {
      target.set(currentValues.filter((item) => item !== value));
      return;
    }

    target.set([...currentValues, value]);
  }
  
  readonly hasEfz = computed(() => this.hasSelectedEfz());

readonly errorMessage = computed(() => this.error());

readonly contextLabel = computed(() => {
  const efz = this.selectedEfz();
  const fachrichtung = this.selectedFachrichtung();

  if (!efz && !this.selectedEfzId()) {
    return 'Kein EFZ ausgewählt';
  }

  const efzLabel = efz?.titel ?? `EFZ ${this.selectedEfzId()}`;

  if (!fachrichtung) {
    return efzLabel;
  }

  return `${efzLabel} / ${fachrichtung.titel}`;
});
}

