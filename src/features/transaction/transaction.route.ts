import { Router } from 'express';
import { createTransactionSchema } from './schemas/create.schema';
import { ZodError } from 'zod';

const router = Router();

router
  .route('/transactions/create')
  .get((req, res) => {
    return res.render('transaction/create');
  })
  .post(
    async (req, res, next) => {
      try {
        const output = await createTransactionSchema.parseAsync(req.body);

        req.body = output;

        next();
      } catch (err) {
        if (err instanceof ZodError) {
          err.errors.forEach((err) => {
            res.flash('validation-error', err.message);
          });

          return res.redirect(req.path);
        }

        next(err);
      }
    },
    (req, res) => {
      return res.json(req.body);
    },
  );

export { router as transactionRoute };
