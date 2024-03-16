import { Chapter } from '../../../src/modules/chapter/chapter';
import { Source } from '../source';

export class Kemenag extends Source {
  chapterUrl: string = 'https://web-api.qurankemenag.net/quran-surah';

  parseChapter(rawChapter: Record<string, any>[]): Chapter[] {
    return rawChapter.map((item) => ({
      id: item.id,
      arabicName: item.arabic,
      latinName: item.latin,
      location: item.location,
      totalVerse: item.num_ayah,
      transliterationName: {
        id: item.translation,
      },
    }));
  }
}
