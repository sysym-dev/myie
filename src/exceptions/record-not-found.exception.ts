import { BaseException } from '../core/server/exception';

export class RecordNotFoundException extends BaseException {
  constructor() {
    super(404);
  }
}
