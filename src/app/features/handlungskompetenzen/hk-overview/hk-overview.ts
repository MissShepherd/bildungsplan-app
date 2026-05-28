import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BildungsplanStateService } from '../../../core/state/bildungsplan-state.service';
import { Handlungskompetenz } from '../../../models/handlungskompetenz.model';
import { Modul } from '../../../models/modul.model';

type HkCard = Handlungskompetenz &
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
  Partial<
    Record<
      | 'id'
      | 'handlungskompetenzbereichId'
      | 'hkbId'
      | 'bereichId'
      | 'lehrjahr',
      number
    >
  >;

type ModulReference = Modul &
  Partial<
    Record<
      | 'handlungskompetenzId'
      | 'hkId',
      number
    >
  > &
  Partial<
    Record<
      | 'handlungskompetenzIds'
      | 'hkIds',
      number[]
    >
  >;

@Component({
  selector: 'app-hk-overview',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hk-overview.html',
  styleUrl: './hk-overview.css',
})
export class HkOverview {
  readonly state = inject(BildungsplanStateService);

  readonly searchTerm = signal('');

  readonly visibleHandlungskompetenzen = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const items = this.state.handlungskompetenzen();

    if (!term) {
      return items;
    }

    return items.filter((hk) => {
      const searchableText = [
        this.hkCode(hk),
        this.hkTitle(hk),
        this.hkDescription(hk),
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

  hkId(hk: Handlungskompetenz): number {
    return (hk as HkCard).id ?? 0;
  }

  hkCode(hk: Handlungskompetenz): string {
    const card = hk as HkCard;

    return card.kennung ?? card.kuerzel ?? card.code ?? `HK ${card.id ?? ''}`;
  }

  hkTitle(hk: Handlungskompetenz): string {
    const card = hk as HkCard;

    return card.titel ?? card.bezeichnung ?? card.name ?? 'Unbenannte Handlungskompetenz';
  }

  hkDescription(hk: Handlungskompetenz): string {
    const card = hk as HkCard;

    return card.beschreibung ?? card.kurzbeschreibung ?? 'Keine Beschreibung vorhanden.';
  }

  hkbLabel(hk: Handlungskompetenz): string {
    const card = hk as HkCard;
    const hkbId =
      card.handlungskompetenzbereichId ?? card.hkbId ?? card.bereichId;

    if (!hkbId) {
      return 'HKB offen';
    }

    return `HKB ${hkbId}`;
  }

  lehrjahrLabel(hk: Handlungskompetenz): string {
    const card = hk as HkCard;

    if (!card.lehrjahr) {
      return 'Lehrjahr offen';
    }

    return `${card.lehrjahr}. Lehrjahr`;
  }

  moduleCount(hk: Handlungskompetenz): number {
    const id = this.hkId(hk);

    return this.state.module().filter((modul) => {
      const reference = modul as ModulReference;

      return (
        reference.handlungskompetenzId === id ||
        reference.hkId === id ||
        reference.handlungskompetenzIds?.includes(id) ||
        reference.hkIds?.includes(id)
      );
    }).length;
  }

  moduleCountLabel(hk: Handlungskompetenz): string {
    const count = this.moduleCount(hk);

    if (count === 1) {
      return '1 Modul';
    }

    if (count > 1) {
      return `${count} Module`;
    }

    return 'Module';
  }

  contextLabel(): string {
    return this.state.contextLabel();
  }
}