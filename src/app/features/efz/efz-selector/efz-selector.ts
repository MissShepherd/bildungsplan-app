import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';

import { EfzService } from '../../../core/services/efz.service';
import { Efz } from '../../../models/efz.model';

@Component({
  selector: 'app-efz-selector',
  imports: [],
  templateUrl: './efz-selector.html',
  styleUrl: './efz-selector.css',
})
export class EfzSelector implements OnInit {
  private readonly efzService = inject(EfzService);

  @Output() selectedEfzChange = new EventEmitter<Efz | null>();

  readonly efzList = signal<Efz[]>([]);
  readonly selectedEfzId = signal<number | null>(null);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadEfz();
  }

  loadEfz(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.efzService.getAll().subscribe({
      next: (efzList) => {
        this.efzList.set(efzList);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Die EFZ konnten nicht geladen werden.');
        this.isLoading.set(false);
      },
    });
  }

  onSelectionChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;

    if (!value) {
      this.selectedEfzId.set(null);
      this.selectedEfzChange.emit(null);
      return;
    }

    const selectedId = Number(value);
    const selectedEfz = this.efzList().find((efz) => efz.id === selectedId) ?? null;

    this.selectedEfzId.set(selectedEfz?.id ?? null);
    this.selectedEfzChange.emit(selectedEfz);
  }
}