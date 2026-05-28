import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { HandlungskompetenzService } from '../../../core/services/handlungskompetenz.service';
import { Handlungskompetenz } from '../../../models/handlungskompetenz.model';
import { Modul } from '../../../models/modul.model';

@Component({
  selector: 'app-hk-detail',
  imports: [RouterLink],
  templateUrl: './hk-detail.html',
  styleUrl: './hk-detail.css',
})
export class HkDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hkService = inject(HandlungskompetenzService);

  readonly hk = signal<Handlungskompetenz | null>(null);
  readonly module = signal<Modul[]>([]);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = Number(params.get('id'));

        if (!Number.isInteger(id) || id <= 0) {
          this.error.set('Ungültige ID für die Handlungskompetenz.');
          return;
        }

        void this.loadDetail(id);
      });
  }

  private async loadDetail(id: number): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    this.hk.set(null);
    this.module.set([]);

    try {
      const [hk, module] = await Promise.all([
        firstValueFrom(this.hkService.getById(id)),
        firstValueFrom(this.hkService.getModule(id)),
      ]);

      this.hk.set(hk);
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
        return 'Die Handlungskompetenz wurde nicht gefunden.';
      }

      return `Beim Laden der Handlungskompetenz ist ein Fehler aufgetreten. Status: ${error.status}`;
    }

    return 'Beim Laden der Handlungskompetenz ist ein unbekannter Fehler aufgetreten.';
  }
}