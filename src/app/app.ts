import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { BildungsplanStateService } from './core/state/bildungsplan-state.service';
import { FilterSidebarComponent } from './features/filter-sidebar/filter-sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FilterSidebarComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly title = 'bildungsplan-frontend';
  readonly state = inject(BildungsplanStateService);
}