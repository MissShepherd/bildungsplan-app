import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { BildungsplanContextService } from '../../../core/services/bildungsplan-context.service';
import {
  ModulService,
  ModulSuchkriterien,
} from '../../../core/services/modul.service';
import { BildungsplanStateService } from '../../../core/state/bildungsplan-state.service';
import { Handlungskompetenzbereich } from '../../../models/handlungskompetenzbereich.model';
import { Handlungskompetenz } from '../../../models/handlungskompetenz.model';
import { Modul } from '../../../models/modul.model';
import { SearchResults } from '../search-results/search-results';

@Component({
  selector: 'app-search-page',
  imports: [SearchResults],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css',
})
export class SearchPage {
  readonly state = inject(BildungsplanStateService);

  private readonly contextService = inject(BildungsplanContextService);
  private readonly modulService = inject(ModulService);

  readonly hkbResults = signal<Handlungskompetenzbereich[]>([]);
  readonly hkResults = signal<Handlungskompetenz[]>([]);
  readonly modulResults = signal<Modul[]>([]);

  readonly isSearching = signal(false);
  readonly hasSearched = signal(false);
  readonly searchError = signal<string | null>(null);

  readonly totalResults = computed(
    () =>
      this.hkbResults().length +
      this.hkResults().length +
      this.modulResults().length
  );

  readonly canSearch = computed(
    () =>
      this.state.isContextComplete() &&
      this.state.normalizedSearchTerm().length > 0 &&
      !this.isSearching()
  );

  updateSearchTerm(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.state.setSearchTerm(input.value);

    if (!input.value.trim()) {
      this.resetResults();
      this.hasSearched.set(false);
      this.searchError.set(null);
    }
  }

  clearSearch(): void {
    this.state.clearSearch();
    this.resetResults();
    this.hasSearched.set(false);
    this.searchError.set(null);
  }

  async search(): Promise<void> {
    const searchTerm = this.state.normalizedSearchTerm();

    if (!this.state.isContextComplete()) {
      this.searchError.set(
        'Bitte zuerst ein EFZ und falls nötig eine Fachrichtung auswählen.'
      );
      return;
    }

    if (!searchTerm) {
      this.resetResults();
      this.hasSearched.set(false);
      return;
    }

    this.isSearching.set(true);
    this.searchError.set(null);
    this.state.setLoading(true);
    this.state.setError(null);

    try {
      await this.ensureContextDataLoaded();

      const hkbResults = this.filterHandlungskompetenzbereiche(searchTerm);
      const hkResults = this.filterHandlungskompetenzen(searchTerm);
      const modulResults = await this.searchModule();

      this.hkbResults.set(hkbResults);
      this.hkResults.set(hkResults);
      this.modulResults.set(modulResults);
      this.hasSearched.set(true);
    } catch (error) {
      const message = this.getErrorMessage(error);

      this.searchError.set(message);
      this.state.setError(message);
      this.resetResults();
      this.hasSearched.set(true);
    } finally {
      this.isSearching.set(false);
      this.state.setLoading(false);
    }
  }

  private async ensureContextDataLoaded(): Promise<void> {
    if (this.state.hasContextData()) {
      return;
    }

    const efzId = this.state.selectedEfzId();

    if (efzId === null) {
      throw new Error('Für die Suche fehlt die EFZ-Auswahl.');
    }

    const fachrichtungId = this.state.selectedFachrichtungId();

    const contextData =
      fachrichtungId !== null
        ? await firstValueFrom(this.contextService.loadByFachrichtung(fachrichtungId))
        : await firstValueFrom(this.contextService.loadByEfz(efzId));

    this.state.setLernorte(contextData.lernorte);
    this.state.setHandlungskompetenzbereiche(
      contextData.handlungskompetenzbereiche
    );
    this.state.setHandlungskompetenzen(contextData.handlungskompetenzen);
    this.state.setModule(contextData.module);
  }

  private filterHandlungskompetenzbereiche(
    searchTerm: string
  ): Handlungskompetenzbereich[] {
    return this.state.handlungskompetenzbereiche().filter((hkb) =>
      this.matchesSearchTerm(searchTerm, hkb.kennung, hkb.beschreibung)
    );
  }

  private filterHandlungskompetenzen(
    searchTerm: string
  ): Handlungskompetenz[] {
    return this.state.handlungskompetenzen().filter((hk) =>
      this.matchesSearchTerm(
        searchTerm,
        hk.kennung,
        hk.beschreibung,
        hk.handlungskompetenzbereichKennung,
        hk.lehrjahr
      )
    );
  }

  private async searchModule(): Promise<Modul[]> {
    const criteria: ModulSuchkriterien = {
      freitext: this.state.searchTerm().trim(),
      efzId: this.state.selectedEfzId() ?? undefined,
      fachrichtungId: this.state.selectedFachrichtungId() ?? undefined,
    };

    return firstValueFrom(this.modulService.search(criteria));
  }

  private matchesSearchTerm(
    searchTerm: string,
    ...values: Array<string | number | null | undefined>
  ): boolean {
    return values.some((value) =>
      String(value ?? '')
        .toLowerCase()
        .includes(searchTerm)
    );
  }

  private resetResults(): void {
    this.hkbResults.set([]);
    this.hkResults.set([]);
    this.modulResults.set([]);
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Die API ist nicht erreichbar. Bitte prüfen, ob das Backend gestartet ist.';
      }

      if (error.status === 404) {
        return 'Die angefragten Daten wurden nicht gefunden.';
      }

      return `Bei der Suche ist ein Fehler aufgetreten. Status: ${error.status}`;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Bei der Suche ist ein unbekannter Fehler aufgetreten.';
  }
}