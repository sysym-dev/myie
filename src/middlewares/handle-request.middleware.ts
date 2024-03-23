import express from 'express';

export function handleRequest(
  cb: (req: express.Request, res: express.Response) => any,
): express.RequestHandler {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      await cb(req, res);
    } catch (err) {
      next(err);
    }
  };
}
