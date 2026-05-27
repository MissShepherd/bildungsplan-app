import { Component, inject } from '@angular/core';

import { BildungsplanStateService } from '../../core/state/bildungsplan-state.service';
import { FachrichtungService } from '../../core/services/fachrichtung.service';
import { Fachrichtung } from '../../models/fachrichtung.model';

interface FilterOption {
  id: number;
  label: string;
}

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  templateUrl: './filter-sidebar.html',
  styleUrl: './filter-sidebar.css',
})
export class FilterSidebarComponent {
  readonly state = inject(BildungsplanStateService);

  private readonly fachrichtungService = inject(FachrichtungService);

  readonly efzOptions: FilterOption[] = [
    { id: 1, label: 'Informatikerin/Informatiker' },
    { id: 2, label: 'ICT-Fachfrau/Fachmann' },
    { id: 3, label: 'Entwicklerin digitales Business' },
    { id: 4, label: 'Mediamatikerin / Mediamatiker' },
  ];

  readonly lernortOptions: FilterOption[] = [
    { id: 1, label: 'Betrieb' },
    { id: 2, label: 'Berufsfachschule' },
    { id: 3, label: 'Überbetriebliche Kurse' },
  ];

  readonly lehrjahrOptions: FilterOption[] = [
    { id: 1, label: '1. Lehrjahr' },
    { id: 2, label: '2. Lehrjahr' },
    { id: 3, label: '3. Lehrjahr' },
    { id: 4, label: '4. Lehrjahr' },
  ];

  readonly modultypOptions = [
    'Pflichtmodul',
    'Wahlpflichtmodul',
    'Wahlmodul',
  ];

  selectEfz(efzId: number): void {
    this.state.setEfz(efzId);
    this.loadFachrichtungen(efzId);
  }

  selectFachrichtung(fachrichtung: Fachrichtung): void {
    this.state.setSelectedFachrichtung(fachrichtung);
  }

  toggleLernort(lernortId: number): void {
    this.state.toggleLernort(lernortId);
  }

  toggleLehrjahr(lehrjahr: number): void {
    this.state.toggleLehrjahr(lehrjahr);
  }

  toggleModultyp(modultyp: string): void {
    this.state.toggleModultyp(modultyp);
  }

  clearFilters(): void {
    this.state.clearFilters();
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
        this.state.clearFachrichtungen();
        this.state.setError('Die Fachrichtungen konnten nicht geladen werden.');
        this.state.setLoading(false);
      },
    });
  }
}