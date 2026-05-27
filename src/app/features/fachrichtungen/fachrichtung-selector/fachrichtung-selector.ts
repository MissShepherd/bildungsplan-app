import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

import { Fachrichtung } from '../../../models/fachrichtung.model';

@Component({
  selector: 'app-fachrichtung-selector',
  imports: [],
  templateUrl: './fachrichtung-selector.html',
  styleUrl: './fachrichtung-selector.css',
})
export class FachrichtungSelector {
  @Input({ required: true }) fachrichtungen: Fachrichtung[] = [];
  @Input() disabled = false;

  @Output() selectedFachrichtungChange = new EventEmitter<Fachrichtung | null>();

  readonly selectedFachrichtungId = signal<number | null>(null);

  onSelectionChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    if (!value) {
      this.selectedFachrichtungId.set(null);
      this.selectedFachrichtungChange.emit(null);
      return;
    }

    const selectedId = Number(value);
    const selectedFachrichtung =
      this.fachrichtungen.find((fachrichtung) => fachrichtung.id === selectedId) ?? null;

    this.selectedFachrichtungId.set(selectedFachrichtung?.id ?? null);
    this.selectedFachrichtungChange.emit(selectedFachrichtung);
  }
}