import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FilterSidebarComponent } from './features/filter-sidebar/filter-sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FilterSidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}