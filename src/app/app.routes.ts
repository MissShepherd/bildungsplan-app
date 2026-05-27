import { Routes } from '@angular/router';

import { EfzPage } from './features/efz/efz-page/efz-page';
import { SearchPage } from './features/search/search-page/search-page';
import { LernortDetail } from './features/lernorte/lernort-detail/lernort-detail';
import { HkbDetail } from './features/handlungskompetenzbereiche/hkb-detail/hkb-detail';
import { HkDetail } from './features/handlungskompetenzen/hk-detail/hk-detail';
import { ModulDetail } from './features/module/modul-detail/modul-detail';

export const routes: Routes = [
  {
    path: '',
    component: EfzPage,
    title: 'Bildungsplan - EFZ-Auswahl'
  },
  {
    path: 'suche',
    component: SearchPage,
    title: 'Bildungsplan - Suche'
  },
  {
    path: 'lernorte/:id',
    component: LernortDetail,
    title: 'Lernort'
  },
  {
    path: 'handlungskompetenzbereiche/:id',
    component: HkbDetail,
    title: 'Handlungskompetenzbereich'
  },
  {
    path: 'handlungskompetenzen/:id',
    component: HkDetail,
    title: 'Handlungskompetenz'
  },
  {
    path: 'module/:id',
    component: ModulDetail,
    title: 'Modul'
  },
  {
    path: '**',
    redirectTo: ''
  }
];