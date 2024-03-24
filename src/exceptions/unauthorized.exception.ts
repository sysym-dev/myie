import express from 'express';
import { BaseException } from '../core/server/exception';

export class UnauthorizedException extends BaseException {
  constructor() {
    super(401);
  }

  render(req: express.Request, res: express.Response) {
    return res.redirect('/login');
  }
}
