export interface Handlungskompetenzbereich {
  id: number;
  efzId: number;
  fachrichtungId?: number | null;
  kennung: string;
  beschreibung: string;
  handlungskompetenzen?: number[];
}