import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BildungsplanStateService } from '../../../core/state/bildungsplan-state.service';
import { Handlungskompetenzbereich } from '../../../models/handlungskompetenzbereich.model';
import { ActiveFilterChipsComponent } from '../../../shared/components/active-filter-chips/active-filter-chips';

type HkbCard = Handlungskompetenzbereich &
  Partial<
    Record<
      | 'kennung'
      | 'kuerzel'
      | 'code'
      | 'titel'
      | 'bezeichnung'
      | 'name'
      | 'beschreibung'
      | 'kurzbeschreibung',
      string
    >
  > &
  Partial<Record<'id', number>>;

type HkReference = Partial<
  Record<'handlungskompetenzbereichId' | 'hkbId' | 'bereichId', number>
>;

@Component({
  selector: 'app-hkb-overview',
  standalone: true,
  imports: [RouterLink, ActiveFilterChipsComponent],
  templateUrl: './hkb-overview.html',
  styleUrl: './hkb-overview.css',
})
export class HkbOverview {
  readonly state = inject(BildungsplanStateService);

  readonly searchTerm = signal('');

  readonly visibleHandlungskompetenzbereiche = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const items = this.state.handlungskompetenzbereiche();

    if (!term) {
      return items;
    }

    return items.filter((hkb) => {
      const searchableText = [
        this.hkbCode(hkb),
        this.hkbTitle(hkb),
        this.hkbDescription(hkb),
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

  hkbId(hkb: Handlungskompetenzbereich): number {
    return (hkb as HkbCard).id ?? 0;
  }

  hkbCode(hkb: Handlungskompetenzbereich): string {
    return hkb.kennung || `HKB ${hkb.id}`;
  }

  hkbTitle(hkb: Handlungskompetenzbereich): string {
    return hkb.kennung || `HKB ${hkb.id}`;
  }

  hkbDescription(hkb: Handlungskompetenzbereich): string {
    return hkb.beschreibung || 'Keine Beschreibung vorhanden.';
  }

  handlungskompetenzCount(hkb: Handlungskompetenzbereich): number {
    const id = this.hkbId(hkb);

    return this.state.handlungskompetenzen().filter((hk) => {
      const reference = hk as HkReference;

      return (
        reference.handlungskompetenzbereichId === id ||
        reference.hkbId === id ||
        reference.bereichId === id
      );
    }).length;
  }

  handlungskompetenzCountLabel(hkb: Handlungskompetenzbereich): string {
    const count = this.handlungskompetenzCount(hkb);

    if (count === 1) {
      return '1 Handlungskompetenz';
    }

    if (count > 1) {
      return `${count} Handlungskompetenzen`;
    }

    return 'Handlungskompetenzen';
  }

  contextLabel(): string {
    return this.state.contextLabel();
  }
}