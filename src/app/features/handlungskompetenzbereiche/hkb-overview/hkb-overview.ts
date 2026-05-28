import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BildungsplanStateService } from '../../../core/state/bildungsplan-state.service';
import { Handlungskompetenzbereich } from '../../../models/handlungskompetenzbereich.model';

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
  imports: [RouterLink],
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
    const card = hkb as HkbCard;

    return card.kennung ?? card.kuerzel ?? card.code ?? `HKB ${card.id ?? ''}`;
  }

  hkbTitle(hkb: Handlungskompetenzbereich): string {
    const card = hkb as HkbCard;

    return card.titel ?? card.bezeichnung ?? card.name ?? 'Unbenannter Handlungskompetenzbereich';
  }

  hkbDescription(hkb: Handlungskompetenzbereich): string {
    const card = hkb as HkbCard;

    return card.beschreibung ?? card.kurzbeschreibung ?? 'Keine Beschreibung vorhanden.';
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