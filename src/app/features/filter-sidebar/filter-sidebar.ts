import { Component, inject, OnInit } from '@angular/core';

import { BildungsplanContextService } from '../../core/services/bildungsplan-context.service';
import { EfzService } from '../../core/services/efz.service';
import { FachrichtungService } from '../../core/services/fachrichtung.service';
import { BildungsplanStateService } from '../../core/state/bildungsplan-state.service';
import { Efz } from '../../models/efz.model';
import { Fachrichtung } from '../../models/fachrichtung.model';

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  templateUrl: './filter-sidebar.html',
  styleUrl: './filter-sidebar.css',
})
export class FilterSidebarComponent implements OnInit {
  readonly state = inject(BildungsplanStateService);

  private readonly efzService = inject(EfzService);
  private readonly fachrichtungService = inject(FachrichtungService);
  private readonly contextService = inject(BildungsplanContextService);

  ngOnInit(): void {
    this.loadEfzList();
  }

  selectEfz(efz: Efz): void {
    this.state.selectEfz(efz);
    this.loadFachrichtungen(efz.id);
  }

  selectFachrichtung(fachrichtung: Fachrichtung): void {
    this.state.selectFachrichtung(fachrichtung);
    this.loadContextForFachrichtung(fachrichtung.id);
  }

  clearSelection(): void {
    this.state.clearAll();
    this.loadEfzList();
  }

  private loadEfzList(): void {
    this.state.setLoading(true);
    this.state.setError(null);

    this.efzService.getAll().subscribe({
      next: (efzList) => {
        this.state.setEfzList(efzList);
        this.state.setLoading(false);
      },
      error: () => {
        this.state.setError('Die EFZ-Liste konnte nicht geladen werden.');
        this.state.setLoading(false);
      },
    });
  }

  private loadFachrichtungen(efzId: number): void {
    this.state.setLoading(true);
    this.state.setError(null);

    this.fachrichtungService.getByEfzId(efzId).subscribe({
      next: (fachrichtungen) => {
        this.state.setFachrichtungen(fachrichtungen);
        this.state.setLoading(false);

        if (fachrichtungen.length === 0) {
          this.loadContextForEfz(efzId);
        }
      },
      error: () => {
        this.state.setError(
          'Die Fachrichtungen zum ausgewählten EFZ konnten nicht geladen werden.'
        );
        this.state.setLoading(false);
      },
    });
  }

  private loadContextForEfz(efzId: number): void {
    this.state.setLoading(true);
    this.state.setError(null);

    this.contextService.loadByEfz(efzId).subscribe({
      next: (data) => {
        this.state.setHandlungskompetenzbereiche(
          data.handlungskompetenzbereiche
        );
        this.state.setHandlungskompetenzen(data.handlungskompetenzen);
        this.state.setModule(data.module);
        this.state.setLoading(false);
      },
      error: () => {
        this.state.setError(
          'Die Bildungsplandaten zum ausgewählten EFZ konnten nicht geladen werden.'
        );
        this.state.setLoading(false);
      },
    });
  }

  private loadContextForFachrichtung(fachrichtungId: number): void {
    this.state.setLoading(true);
    this.state.setError(null);

    this.contextService.loadByFachrichtung(fachrichtungId).subscribe({
      next: (data) => {
        this.state.setLernorte(data.lernorte);
        this.state.setHandlungskompetenzbereiche(data.handlungskompetenzbereiche);
        this.state.setHandlungskompetenzen(data.handlungskompetenzen);
        this.state.setModule(data.module);
        this.state.setLoading(false);
      },
      error: () => {
        this.state.setError(
          'Die Bildungsplandaten zur ausgewählten Fachrichtung konnten nicht geladen werden.'
        );
        this.state.setLoading(false);
      },
    });
  }
}