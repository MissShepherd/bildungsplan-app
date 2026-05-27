import { Component, inject } from '@angular/core';

import { BildungsplanStateService } from '../../../core/state/bildungsplan-state.service';

@Component({
  selector: 'app-efz-page',
  standalone: true,
  templateUrl: './efz-page.html',
  styleUrl: './efz-page.css',
})
export class EfzPage {
  readonly state = inject(BildungsplanStateService);
}