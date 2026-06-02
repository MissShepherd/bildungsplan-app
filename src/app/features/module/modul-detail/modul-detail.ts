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
  standalone: true,
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
  readonly relationError = signal<string | null>(null);

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
    this.relationError.set(null);
    this.modul.set(null);
    this.handlungskompetenzen.set([]);

    try {
      const modul = await firstValueFrom(this.modulService.getById(id));
      this.modul.set(modul);

      await this.loadHandlungskompetenzen(id);
    } catch (error) {
      this.error.set(this.getModulErrorMessage(error));
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadHandlungskompetenzen(modulId: number): Promise<void> {
    try {
      const handlungskompetenzen = await firstValueFrom(
        this.modulService.getHandlungskompetenzen(modulId)
      );

      this.handlungskompetenzen.set(handlungskompetenzen);
    } catch {
      this.handlungskompetenzen.set([]);
      this.relationError.set(
        'Die verknüpften Handlungskompetenzen konnten nicht geladen werden.'
      );
    }
  }

  lehrjahrLabel(modul: Modul): string {
    if (!modul.lehrjahr) {
      return 'Nicht angegeben';
    }

    return `${modul.lehrjahr}. Lehrjahr`;
  }

  modulTypeLabel(modul: Modul): string {
    if (modul.pflicht === true) {
      return 'Pflichtmodul';
    }

    if (modul.pflicht === false) {
      return 'Wahlmodul';
    }

    return 'Nicht angegeben';
  }

  lernortLabel(modul: Modul): string {
    if (!modul.lernortId) {
      return 'Nicht angegeben';
    }

    const lernorte: Record<number, string> = {
      1: 'Betrieb',
      2: 'Berufsfachschule',
      3: 'Überbetriebliche Kurse',
    };

    return lernorte[modul.lernortId] ?? `Lernort ${modul.lernortId}`;
  }

  fachrichtungenLabel(modul: Modul): string {
    if (!modul.fachrichtungen || modul.fachrichtungen.length === 0) {
      return 'Keine Angabe';
    }

    return modul.fachrichtungen.join(', ');
  }

  handlungskompetenzLabel(hk: Handlungskompetenz): string {
    return hk.kennung || `Handlungskompetenz ${hk.id}`;
  }

  handlungskompetenzDescription(hk: Handlungskompetenz): string {
    return hk.beschreibung || 'Keine Beschreibung vorhanden.';
  }

  private getModulErrorMessage(error: unknown): string {
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