import express from 'express';
import { findById } from '../features/user/user.service';
import { RecordNotFoundException } from '../exceptions/record-not-found.exception';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';

export async function requireAuth(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const user = await findById(1);

    next();
  } catch (err) {
    next(
      err instanceof RecordNotFoundException
        ? new UnauthorizedException()
        : err,
    );
  }
}
