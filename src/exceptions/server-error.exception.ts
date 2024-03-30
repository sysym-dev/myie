import { BaseException } from '../core/server/exception';

export class ServerErrorException extends BaseException {
  name: string = 'Server Error';

  constructor(message: string) {
    super(
      500,
      process.env.NODE_ENV === 'production' ? 'Server Error' : message,
    );
  }
}
