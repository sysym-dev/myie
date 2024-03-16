export interface Chapter {
  id: number;
  arabicName: string;
  latinName: string;
  transliterationName: Record<string, any>;
  totalVerse: number;
  location: string;
}
