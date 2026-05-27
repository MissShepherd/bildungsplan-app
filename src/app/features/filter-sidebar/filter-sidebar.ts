import { Component, inject } from '@angular/core';
import { BildungsplanStateService } from '../../core/state/bildungsplan-state.service';

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

  readonly efzOptions: FilterOption[] = [
    { id: 1, label: 'Informatikerin/Informatiker' },
    { id: 2, label: 'ICT-Fachfrau/Fachmann' },
    { id: 3, label: 'Entwicklerin digitales Business' },
    { id: 4, label: 'Mediamatikerin / Mediamatiker' },
  ];

  readonly fachrichtungOptions: FilterOption[] = [
    { id: 1, label: 'Plattformentwicklung' },
    { id: 2, label: 'Applikationsentwicklung' },
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
  }

  selectFachrichtung(fachrichtungId: number): void {
    this.state.setFachrichtung(fachrichtungId);
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
}