import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulOverview } from './modul-overview';
import { BildungsplanStateService } from '../../../core/state/bildungsplan-state.service';
import { Efz } from '../../../models/efz.model';
import { Fachrichtung } from '../../../models/fachrichtung.model';
import { Lernort } from '../../../models/lernort.model';
import { Modul } from '../../../models/modul.model';

describe('ModulOverview', () => {
  let component: ModulOverview;
  let fixture: ComponentFixture<ModulOverview>;
  let state: BildungsplanStateService;

  const efz: Efz = {
    id: 1,
    titel: 'Informatikerin/Informatiker',
    beschreibung: 'EFZ Informatik',
    fachrichtungen: [10],
  };

  const longEfz: Efz = {
    id: 2,
    titel: 'Sehr langer EFZ Name für eine gekürzte Kontextanzeige',
    beschreibung: 'Langer EFZ',
    fachrichtungen: [],
  };

  const fachrichtung: Fachrichtung = {
    id: 10,
    titel: 'Applikationsentwicklung',
    beschreibung: 'Fachrichtung Applikationsentwicklung',
    efzId: 1,
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

  const pflichtmodul: Modul = {
    id: 101,
    kennung: 'M101',
    beschreibung: 'M101 Cloud Services planen',
    lernortId: 1,
    lehrjahr: 1,
    pflicht: true,
    efzId: 1,
    fachrichtungen: [10],
    handlungskompetenzIds: [1],
  };

  const wahlmodul: Modul = {
    id: 102,
    kennung: 'M102',
    beschreibung: 'M102 Webapplikation umsetzen',
    lernortId: 2,
    lehrjahr: 2,
    pflicht: false,
    efzId: 1,
    fachrichtungen: [10],
    handlungskompetenzIds: [1],
  };

  const offenesModul: Modul = {
    id: 103,
    kennung: 'M103',
    beschreibung: 'M103 Modul ohne Typ',
    lernortId: 1,
    lehrjahr: null,
    pflicht: null,
    efzId: 1,
    fachrichtungen: [10],
    handlungskompetenzIds: [1],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModulOverview],
      providers: [BildungsplanStateService],
    }).compileComponents();

    fixture = TestBed.createComponent(ModulOverview);
    component = fixture.componentInstance;
    state = TestBed.inject(BildungsplanStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return all modules when no optional filters are selected', () => {
    state.setModule([pflichtmodul, wahlmodul, offenesModul]);

    expect(component.moduleForCurrentSelection()).toEqual([
      pflichtmodul,
      wahlmodul,
      offenesModul,
    ]);
  });

  it('should filter modules by selected lernort', () => {
    state.setLernorte([lernortBetrieb, lernortSchule]);
    state.setModule([pflichtmodul, wahlmodul, offenesModul]);
    state.selectLernort(lernortBetrieb);

    expect(component.moduleForCurrentSelection()).toEqual([
      pflichtmodul,
      offenesModul,
    ]);
  });

  it('should filter modules by selected lehrjahr', () => {
    state.setModule([pflichtmodul, wahlmodul, offenesModul]);
    state.toggleLehrjahr(2);

    expect(component.moduleForCurrentSelection()).toEqual([wahlmodul]);
  });

  it('should filter modules by selected modultyp', () => {
    state.setModule([pflichtmodul, wahlmodul, offenesModul]);
    state.toggleModultyp('Pflichtmodul');

    expect(component.moduleForCurrentSelection()).toEqual([pflichtmodul]);
  });

  it('should combine lernort, lehrjahr and modultyp filters', () => {
    state.setLernorte([lernortBetrieb, lernortSchule]);
    state.setModule([pflichtmodul, wahlmodul, offenesModul]);
    state.selectLernort(lernortBetrieb);
    state.toggleLehrjahr(1);
    state.toggleModultyp('Pflichtmodul');

    expect(component.moduleForCurrentSelection()).toEqual([pflichtmodul]);
  });

  it('should filter visible modules by search term', () => {
    state.setModule([pflichtmodul, wahlmodul, offenesModul]);
    component.searchTerm.set('webapplikation');

    expect(component.visibleFilteredModule()).toEqual([wahlmodul]);
  });

  it('should return all visible modules when search term is empty', () => {
    state.setModule([pflichtmodul, wahlmodul]);
    component.searchTerm.set('   ');

    expect(component.visibleFilteredModule()).toEqual([pflichtmodul, wahlmodul]);
  });

  it('should update and clear search term', () => {
    component.updateSearchTerm({
      target: { value: 'cloud' },
    } as unknown as Event);

    expect(component.searchTerm()).toBe('cloud');

    component.clearSearch();

    expect(component.searchTerm()).toBe('');
  });

  it('should return module id, code, title and description', () => {
    const modulWithTitle: Modul & { titel: string } = {
      ...pflichtmodul,
      titel: 'M101 Cloud Services',
    };

    expect(component.modulId(modulWithTitle)).toBe(101);
    expect(component.modulCode(modulWithTitle)).toBe('M101');
    expect(component.modulTitle(modulWithTitle)).toBe('Cloud Services');
    expect(component.modulDescription(modulWithTitle)).toBe(
      'Cloud Services planen'
    );
  });

  it('should use fallback title when no title fields are available', () => {
    const minimalModul: Modul = {
      id: 104,
      kennung: '',
      beschreibung: '',
      lernortId: null,
      lehrjahr: null,
      pflicht: null,
      efzId: 1,
      fachrichtungen: [],
      handlungskompetenzIds: [],
    };

    expect(component.modulCode(minimalModul)).toBe('104');
    expect(component.modulTitle(minimalModul)).toBe('Modul 104');
    expect(component.modulDescription(minimalModul)).toBe('');
  });

  it('should return module type labels', () => {
    expect(component.modulType(pflichtmodul)).toBe('Pflichtmodul');
    expect(component.modulType(wahlmodul)).toBe('Wahlmodul');
    expect(component.modulType(offenesModul)).toBe('Modultyp offen');
  });

  it('should return lehrjahr labels', () => {
    expect(component.lehrjahrLabel(pflichtmodul)).toBe('1. Lehrjahr');
    expect(component.lehrjahrLabel(offenesModul)).toBe('Lehrjahr offen');
  });

  it('should return lernort labels', () => {
    state.setLernorte([lernortBetrieb]);

    expect(component.lernortLabel(pflichtmodul)).toBe('Betrieb');

    const modulWithUnknownLernort: Modul = {
      ...pflichtmodul,
      lernortId: 99,
    };

    const modulWithoutLernort: Modul = {
      ...pflichtmodul,
      lernortId: null,
    };

    expect(component.lernortLabel(modulWithUnknownLernort)).toBe('Lernort 99');
    expect(component.lernortLabel(modulWithoutLernort)).toBe('Lernort offen');
  });

  it('should return selected lernort label', () => {
    expect(component.selectedLernortLabel()).toBe('Alle Lernorte');

    state.setLernorte([lernortBetrieb]);
    state.selectLernort(lernortBetrieb);

    expect(component.selectedLernortLabel()).toBe('Betrieb');
  });

  it('should return context labels', () => {
    expect(component.contextLabel()).toBe('Kein EFZ ausgewählt');

    state.selectEfz(efz);
    state.setFachrichtungen([fachrichtung]);
    state.selectFachrichtung(fachrichtung);

    expect(component.contextLabel()).toBe(
      'Informatikerin/Informatiker / Applikationsentwicklung'
    );
    expect(component.contextShortLabel()).toBe('Informatiker/in EFZ');
  });

it('should shorten long context labels', () => {
  state.selectEfz(longEfz);
  state.setFachrichtungen([]);

  const shortLabel = component.contextShortLabel();

  expect(shortLabel).toContain('Sehr langer EFZ Name');
  expect(shortLabel.endsWith('...')).toBe(true);
  expect(shortLabel.length).toBeLessThanOrEqual(32);
});
});