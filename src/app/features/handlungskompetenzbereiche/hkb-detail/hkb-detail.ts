import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { HandlungskompetenzbereichService } from '../../../core/services/handlungskompetenzbereich.service';
import { Handlungskompetenzbereich } from '../../../models/handlungskompetenzbereich.model';
import { Handlungskompetenz } from '../../../models/handlungskompetenz.model';

@Component({
  selector: 'app-hkb-detail',
  imports: [RouterLink],
  templateUrl: './hkb-detail.html',
  styleUrl: './hkb-detail.css',
})
export class HkbDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hkbService = inject(HandlungskompetenzbereichService);

  readonly hkb = signal<Handlungskompetenzbereich | null>(null);
  readonly handlungskompetenzen = signal<Handlungskompetenz[]>([]);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const id = Number(params.get('id'));

        if (!Number.isInteger(id) || id <= 0) {
          this.error.set('Ungültige ID für den Handlungskompetenzbereich.');
          return;
        }

        void this.loadDetail(id);
      });
  }

  private async loadDetail(id: number): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);
    this.hkb.set(null);
    this.handlungskompetenzen.set([]);

    try {
      const [hkb, handlungskompetenzen] = await Promise.all([
        firstValueFrom(this.hkbService.getById(id)),
        firstValueFrom(this.hkbService.getHandlungskompetenzen(id)),
      ]);

      this.hkb.set(hkb);
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
        return 'Der Handlungskompetenzbereich wurde nicht gefunden.';
      }

      return `Beim Laden des Handlungskompetenzbereichs ist ein Fehler aufgetreten. Status: ${error.status}`;
    }

    return 'Beim Laden des Handlungskompetenzbereichs ist ein unbekannter Fehler aufgetreten.';
  }
}