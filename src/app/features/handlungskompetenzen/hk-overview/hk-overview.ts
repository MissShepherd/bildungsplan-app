import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BildungsplanStateService } from '../../../core/state/bildungsplan-state.service';
import { Handlungskompetenz } from '../../../models/handlungskompetenz.model';
import { Modul } from '../../../models/modul.model';
import { ActiveFilterChipsComponent } from '../../../shared/components/active-filter-chips/active-filter-chips';

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
  Partial<Record<'handlungskompetenzId' | 'hkId', number>> &
  Partial<Record<'handlungskompetenzIds' | 'hkIds', number[]>>;

@Component({
  selector: 'app-hk-overview',
  standalone: true,
  imports: [RouterLink, ActiveFilterChipsComponent],
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
        this.hkbLabel(hk),
        this.lehrjahrLabel(hk),
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

    return card.kennung || card.kuerzel || card.code || `HK ${hk.id}`;
  }

  hkTitle(hk: Handlungskompetenz): string {
    const card = hk as HkCard;
    const code = this.hkCode(hk);

    const title =
      card.titel ||
      card.bezeichnung ||
      card.name ||
      card.kurzbeschreibung ||
      card.beschreibung ||
      `Handlungskompetenz ${code}`;

    return this.removeLeadingCode(title, code);
  }

  hkDescription(hk: Handlungskompetenz): string {
    const card = hk as HkCard;
    const description = card.beschreibung || card.kurzbeschreibung || '';
    const title = this.hkTitle(hk);

    if (!description || this.normalise(description) === this.normalise(title)) {
      return '';
    }

    return this.removeLeadingCode(description, this.hkCode(hk));
  }

  hkbLabel(hk: Handlungskompetenz): string {
    if (hk.handlungskompetenzbereichKennung) {
      return `HKB ${hk.handlungskompetenzbereichKennung}`;
    }

    if (hk.handlungskompetenzbereichId) {
      return `HKB ${hk.handlungskompetenzbereichId}`;
    }

    return 'HKB offen';
  }

  lehrjahrLabel(hk: Handlungskompetenz): string {
    if (!hk.lehrjahr) {
      return 'Lehrjahr offen';
    }

    return `${hk.lehrjahr}. Lehrjahr`;
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

  contextShortLabel(): string {
    const label = this.state.contextLabel();

    if (label.toLowerCase().includes('informatiker')) {
      return 'Informatiker/in EFZ';
    }

    if (label.length > 32) {
      return `${label.slice(0, 29)}...`;
    }

    return label;
  }

  private removeLeadingCode(value: string, code: string): string {
    const trimmed = value.trim();
    const lowerValue = trimmed.toLowerCase();
    const lowerCode = code.toLowerCase();

    if (lowerValue.startsWith(`${lowerCode} `)) {
      return trimmed.slice(code.length).trim();
    }

    return trimmed;
  }

  private normalise(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, ' ');
  }
}