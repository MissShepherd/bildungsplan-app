import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BildungsplanStateService } from '../../../core/state/bildungsplan-state.service';
import { Modul } from '../../../models/modul.model';

type ModulCard = Modul &
  Partial<
    Record<
      | 'kennung'
      | 'nummer'
      | 'titel'
      | 'bezeichnung'
      | 'name'
      | 'beschreibung'
      | 'kurzbeschreibung'
      | 'modultyp'
      | 'typ'
      | 'efzTitel'
      | 'fachrichtungTitel',
      string
    >
  > &
  Partial<Record<'id' | 'lehrjahr', number>>;

@Component({
  selector: 'app-modul-overview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './modul-overview.html',
  styleUrl: './modul-overview.css',
})
export class ModulOverview {
  readonly state = inject(BildungsplanStateService);

  readonly searchTerm = signal('');

  readonly visibleFilteredModule = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const items = this.state.visibleModule();

    if (!term) {
      return items;
    }

    return items.filter((modul) => {
      const searchableText = [
        this.modulCode(modul),
        this.modulTitle(modul),
        this.modulDescription(modul),
        this.modulType(modul),
        this.lehrjahrLabel(modul),
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

  modulId(modul: Modul): number {
    return (modul as ModulCard).id ?? 0;
  }

 modulCode(modul: Modul): string {
  return modul.kennung || `Modul ${modul.id}`;
}

  modulTitle(modul: Modul): string {
    return modul.kennung || `Modul ${modul.id}`;
  }

  modulDescription(modul: Modul): string {
    return modul.beschreibung || 'Keine Beschreibung vorhanden.';
  }

  modulType(modul: Modul): string {
    if (modul.pflicht === true) {
      return 'Pflichtmodul';
    }

    if (modul.pflicht === false) {
      return 'Nicht als Pflicht markiert';
    }

    return 'Modultyp offen';
  }

  lehrjahrLabel(modul: Modul): string {
    if (!modul.lehrjahr) {
      return 'Lehrjahr offen';
    }

    return `${modul.lehrjahr}. Lehrjahr`;
  }

  contextLabel(): string {
    return this.state.contextLabel();
  }
}