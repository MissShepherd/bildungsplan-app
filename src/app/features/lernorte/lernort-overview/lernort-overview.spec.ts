import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LernortOverview } from './lernort-overview';
import { BildungsplanStateService } from '../../../core/state/bildungsplan-state.service';
import { Efz } from '../../../models/efz.model';
import { Lernort } from '../../../models/lernort.model';
import { Modul } from '../../../models/modul.model';

describe('LernortOverview', () => {
  let component: LernortOverview;
  let fixture: ComponentFixture<LernortOverview>;
  let state: BildungsplanStateService;

  const efz: Efz = {
    id: 1,
    titel: 'Informatikerin/Informatiker',
    beschreibung: 'EFZ Informatik',
    fachrichtungen: [],
  };

  const lernortBetrieb: Lernort = {
    id: 1,
    kennung: 'BET',
    beschreibung: 'Betrieb',
  };

  const lernortSchule: Lernort = {
    id: 2,
    kennung: 'BFS',
    beschreibung: 'Berufsfachschule',
  };

  const lernortUek: Lernort = {
    id: 3,
    kennung: 'UEK',
    beschreibung: 'Überbetriebliche Kurse',
  };

  const modulBetrieb1: Modul = {
    id: 101,
    kennung: 'M101',
    beschreibung: 'Modul im Betrieb',
    lernortId: 1,
    lehrjahr: 1,
    pflicht: true,
    efzId: 1,
    fachrichtungen: [],
    handlungskompetenzIds: [],
  };

  const modulBetrieb2: Modul = {
    id: 102,
    kennung: 'M102',
    beschreibung: 'Weiteres Modul im Betrieb',
    lernortId: 1,
    lehrjahr: 2,
    pflicht: false,
    efzId: 1,
    fachrichtungen: [],
    handlungskompetenzIds: [],
  };

  const modulSchule: Modul = {
    id: 201,
    kennung: 'M201',
    beschreibung: 'Modul in der Berufsfachschule',
    lernortId: 2,
    lehrjahr: 1,
    pflicht: true,
    efzId: 1,
    fachrichtungen: [],
    handlungskompetenzIds: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LernortOverview],
      providers: [
        BildungsplanStateService,
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LernortOverview);
    component = fixture.componentInstance;
    state = TestBed.inject(BildungsplanStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return all visible lernorte when search term is empty', () => {
    state.setLernorte([lernortBetrieb, lernortSchule, lernortUek]);

    expect(component.visibleLernorte()).toEqual([
      lernortBetrieb,
      lernortSchule,
      lernortUek,
    ]);
  });

  it('should filter lernorte by kennung', () => {
    state.setLernorte([lernortBetrieb, lernortSchule, lernortUek]);
    component.searchTerm.set('bfs');

    expect(component.visibleLernorte()).toEqual([lernortSchule]);
  });

  it('should filter lernorte by beschreibung', () => {
    state.setLernorte([lernortBetrieb, lernortSchule, lernortUek]);
    component.searchTerm.set('kurse');

    expect(component.visibleLernorte()).toEqual([lernortUek]);
  });

  it('should update and clear search term', () => {
    component.updateSearchTerm({
      target: { value: 'betrieb' },
    } as unknown as Event);

    expect(component.searchTerm()).toBe('betrieb');

    component.clearSearch();

    expect(component.searchTerm()).toBe('');
  });

  it('should return lernort id', () => {
    expect(component.lernortId(lernortBetrieb)).toBe(1);
  });

  it('should count modules for selected lernort', () => {
    state.setModule([modulBetrieb1, modulBetrieb2, modulSchule]);

    expect(component.moduleCount(lernortBetrieb)).toBe(2);
    expect(component.moduleCount(lernortSchule)).toBe(1);
    expect(component.moduleCount(lernortUek)).toBe(0);
  });

  it('should return module count labels', () => {
    state.setModule([modulBetrieb1, modulBetrieb2, modulSchule]);

    expect(component.moduleCountLabel(lernortBetrieb)).toBe('2 Module');
    expect(component.moduleCountLabel(lernortSchule)).toBe('1 Modul');
    expect(component.moduleCountLabel(lernortUek)).toBe('Keine Module');
  });

  it('should return context label from state', () => {
    expect(component.contextLabel()).toBe('Kein EFZ ausgewählt');

    state.selectEfz(efz);
    state.setFachrichtungen([]);

    expect(component.contextLabel()).toBe('Informatikerin/Informatiker');
  });
});