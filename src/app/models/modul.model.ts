export interface Modul {
  id: number;
  kennung: string;
  beschreibung: string;
  lehrjahr?: number | null;
  pflicht?: boolean | null;
  lernortId?: number | null;
  efzId?: number | null;
  fachrichtungen?: number[];
  handlungskompetenzIds?: number[];
}