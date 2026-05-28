import { Routes } from '@angular/router';

import { ModulOverview } from './features/module/modul-overview/modul-overview';
import { HkbOverview } from './features/handlungskompetenzbereiche/hkb-overview/hkb-overview';
import { HkbDetail } from './features/handlungskompetenzbereiche/hkb-detail/hkb-detail';
import { HkOverview } from './features/handlungskompetenzen/hk-overview/hk-overview';
import { HkDetail } from './features/handlungskompetenzen/hk-detail/hk-detail';
import { LernortDetail } from './features/lernorte/lernort-detail/lernort-detail';
import { ModulDetail } from './features/module/modul-detail/modul-detail';
import { SearchPage } from './features/search/search-page/search-page';

export const routes: Routes = [
  {
    path: '',
    component: ModulOverview,
    title: 'Bildungsplan - Module',
  },
  {
    path: 'handlungskompetenzbereiche',
    component: HkbOverview,
    title: 'Bildungsplan - Handlungskompetenzbereiche',
  },
  {
    path: 'handlungskompetenzbereiche/:id',
    component: HkbDetail,
    title: 'Handlungskompetenzbereich',
  },
  {
    path: 'handlungskompetenzen',
    component: HkOverview,
    title: 'Bildungsplan - Handlungskompetenzen',
  },
  {
    path: 'handlungskompetenzen/:id',
    component: HkDetail,
    title: 'Handlungskompetenz',
  },
  {
    path: 'module/:id',
    component: ModulDetail,
    title: 'Modul',
  },
  {
    path: 'lernorte/:id',
    component: LernortDetail,
    title: 'Lernort',
  },
  {
    path: 'suche',
    component: SearchPage,
    title: 'Bildungsplan - Suche',
  },
  {
    path: '**',
    redirectTo: '',
  },
];