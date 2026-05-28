import { Component, inject } from '@angular/core';
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

  modulId(modul: Modul): number {
    return (modul as ModulCard).id ?? 0;
  }

  modulCode(modul: Modul): string {
    const card = modul as ModulCard;

    return card.kennung ?? card.nummer?.toString() ?? `Modul ${card.id ?? ''}`;
  }

  modulTitle(modul: Modul): string {
    const card = modul as ModulCard;

    return card.titel ?? card.bezeichnung ?? card.name ?? 'Unbenanntes Modul';
  }

  modulDescription(modul: Modul): string {
    const card = modul as ModulCard;

    return card.beschreibung ?? card.kurzbeschreibung ?? 'Keine Beschreibung vorhanden.';
  }

  modulType(modul: Modul): string {
    const card = modul as ModulCard;

    return card.modultyp ?? card.typ ?? 'Pflichtmodul';
  }

  lehrjahrLabel(modul: Modul): string {
    const card = modul as ModulCard;

    if (!card.lehrjahr) {
      return 'Lehrjahr offen';
    }

    return `${card.lehrjahr}. Lehrjahr`;
  }

  contextLabel(): string {
    return this.state.contextLabel();
  }
}