import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BildungsplanStateService } from '../../../core/state/bildungsplan-state.service';
import { Lernort } from '../../../models/lernort.model';

@Component({
  selector: 'app-lernort-overview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lernort-overview.html',
  styleUrl: './lernort-overview.css',
})
export class LernortOverview {
  readonly state = inject(BildungsplanStateService);

  readonly searchTerm = signal('');

  readonly visibleLernorte = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const items = this.state.visibleLernorte();

    if (!term) {
      return items;
    }

    return items.filter((lernort) => {
      const searchableText = [
        lernort.kennung,
        lernort.beschreibung,
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(term);
    });
  });

  updateSearchTerm(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

  lernortId(lernort: Lernort): number {
    return lernort.id;
  }

  moduleCount(lernort: Lernort): number {
    return this.state.module().filter(
      (modul) => modul.lernortId === lernort.id
    ).length;
  }

  moduleCountLabel(lernort: Lernort): string {
    const count = this.moduleCount(lernort);

    if (count === 1) {
      return '1 Modul';
    }

    if (count > 1) {
      return `${count} Module`;
    }

    return 'Keine Module';
  }

  contextLabel(): string {
    return this.state.contextLabel();
  }
}