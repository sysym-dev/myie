import { Kemenag } from './modules/kemenag';
import { Source } from './source';

export const sources: Record<string, new () => Source> = {
  kemenag: Kemenag,
};
