import express, { Router } from 'express';
import { readTransactions } from '../transaction/transaction.service';
import { validateSchema } from '../../middlewares/validate-schema.middleware';
import { z } from 'zod';
import { Request } from '../../core/server/request';

const router = Router();

const readSchema = z.object({
  page: z.coerce.number().positive(),
});

router.get(
  '/',
  validateSchema(readSchema, { path: 'query' }),
  async (req, res) => {
    const transactions = await readTransactions({
      sort: {
        column: 'created_at',
        direction: 'desc',
      },
      paginated: true,
      limit: 2,
    });

    return res.render('dashboard', {
      transactions,
    });
  },
);

export { router as dashboardRoute };
