import { Component, input, output, signal } from '@angular/core';

import { Fachrichtung } from '../../../models/fachrichtung.model';

@Component({
  selector: 'app-fachrichtung-selector',
  standalone: true,
  templateUrl: './fachrichtung-selector.html',
  styleUrl: './fachrichtung-selector.css',
})
export class FachrichtungSelector {
  readonly fachrichtungen = input<Fachrichtung[]>([]);
  readonly disabled = input(false);

  readonly fachrichtungSelected = output<Fachrichtung | null>();
  readonly selectedFachrichtungChange = output<Fachrichtung | null>();

  readonly selectedFachrichtungId = signal<number | null>(null);

  selectFachrichtung(fachrichtung: Fachrichtung): void {
    if (this.disabled()) {
      return;
    }

    this.selectedFachrichtungId.set(fachrichtung.id);
    this.fachrichtungSelected.emit(fachrichtung);
    this.selectedFachrichtungChange.emit(fachrichtung);
  }
}