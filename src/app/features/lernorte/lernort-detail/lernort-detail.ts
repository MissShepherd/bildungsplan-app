import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { LernortService } from '../../../core/services/lernort.service';
import { ModulService } from '../../../core/services/modul.service';
import { Lernort } from '../../../models/lernort.model';
import { Modul } from '../../../models/modul.model';

@Component({
  selector: 'app-lernort-detail',
  imports: [RouterLink],
  templateUrl: './lernort-detail.html',
  styleUrl: './lernort-detail.css',
})
export class LernortDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly lernortService = inject(LernortService);
  private readonly modulService = inject(ModulService);

  readonly lernort = signal<Lernort | null>(null);
  readonly module = signal<Modul[]>([]);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = Number(params.get('id'));

        if (!Number.isInteger(id) || id <= 0) {
          this.error.set('Ungültige ID für den Lernort.');
          return;
        }

        void this.loadDetail(id);
      });
  }

  private async loadDetail(id: number): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    this.lernort.set(null);
    this.module.set([]);

    try {
      const [lernort, module] = await Promise.all([
        firstValueFrom(this.lernortService.getById(id)),
        firstValueFrom(this.modulService.getByLernortId(id)),
      ]);

      this.lernort.set(lernort);
      this.module.set(module);
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
        return 'Der Lernort wurde nicht gefunden.';
      }

      return `Beim Laden des Lernorts ist ein Fehler aufgetreten. Status: ${error.status}`;
    }

    return 'Beim Laden des Lernorts ist ein unbekannter Fehler aufgetreten.';
  }
}