import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BildungsplanStateService } from '../../../core/state/bildungsplan-state.service';
import { Modul } from '../../../models/modul.model';
import { ActiveFilterChipsComponent } from '../../../shared/components/active-filter-chips/active-filter-chips';

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
  Partial<Record<'id' | 'lehrjahr' | 'lernortId', number>>;

@Component({
  selector: 'app-modul-overview',
  standalone: true,
  imports: [RouterLink, ActiveFilterChipsComponent],
  templateUrl: './modul-overview.html',
  styleUrl: './modul-overview.css',
})
export class ModulOverview {
  readonly state = inject(BildungsplanStateService);

  readonly searchTerm = signal('');

  readonly moduleForCurrentSelection = computed(() => {
    const selectedLernortId = this.state.selectedLernortId();
    const selectedLehrjahre = this.state.selectedLehrjahre();
    const selectedModultypen = this.state.selectedModultypen();

    return this.state.module().filter((modul) => {
      const matchesLernort =
        selectedLernortId === null || modul.lernortId === selectedLernortId;

      const matchesLehrjahr =
        selectedLehrjahre.length === 0 ||
        (modul.lehrjahr !== null &&
          modul.lehrjahr !== undefined &&
          selectedLehrjahre.includes(modul.lehrjahr));

      const matchesModultyp =
        selectedModultypen.length === 0 ||
        selectedModultypen.includes(this.modulType(modul));

      return matchesLernort && matchesLehrjahr && matchesModultyp;
    });
  });

  readonly visibleFilteredModule = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const items = this.moduleForCurrentSelection();

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
        this.lernortLabel(modul),
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
    const card = modul as ModulCard;

    return String(card.kennung || card.nummer || modul.id || 'Modul');
  }

  modulTitle(modul: Modul): string {
    const card = modul as ModulCard;
    const code = this.modulCode(modul);

    const title =
      card.titel ||
      card.bezeichnung ||
      card.name ||
      card.kurzbeschreibung ||
      card.beschreibung ||
      `Modul ${code}`;

    return this.removeLeadingCode(title, code);
  }

  modulDescription(modul: Modul): string {
    const card = modul as ModulCard;
    const description = card.beschreibung || card.kurzbeschreibung || '';
    const title = this.modulTitle(modul);

    if (!description || this.normalise(description) === this.normalise(title)) {
      return '';
    }

    return this.removeLeadingCode(description, this.modulCode(modul));
  }

  modulType(modul: Modul): string {
    if (modul.pflicht === true) {
      return 'Pflichtmodul';
    }

    if (modul.pflicht === false) {
      return 'Wahlmodul';
    }

    return 'Modultyp offen';
  }

  lehrjahrLabel(modul: Modul): string {
    if (!modul.lehrjahr) {
      return 'Lehrjahr offen';
    }

    return `${modul.lehrjahr}. Lehrjahr`;
  }

  lernortLabel(modul: Modul): string {
    const lernort = this.state.lernorte().find(
      (item) => item.id === modul.lernortId
    );

    if (lernort) {
      return lernort.beschreibung || lernort.kennung || `Lernort ${lernort.id}`;
    }

    if (modul.lernortId) {
      return `Lernort ${modul.lernortId}`;
    }

    return 'Lernort offen';
  }

  selectedLernortLabel(): string {
    const selectedLernort = this.state.selectedLernort();

    if (!selectedLernort) {
      return 'Alle Lernorte';
    }

    return (
      selectedLernort.beschreibung ||
      selectedLernort.kennung ||
      `Lernort ${selectedLernort.id}`
    );
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

    if (lowerValue.startsWith(`modul ${lowerCode} `)) {
      return trimmed.slice(`Modul ${code}`.length).trim();
    }

    return trimmed;
  }

  private normalise(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, ' ');
  }
}