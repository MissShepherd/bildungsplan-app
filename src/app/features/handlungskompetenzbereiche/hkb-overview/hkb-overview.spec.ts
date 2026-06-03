import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HkbOverview } from './hkb-overview';
import { BildungsplanStateService } from '../../../core/state/bildungsplan-state.service';
import { Efz } from '../../../models/efz.model';
import { Fachrichtung } from '../../../models/fachrichtung.model';
import { Handlungskompetenz } from '../../../models/handlungskompetenz.model';
import { Handlungskompetenzbereich } from '../../../models/handlungskompetenzbereich.model';

describe('HkbOverview', () => {
  let component: HkbOverview;
  let fixture: ComponentFixture<HkbOverview>;
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

  const hkbA: Handlungskompetenzbereich = {
    id: 1,
    efzId: 1,
    fachrichtungId: null,
    kennung: 'a',
    beschreibung: 'HKB A Begleiten von ICT-Projekten',
    handlungskompetenzen: [1, 2],
  };

  const hkbB: Handlungskompetenzbereich = {
    id: 2,
    efzId: 1,
    fachrichtungId: null,
    kennung: 'b',
    beschreibung: 'Unterstützen und Beraten im ICT-Umfeld',
    handlungskompetenzen: [],
  };

  const hkbWithTitle = {
    id: 3,
    efzId: 1,
    fachrichtungId: null,
    kennung: 'hkb c',
    titel: 'HKB C Daten aufbereiten',
    beschreibung: 'HKB C Daten aufbereiten und bewerten',
    handlungskompetenzen: [],
  } as Handlungskompetenzbereich & { titel: string };

  const hkA1: Handlungskompetenz = {
    id: 1,
    handlungskompetenzbereichId: 1,
    handlungskompetenzbereichKennung: 'a',
    kennung: 'a1',
    beschreibung: 'Aufträge klären',
    lehrjahr: 1,
    modulIds: [101],
  };

  const hkA2: Handlungskompetenz = {
    id: 2,
    handlungskompetenzbereichId: 1,
    handlungskompetenzbereichKennung: 'a',
    kennung: 'a2',
    beschreibung: 'Projekt planen',
    lehrjahr: 1,
    modulIds: [102],
  };

    const hkB1 = {
      id: 3,
      handlungskompetenzbereichId: 999,
      handlungskompetenzbereichKennung: 'b',
      hkbId: 2,
      kennung: 'b1',
      beschreibung: 'Kunden beraten',
      lehrjahr: 2,
      modulIds: [],
    } as Handlungskompetenz & { hkbId: number };

    const hkC1 = {
      id: 4,
      handlungskompetenzbereichId: 999,
      handlungskompetenzbereichKennung: 'c',
      bereichId: 3,
      kennung: 'c1',
      beschreibung: 'Daten prüfen',
      lehrjahr: 2,
      modulIds: [],
    } as Handlungskompetenz & { bereichId: number };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HkbOverview],
      providers: [BildungsplanStateService],
    }).compileComponents();

    fixture = TestBed.createComponent(HkbOverview);
    component = fixture.componentInstance;
    state = TestBed.inject(BildungsplanStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return all HKB entries when search term is empty', () => {
    state.setHandlungskompetenzbereiche([hkbA, hkbB]);

    expect(component.visibleHandlungskompetenzbereiche()).toEqual([hkbA, hkbB]);
  });

  it('should filter HKB entries by search term in description', () => {
    state.setHandlungskompetenzbereiche([hkbA, hkbB]);
    component.searchTerm.set('beraten');

    expect(component.visibleHandlungskompetenzbereiche()).toEqual([hkbB]);
  });

  it('should filter HKB entries by code', () => {
    state.setHandlungskompetenzbereiche([hkbA, hkbB]);
    component.searchTerm.set('hkb a');

    expect(component.visibleHandlungskompetenzbereiche()).toEqual([hkbA]);
  });

  it('should update and clear search term', () => {
    component.updateSearchTerm({
      target: { value: 'projekt' },
    } as unknown as Event);

    expect(component.searchTerm()).toBe('projekt');

    component.clearSearch();

    expect(component.searchTerm()).toBe('');
  });

  it('should return HKB id and formatted code', () => {
    expect(component.hkbId(hkbA)).toBe(1);
    expect(component.hkbCode(hkbA)).toBe('HKB A');
    expect(component.hkbCode(hkbWithTitle)).toBe('HKB C');
  });

  it('should return HKB title without leading code', () => {
    expect(component.hkbTitle(hkbA)).toBe('Begleiten von ICT-Projekten');
    expect(component.hkbTitle(hkbWithTitle)).toBe('Daten aufbereiten');
  });

  it('should return HKB description without duplicated title', () => {
    const hkbSameDescription: Handlungskompetenzbereich = {
      id: 4,
      efzId: 1,
      fachrichtungId: null,
      kennung: 'd',
      beschreibung: 'Ausliefern und Betreiben von ICT-Lösungen',
      handlungskompetenzen: [],
    };

    expect(component.hkbDescription(hkbSameDescription)).toBe('');
    expect(component.hkbDescription(hkbWithTitle)).toBe(
      'Daten aufbereiten und bewerten'
    );
  });

  it('should count related handlungskompetenzen by handlungskompetenzbereichId', () => {
    state.setHandlungskompetenzen([hkA1, hkA2]);

    expect(component.handlungskompetenzCount(hkbA)).toBe(2);
    expect(component.handlungskompetenzCountLabel(hkbA)).toBe(
      '2 Handlungskompetenzen'
    );
  });

  it('should count related handlungskompetenzen by hkbId and bereichId', () => {
    state.setHandlungskompetenzen([hkB1, hkC1]);

    expect(component.handlungskompetenzCount(hkbB)).toBe(1);
    expect(component.handlungskompetenzCount(hkbWithTitle)).toBe(1);
  });

  it('should return singular and fallback count labels', () => {
    state.setHandlungskompetenzen([hkA1]);

    expect(component.handlungskompetenzCountLabel(hkbA)).toBe(
      '1 Handlungskompetenz'
    );
    expect(component.handlungskompetenzCountLabel(hkbB)).toBe(
      'Handlungskompetenzen'
    );
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
    expect(component.fachrichtungShortLabel()).toBe('Applikationsentwicklung');
  });

  it('should shorten long context labels', () => {
    state.selectEfz(longEfz);
    state.setFachrichtungen([]);

    const shortLabel = component.contextShortLabel();

    expect(shortLabel).toContain('Sehr langer EFZ Name');
    expect(shortLabel.endsWith('...')).toBe(true);
    expect(shortLabel.length).toBeLessThanOrEqual(32);
  });

  it('should return null when no fachrichtung is selected', () => {
    expect(component.fachrichtungShortLabel()).toBeNull();
  });

  it('should use fachrichtung fallback label when title is empty', () => {
    const emptyFachrichtung: Fachrichtung = {
      id: 99,
      titel: '',
      beschreibung: '',
      efzId: 1,
    };

    state.selectEfz(efz);
    state.setFachrichtungen([emptyFachrichtung]);
    state.selectFachrichtung(emptyFachrichtung);

    expect(component.fachrichtungShortLabel()).toBe('Fachrichtung 99');
  });
});