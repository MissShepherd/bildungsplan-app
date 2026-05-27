export interface Modul {
  id: number;
  kennung: string;
  beschreibung: string;
  lehrjahr?: number;
  pflicht?: boolean;
  lernortId?: number;
  efzId?: number;
  fachrichtungen?: number[];
  handlungskompetenzIds?: number[];
}