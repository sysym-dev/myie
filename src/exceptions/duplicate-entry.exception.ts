import { BaseException } from '../core/server/exception';

export class DuplicateEntryException extends BaseException {
  constructor(message?: string) {
    super(409, message);
  }
}
