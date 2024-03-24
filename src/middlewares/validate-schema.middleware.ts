import { ZodError, z } from 'zod';
import express from 'express';

export function validateSchema(
  schema: z.Schema,
  options?: {
    path?: 'body' | 'query';
    redirectPath?: string;
    errorKey?: string;
  },
): express.RequestHandler {
  return async (req, res, next) => {
    try {
      const output = await schema.parseAsync(req[options?.path ?? 'body']);

      req[options?.path ?? 'body'] = output;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        err.errors.forEach((err) => {
          res.flash(options?.errorKey ?? 'validation-error', err.message);
        });

        return res.redirect(options?.redirectPath ?? req.path);
      }

      next(err);
    }
  };
}
