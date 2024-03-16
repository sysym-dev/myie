import { Chapter } from '../../src/modules/chapter/chapter';
import { http } from '../lib/http';

export abstract class Source {
  private chapters: Chapter[];
  protected abstract chapterUrl: string;

  abstract parseChapter(rawChapter: Record<string, any>[]): Chapter[];

  async start(): Promise<void> {
    await this.crawlChapter();
  }

  async crawlChapter() {
    const res = await http({
      method: 'get',
      url: this.chapterUrl,
    });

    this.chapters = this.parseChapter(res.data.data);
  }
}
