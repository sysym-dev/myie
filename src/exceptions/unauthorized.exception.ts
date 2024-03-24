import express from 'express';
import { BaseException } from '../core/server/exception';

export class UnauthorizedException extends BaseException {
  constructor(message?: string) {
    super(401, message);
  }

  render(req: express.Request, res: express.Response) {
    return res.redirect('/login');
  }
}
