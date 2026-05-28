import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ModulService } from '../../../core/services/modul.service';
import { Handlungskompetenz } from '../../../models/handlungskompetenz.model';
import { Modul } from '../../../models/modul.model';

@Component({
  selector: 'app-modul-detail',
  imports: [RouterLink],
  templateUrl: './modul-detail.html',
  styleUrl: './modul-detail.css',
})
export class ModulDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly modulService = inject(ModulService);

  readonly modul = signal<Modul | null>(null);
  readonly handlungskompetenzen = signal<Handlungskompetenz[]>([]);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = Number(params.get('id'));

        if (!Number.isInteger(id) || id <= 0) {
          this.error.set('Ungültige ID für das Modul.');
          return;
        }

        void this.loadDetail(id);
      });
  }

  private async loadDetail(id: number): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    this.modul.set(null);
    this.handlungskompetenzen.set([]);

    try {
      const [modul, handlungskompetenzen] = await Promise.all([
        firstValueFrom(this.modulService.getById(id)),
        firstValueFrom(this.modulService.getHandlungskompetenzen(id)),
      ]);

      this.modul.set(modul);
      this.handlungskompetenzen.set(handlungskompetenzen);
    } catch (error) {
      this.error.set(this.getErrorMessage(error));
    } finally {
      this.isLoading.set(false);
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Die API ist nicht erreichbar. Bitte prüfen, ob das Backend gestartet ist.';
      }

      if (error.status === 404) {
        return 'Das Modul wurde nicht gefunden.';
      }

      return `Beim Laden des Moduls ist ein Fehler aufgetreten. Status: ${error.status}`;
    }

    return 'Beim Laden des Moduls ist ein unbekannter Fehler aufgetreten.';
  }
}