import { BildungsplanStateService } from './bildungsplan-state.service';

import { Efz } from '../../models/efz.model';
import { Fachrichtung } from '../../models/fachrichtung.model';
import { Handlungskompetenzbereich } from '../../models/handlungskompetenzbereich.model';
import { Handlungskompetenz } from '../../models/handlungskompetenz.model';
import { Lernort } from '../../models/lernort.model';
import { Modul } from '../../models/modul.model';

describe('BildungsplanStateService', () => {
  let service: BildungsplanStateService;

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

const hkb: Handlungskompetenzbereich = {
  id: 1,
  efzId: 1,
  fachrichtungId: null,
  kennung: 'a',
  beschreibung: 'Begleiten von ICT-Projekten',
  handlungskompetenzen: [1],
};

const hk: Handlungskompetenz = {
  id: 1,
  handlungskompetenzbereichId: 1,
  handlungskompetenzbereichKennung: 'a',
  kennung: 'a1',
  beschreibung: 'Aufträge klären',
  lehrjahr: 1,
  modulIds: [101],
};

const pflichtmodul: Modul = {
  id: 101,
  kennung: 'M101',
  beschreibung: 'Pflichtmodul Beschreibung',
  lernortId: 1,
  lehrjahr: 1,
  pflicht: true,
  efzId: 1,
  fachrichtungen: [10],
  handlungskompetenzIds: [1],
};

const nichtPflichtmodul: Modul = {
  id: 102,
  kennung: 'M102',
  beschreibung: 'Nicht-Pflichtmodul Beschreibung',
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
  beschreibung: 'Modul ohne definierten Modultyp',
  lernortId: 1,
  lehrjahr: null,
  pflicht: null,
  efzId: 1,
  fachrichtungen: [10],
  handlungskompetenzIds: [1],
};

  beforeEach(() => {
    service = new BildungsplanStateService();
  });

  it('should initialise with empty state', () => {
    expect(service.selectedEfz()).toBeNull();
    expect(service.selectedFachrichtung()).toBeNull();
    expect(service.selectedLernort()).toBeNull();
    expect(service.selectedEfzId()).toBeNull();
    expect(service.selectedFachrichtungId()).toBeNull();
    expect(service.selectedLernortId()).toBeNull();
    expect(service.contextLabel()).toBe('Kein EFZ ausgewählt');
    expect(service.isContextComplete()).toBe(false);
    expect(service.hasActiveFilters()).toBe(false);
  });

  it('should set EFZ list', () => {
    service.setEfzList([efz]);

    expect(service.efzList()).toEqual([efz]);
  });

  it('should select EFZ and clear dependent state', () => {
    service.setSearchTerm('modul');
    service.setFachrichtungen([fachrichtung]);
    service.setLernorte([lernortBetrieb]);
    service.setModule([pflichtmodul]);
    service.selectFachrichtung(fachrichtung);
    service.selectLernort(lernortBetrieb);
    service.selectModul(pflichtmodul);

    service.selectEfz(efz);

    expect(service.selectedEfz()).toEqual(efz);
    expect(service.selectedEfzId()).toBe(1);
    expect(service.selectedFachrichtung()).toBeNull();
    expect(service.fachrichtungen()).toEqual([]);
    expect(service.fachrichtungenLoaded()).toBe(false);
    expect(service.searchTerm()).toBe('');
    expect(service.selectedLernort()).toBeNull();
    expect(service.module()).toEqual([]);
    expect(service.selectedModul()).toBeNull();
  });

  it('should set fachrichtungen and require fachrichtung if entries exist', () => {
    service.selectEfz(efz);
    service.setFachrichtungen([fachrichtung]);

    expect(service.fachrichtungen()).toEqual([fachrichtung]);
    expect(service.fachrichtungenLoaded()).toBe(true);
    expect(service.requiresFachrichtung()).toBe(true);
    expect(service.isContextComplete()).toBe(false);
  });

  it('should complete context when EFZ has no fachrichtungen', () => {
    service.selectEfz(efz);
    service.setFachrichtungen([]);

    expect(service.requiresFachrichtung()).toBe(false);
    expect(service.isContextComplete()).toBe(true);
  });

  it('should complete context when EFZ and fachrichtung are selected', () => {
    service.selectEfz(efz);
    service.setFachrichtungen([fachrichtung]);
    service.selectFachrichtung(fachrichtung);

    expect(service.selectedFachrichtung()).toEqual(fachrichtung);
    expect(service.selectedFachrichtungId()).toBe(10);
    expect(service.isContextComplete()).toBe(true);
    expect(service.contextLabel()).toBe(
      'Informatikerin/Informatiker / Applikationsentwicklung'
    );
  });

  it('should clear fachrichtung selection and context data', () => {
    service.selectEfz(efz);
    service.setFachrichtungen([fachrichtung]);
    service.selectFachrichtung(fachrichtung);
    service.setModule([pflichtmodul]);
    service.setSearchTerm('test');

    service.clearFachrichtungSelection();

    expect(service.selectedFachrichtung()).toBeNull();
    expect(service.module()).toEqual([]);
    expect(service.searchTerm()).toBe('');
  });

  it('should set and clear search term', () => {
    service.setSearchTerm('  Modul Suche  ');

    expect(service.searchTerm()).toBe('  Modul Suche  ');
    expect(service.normalizedSearchTerm()).toBe('modul suche');
    expect(service.hasSearchTerm()).toBe(true);

    service.clearSearch();

    expect(service.searchTerm()).toBe('');
    expect(service.hasSearchTerm()).toBe(false);
  });

  it('should set lernorte and select lernort', () => {
    service.setLernorte([lernortBetrieb, lernortSchule]);
    service.selectLernort(lernortBetrieb);

    expect(service.lernorte()).toEqual([lernortBetrieb, lernortSchule]);
    expect(service.visibleLernorte()).toEqual([lernortBetrieb, lernortSchule]);
    expect(service.selectedLernort()).toEqual(lernortBetrieb);
    expect(service.selectedLernortId()).toBe(1);

    service.clearLernortSelection();

    expect(service.selectedLernort()).toBeNull();
    expect(service.selectedLernortId()).toBeNull();
  });

  it('should toggle and remove lehrjahr filters', () => {
    service.toggleLehrjahr(1);
    service.toggleLehrjahr(2);

    expect(service.selectedLehrjahre()).toEqual([1, 2]);

    service.toggleLehrjahr(1);

    expect(service.selectedLehrjahre()).toEqual([2]);

    service.removeLehrjahr(2);

    expect(service.selectedLehrjahre()).toEqual([]);
  });

  it('should toggle and remove modultyp filters', () => {
    service.toggleModultyp('Pflichtmodul');
    service.toggleModultyp('Nicht-Pflichtmodul');

    expect(service.selectedModultypen()).toEqual([
      'Pflichtmodul',
      'Nicht-Pflichtmodul',
    ]);

    service.toggleModultyp('Pflichtmodul');

    expect(service.selectedModultypen()).toEqual(['Nicht-Pflichtmodul']);

    service.removeModultyp('Nicht-Pflichtmodul');

    expect(service.selectedModultypen()).toEqual([]);
  });

  it('should filter visible modules by lernort', () => {
    service.setModule([pflichtmodul, nichtPflichtmodul, offenesModul]);
    service.selectLernort(lernortBetrieb);

    expect(service.visibleModule()).toEqual([pflichtmodul, offenesModul]);
  });

  it('should filter visible modules by lehrjahr', () => {
    service.setModule([pflichtmodul, nichtPflichtmodul, offenesModul]);
    service.toggleLehrjahr(2);

    expect(service.visibleModule()).toEqual([nichtPflichtmodul]);
  });

  it('should filter visible modules by modultyp', () => {
    service.setModule([pflichtmodul, nichtPflichtmodul, offenesModul]);
    service.toggleModultyp('Pflichtmodul');

    expect(service.visibleModule()).toEqual([pflichtmodul]);
  });

  it('should include modules with open type when filtered by open type label', () => {
    service.setModule([pflichtmodul, nichtPflichtmodul, offenesModul]);
    service.toggleModultyp('Modultyp offen');

    expect(service.visibleModule()).toEqual([offenesModul]);
  });

  it('should combine module filters', () => {
    service.setModule([pflichtmodul, nichtPflichtmodul, offenesModul]);
    service.selectLernort(lernortBetrieb);
    service.toggleLehrjahr(1);
    service.toggleModultyp('Pflichtmodul');

    expect(service.visibleModule()).toEqual([pflichtmodul]);
  });

  it('should set business object lists', () => {
    service.setHandlungskompetenzbereiche([hkb]);
    service.setHandlungskompetenzen([hk]);
    service.setModule([pflichtmodul]);

    expect(service.handlungskompetenzbereiche()).toEqual([hkb]);
    expect(service.handlungskompetenzen()).toEqual([hk]);
    expect(service.module()).toEqual([pflichtmodul]);
    expect(service.hasContextData()).toBe(true);
  });

  it('should select business objects and clear dependent selections', () => {
    service.selectHandlungskompetenzbereich(hkb);
    service.selectHandlungskompetenz(hk);
    service.selectModul(pflichtmodul);

    expect(service.selectedHandlungskompetenzbereich()).toEqual(hkb);
    expect(service.selectedHandlungskompetenz()).toEqual(hk);
    expect(service.selectedModul()).toEqual(pflichtmodul);

    service.selectHandlungskompetenzbereich(null);

    expect(service.selectedHandlungskompetenzbereich()).toBeNull();
    expect(service.selectedHandlungskompetenz()).toBeNull();
    expect(service.selectedModul()).toBeNull();
  });

  it('should clear selected modul when selecting handlungskompetenz', () => {
    service.selectModul(pflichtmodul);
    service.selectHandlungskompetenz(hk);

    expect(service.selectedHandlungskompetenz()).toEqual(hk);
    expect(service.selectedModul()).toBeNull();
  });

  it('should set loading and error state', () => {
    service.setLoading(true);
    service.setError('Fehler beim Laden');

    expect(service.isLoading()).toBe(true);
    expect(service.error()).toBe('Fehler beim Laden');

    service.setLoading(false);
    service.setError(null);

    expect(service.isLoading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('should clear business object selection', () => {
    service.selectHandlungskompetenzbereich(hkb);
    service.selectHandlungskompetenz(hk);
    service.selectModul(pflichtmodul);

    service.clearBusinessObjectSelection();

    expect(service.selectedHandlungskompetenzbereich()).toBeNull();
    expect(service.selectedHandlungskompetenz()).toBeNull();
    expect(service.selectedModul()).toBeNull();
  });

  it('should clear context data', () => {
    service.setLernorte([lernortBetrieb]);
    service.setHandlungskompetenzbereiche([hkb]);
    service.setHandlungskompetenzen([hk]);
    service.setModule([pflichtmodul]);
    service.selectLernort(lernortBetrieb);
    service.toggleLehrjahr(1);
    service.toggleModultyp('Pflichtmodul');

    service.clearContextData();

    expect(service.selectedLernort()).toBeNull();
    expect(service.selectedLehrjahre()).toEqual([]);
    expect(service.selectedModultypen()).toEqual([]);
    expect(service.lernorte()).toEqual([]);
    expect(service.handlungskompetenzbereiche()).toEqual([]);
    expect(service.handlungskompetenzen()).toEqual([]);
    expect(service.module()).toEqual([]);
  });

  it('should clear all state', () => {
    service.selectEfz(efz);
    service.setFachrichtungen([fachrichtung]);
    service.selectFachrichtung(fachrichtung);
    service.setLernorte([lernortBetrieb]);
    service.setModule([pflichtmodul]);
    service.selectLernort(lernortBetrieb);
    service.toggleLehrjahr(1);
    service.toggleModultyp('Pflichtmodul');
    service.setSearchTerm('abc');
    service.setLoading(true);
    service.setError('Fehler');

    service.clearAll();

    expect(service.selectedEfz()).toBeNull();
    expect(service.selectedFachrichtung()).toBeNull();
    expect(service.selectedLernort()).toBeNull();
    expect(service.selectedLehrjahre()).toEqual([]);
    expect(service.selectedModultypen()).toEqual([]);
    expect(service.fachrichtungen()).toEqual([]);
    expect(service.fachrichtungenLoaded()).toBe(false);
    expect(service.lernorte()).toEqual([]);
    expect(service.searchTerm()).toBe('');
    expect(service.isLoading()).toBe(false);
    expect(service.error()).toBeNull();
    expect(service.hasActiveFilters()).toBe(false);
  });
});