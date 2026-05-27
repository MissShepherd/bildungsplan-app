export interface Handlungskompetenz {
  id: number;
  handlungskompetenzbereichId: number;
  handlungskompetenzbereichKennung?: string;
  kennung: string;
  beschreibung: string;
  lehrjahr?: number | null;
  modulIds?: number[];
}