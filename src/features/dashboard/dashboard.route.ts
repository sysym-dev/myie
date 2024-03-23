import express, { Router } from 'express';
import { readTransactions } from '../transaction/transaction.service';
import { validateSchema } from '../../middlewares/validate-schema.middleware';
import { z } from 'zod';
import { RequestQuery } from '../../core/server/request';

const router = Router();

const readSchema = z.object({
  page: z.coerce.number().positive().optional(),
});

router.get(
  '/',
  validateSchema(readSchema, { path: 'query' }),
  async (
    req: RequestQuery<z.infer<typeof readSchema>>,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const transactions = await readTransactions({
        sort: {
          column: 'created_at',
          direction: 'desc',
        },
        paginated: true,
        page: req.query.page,
        limit: 10,
      });

      return res.render('dashboard', {
        transactions,
        title: 'Dashboard',
      });
    } catch (err) {
      return next(err);
    }
  },
);

export { router as dashboardRoute };
