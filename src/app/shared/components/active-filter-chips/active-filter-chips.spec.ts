import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveFilterChipsComponent } from './active-filter-chips';
import { BildungsplanStateService } from '../../../core/state/bildungsplan-state.service';
import { Efz } from '../../../models/efz.model';
import { Fachrichtung } from '../../../models/fachrichtung.model';
import { Lernort } from '../../../models/lernort.model';

describe('ActiveFilterChipsComponent', () => {
  let component: ActiveFilterChipsComponent;
  let fixture: ComponentFixture<ActiveFilterChipsComponent>;
  let state: BildungsplanStateService;

  const efz: Efz = {
    id: 1,
    titel: 'Informatikerin/Informatiker',
    beschreibung: 'EFZ Informatik',
    fachrichtungen: [10],
  };

  const fachrichtung: Fachrichtung = {
    id: 10,
    titel: 'Applikationsentwicklung',
    beschreibung: 'Fachrichtung Applikationsentwicklung',
    efzId: 1,
  };

  const lernort: Lernort = {
    id: 1,
    kennung: 'BET',
    beschreibung: 'Betrieb',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveFilterChipsComponent],
      providers: [BildungsplanStateService],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveFilterChipsComponent);
    component = fixture.componentInstance;
    state = TestBed.inject(BildungsplanStateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show no active filter chips initially', () => {
    const textContent = fixture.nativeElement.textContent as string;

    expect(state.hasActiveFilters()).toBe(false);
    expect(textContent).not.toContain('Informatikerin/Informatiker');
    expect(textContent).not.toContain('Applikationsentwicklung');
    expect(textContent).not.toContain('Betrieb');
  });

  it('should render selected EFZ and fachrichtung as active filter chips', () => {
    state.selectEfz(efz);
    state.setFachrichtungen([fachrichtung]);
    state.selectFachrichtung(fachrichtung);

    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent as string;

    expect(state.hasActiveFilters()).toBe(true);
    expect(textContent).toContain('Informatikerin/Informatiker');
    expect(textContent).toContain('Applikationsentwicklung');
  });

  it('should render selected lernort as active filter chip', () => {
    state.setLernorte([lernort]);
    state.selectLernort(lernort);

    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent as string;

    expect(state.selectedLernort()).toEqual(lernort);
    expect(textContent).toContain('Betrieb');
  });

  it('should render selected lehrjahr as active filter chip', () => {
    state.toggleLehrjahr(2);

    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent as string;

    expect(state.selectedLehrjahre()).toEqual([2]);
    expect(textContent).toContain('2. Lehrjahr');
  });

  it('should render selected modultyp as active filter chip', () => {
    state.toggleModultyp('Pflichtmodul');

    fixture.detectChanges();

    const textContent = fixture.nativeElement.textContent as string;

    expect(state.selectedModultypen()).toEqual(['Pflichtmodul']);
    expect(textContent).toContain('Pflichtmodul');
  });

  it('should update rendered chips after filter state changes', () => {
    state.selectEfz(efz);
    state.setFachrichtungen([fachrichtung]);
    state.selectFachrichtung(fachrichtung);
    state.setLernorte([lernort]);
    state.selectLernort(lernort);
    state.toggleLehrjahr(1);
    state.toggleModultyp('Pflichtmodul');

    fixture.detectChanges();

    let textContent = fixture.nativeElement.textContent as string;

    expect(textContent).toContain('Informatikerin/Informatiker');
    expect(textContent).toContain('Applikationsentwicklung');
    expect(textContent).toContain('Betrieb');
    expect(textContent).toContain('1. Lehrjahr');
    expect(textContent).toContain('Pflichtmodul');

    state.clearAll();
    fixture.detectChanges();

    textContent = fixture.nativeElement.textContent as string;

    expect(state.hasActiveFilters()).toBe(false);
    expect(textContent).not.toContain('Informatikerin/Informatiker');
    expect(textContent).not.toContain('Applikationsentwicklung');
    expect(textContent).not.toContain('Betrieb');
    expect(textContent).not.toContain('1. Lehrjahr');
    expect(textContent).not.toContain('Pflichtmodul');
  });
});