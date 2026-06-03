import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HkOverview } from './hk-overview';
import { BildungsplanStateService } from '../../../core/state/bildungsplan-state.service';
import { Efz } from '../../../models/efz.model';
import { Fachrichtung } from '../../../models/fachrichtung.model';
import { Handlungskompetenz } from '../../../models/handlungskompetenz.model';
import { Modul } from '../../../models/modul.model';

describe('HkOverview', () => {
  let component: HkOverview;
  let fixture: ComponentFixture<HkOverview>;
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

  const hkA1: Handlungskompetenz = {
    id: 1,
    handlungskompetenzbereichId: 1,
    handlungskompetenzbereichKennung: 'A',
    kennung: 'a1',
    beschreibung: 'a1 Aufträge klären',
    lehrjahr: 1,
    modulIds: [101, 102],
  };

  const hkA2: Handlungskompetenz = {
    id: 2,
    handlungskompetenzbereichId: 1,
    handlungskompetenzbereichKennung: 'A',
    kennung: 'a2',
    beschreibung: 'Projekt planen',
    lehrjahr: 2,
    modulIds: [103],
  };

  const hkWithoutHkbKennung: Handlungskompetenz = {
    id: 3,
    handlungskompetenzbereichId: 5,
    handlungskompetenzbereichKennung: '',
    kennung: 'b1',
    beschreibung: 'Kunden beraten',
    lehrjahr: 3,
    modulIds: [],
  };

  const hkWithoutHkb: Handlungskompetenz = {
    id: 4,
    handlungskompetenzbereichId: 0,
    handlungskompetenzbereichKennung: '',
    kennung: '',
    beschreibung: '',
    lehrjahr: 0,
    modulIds: [],
  };

  const hkWithTitle = {
    id: 5,
    handlungskompetenzbereichId: 2,
    handlungskompetenzbereichKennung: 'B',
    kennung: 'b2',
    titel: 'b2 Supportfälle bearbeiten',
    beschreibung: 'b2 Supportfälle bearbeiten und dokumentieren',
    lehrjahr: 2,
    modulIds: [],
  } as Handlungskompetenz & { titel: string };

  const modulByIds: Modul = {
    id: 101,
    kennung: 'M101',
    beschreibung: 'Modul 101',
    lernortId: 1,
    lehrjahr: 1,
    pflicht: true,
    efzId: 1,
    fachrichtungen: [10],
    handlungskompetenzIds: [1],
  };

  const modulBySingleReference = {
    id: 102,
    kennung: 'M102',
    beschreibung: 'Modul 102',
    lernortId: 1,
    lehrjahr: 1,
    pflicht: true,
    efzId: 1,
    fachrichtungen: [10],
    handlungskompetenzIds: [],
    handlungskompetenzId: 1,
  } as Modul & { handlungskompetenzId: number };

  const modulByHkId = {
    id: 103,
    kennung: 'M103',
    beschreibung: 'Modul 103',
    lernortId: 2,
    lehrjahr: 2,
    pflicht: false,
    efzId: 1,
    fachrichtungen: [10],
    handlungskompetenzIds: [],
    hkId: 2,
  } as Modul & { hkId: number };

  const modulByHkIds = {
    id: 104,
    kennung: 'M104',
    beschreibung: 'Modul 104',
    lernortId: 2,
    lehrjahr: 2,
    pflicht: false,
    efzId: 1,
    fachrichtungen: [10],
    handlungskompetenzIds: [],
    hkIds: [5],
  } as Modul & { hkIds: number[] };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HkOverview],
      providers: [BildungsplanStateService],
    }).compileComponents();

    fixture = TestBed.createComponent(HkOverview);
    component = fixture.componentInstance;
    state = TestBed.inject(BildungsplanStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return all HK entries when search term is empty', () => {
    state.setHandlungskompetenzen([hkA1, hkA2]);

    expect(component.visibleHandlungskompetenzen()).toEqual([hkA1, hkA2]);
  });

  it('should filter HK entries by search term in description', () => {
    state.setHandlungskompetenzen([hkA1, hkA2]);
    component.searchTerm.set('projekt');

    expect(component.visibleHandlungskompetenzen()).toEqual([hkA2]);
  });

  it('should filter HK entries by code', () => {
    state.setHandlungskompetenzen([hkA1, hkA2]);
    component.searchTerm.set('a1');

    expect(component.visibleHandlungskompetenzen()).toEqual([hkA1]);
  });

  it('should filter HK entries by HKB label and lehrjahr label', () => {
    state.setHandlungskompetenzen([hkA1, hkA2]);

    component.searchTerm.set('HKB A');
    expect(component.visibleHandlungskompetenzen()).toEqual([hkA1, hkA2]);

    component.searchTerm.set('2. Lehrjahr');
    expect(component.visibleHandlungskompetenzen()).toEqual([hkA2]);
  });

  it('should update and clear search term', () => {
    component.updateSearchTerm({
      target: { value: 'auftrag' },
    } as unknown as Event);

    expect(component.searchTerm()).toBe('auftrag');

    component.clearSearch();

    expect(component.searchTerm()).toBe('');
  });

  it('should return HK id and formatted code', () => {
    expect(component.hkId(hkA1)).toBe(1);
    expect(component.hkCode(hkA1)).toBe('a1');
    expect(component.hkCode(hkWithoutHkb)).toBe('HK 4');
  });

  it('should return HK title without leading code', () => {
    expect(component.hkTitle(hkA1)).toBe('Aufträge klären');
    expect(component.hkTitle(hkWithTitle)).toBe('Supportfälle bearbeiten');
  });

  it('should return fallback title when no title fields are available', () => {
    expect(component.hkTitle(hkWithoutHkb)).toBe('Handlungskompetenz HK 4');
  });

  it('should return HK description without duplicated title', () => {
    expect(component.hkDescription(hkWithTitle)).toBe(
      'Supportfälle bearbeiten und dokumentieren'
    );

    const hkSameDescription: Handlungskompetenz = {
      id: 6,
      handlungskompetenzbereichId: 2,
      handlungskompetenzbereichKennung: 'B',
      kennung: 'b3',
      beschreibung: 'Supportfälle bearbeiten',
      lehrjahr: 2,
      modulIds: [],
    };

    expect(component.hkDescription(hkSameDescription)).toBe('');
  });

  it('should return HKB labels', () => {
    expect(component.hkbLabel(hkA1)).toBe('HKB A');
    expect(component.hkbLabel(hkWithoutHkbKennung)).toBe('HKB 5');
    expect(component.hkbLabel(hkWithoutHkb)).toBe('HKB offen');
  });

  it('should return lehrjahr labels', () => {
    expect(component.lehrjahrLabel(hkA1)).toBe('1. Lehrjahr');
    expect(component.lehrjahrLabel(hkWithoutHkb)).toBe('Lehrjahr offen');
  });

  it('should count related modules by handlungskompetenzIds and handlungskompetenzId', () => {
    state.setModule([modulByIds, modulBySingleReference]);

    expect(component.moduleCount(hkA1)).toBe(2);
    expect(component.moduleCountLabel(hkA1)).toBe('2 Module');
  });

  it('should count related modules by hkId and hkIds', () => {
    state.setModule([modulByHkId, modulByHkIds]);

    expect(component.moduleCount(hkA2)).toBe(1);
    expect(component.moduleCountLabel(hkA2)).toBe('1 Modul');

    expect(component.moduleCount(hkWithTitle)).toBe(1);
    expect(component.moduleCountLabel(hkWithTitle)).toBe('1 Modul');
  });

  it('should return fallback module count label when no module is related', () => {
    state.setModule([]);

    expect(component.moduleCount(hkA1)).toBe(0);
    expect(component.moduleCountLabel(hkA1)).toBe('Module');
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