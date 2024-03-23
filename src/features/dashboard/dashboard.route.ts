import { Router } from 'express';
import { readTransactions } from '../transaction/transaction.service';
import { validateSchema } from '../../middlewares/validate-schema.middleware';
import { z } from 'zod';
import { RequestQuery } from '../../core/server/request';
import { handleRequest } from '../../middlewares/handle-request.middleware';

const router = Router();

const readSchema = z.object({
  page: z.coerce.number().positive().optional(),
});

router.get(
  '/',
  validateSchema(readSchema, { path: 'query' }),
  handleRequest(async (req: RequestQuery<z.infer<typeof readSchema>>, res) => {
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
  }),
);

export { router as dashboardRoute };
