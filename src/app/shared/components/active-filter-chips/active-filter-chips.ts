import { Component, computed, inject } from '@angular/core';

import { BildungsplanStateService } from '../../../core/state/bildungsplan-state.service';

interface ActiveFilterChip {
  id: string;
  label: string;
  remove: () => void;
}

@Component({
  selector: 'app-active-filter-chips',
  standalone: true,
  templateUrl: './active-filter-chips.html',
  styleUrl: './active-filter-chips.css',
})
export class ActiveFilterChipsComponent {
  readonly state = inject(BildungsplanStateService);

  readonly chips = computed<ActiveFilterChip[]>(() => {
    const chips: ActiveFilterChip[] = [];

    const efz = this.state.selectedEfz();
    const fachrichtung = this.state.selectedFachrichtung();
    const lernort = this.state.selectedLernort();

    if (efz) {
      chips.push({
        id: `efz-${efz.id}`,
        label: `EFZ: ${efz.titel}`,
        remove: () => this.state.clearEfzSelection(),
      });
    }

    if (fachrichtung) {
      chips.push({
        id: `fachrichtung-${fachrichtung.id}`,
        label: `Fachrichtung: ${fachrichtung.titel}`,
        remove: () => this.state.clearFachrichtungSelection(),
      });
    }

    if (lernort) {
      chips.push({
        id: `lernort-${lernort.id}`,
        label: `Lernort: ${lernort.beschreibung || lernort.kennung}`,
        remove: () => this.state.clearLernortSelection(),
      });
    }

    for (const lehrjahr of this.state.selectedLehrjahre()) {
      chips.push({
        id: `lehrjahr-${lehrjahr}`,
        label: `${lehrjahr}. Lehrjahr`,
        remove: () => this.state.removeLehrjahr(lehrjahr),
      });
    }

    for (const modultyp of this.state.selectedModultypen()) {
      chips.push({
        id: `modultyp-${modultyp}`,
        label: modultyp,
        remove: () => this.state.removeModultyp(modultyp),
      });
    }

    return chips;
  });

  readonly hasChips = computed(() => this.chips().length > 0);

  clearAll(): void {
    this.state.clearAll();
  }
}