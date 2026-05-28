import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Handlungskompetenzbereich } from '../../../models/handlungskompetenzbereich.model';
import { Handlungskompetenz } from '../../../models/handlungskompetenz.model';
import { Modul } from '../../../models/modul.model';

@Component({
  selector: 'app-search-results',
  imports: [RouterLink],
  templateUrl: './search-results.html',
  styleUrl: './search-results.css',
})
export class SearchResults {
  readonly searchTerm = input('');
  readonly totalResults = input(0);

  readonly hkbResults = input<Handlungskompetenzbereich[]>([]);
  readonly hkResults = input<Handlungskompetenz[]>([]);
  readonly modulResults = input<Modul[]>([]);

  readonly hasHkbResults = computed(() => this.hkbResults().length > 0);
  readonly hasHkResults = computed(() => this.hkResults().length > 0);
  readonly hasModulResults = computed(() => this.modulResults().length > 0);
}