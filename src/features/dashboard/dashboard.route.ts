import { Router } from 'express';
import {
  getUserStats,
  readTransactions,
} from '../transaction/transaction.service';
import { validateSchema } from '../../middlewares/validate-schema.middleware';
import { z } from 'zod';
import { RequestQuery } from '../../core/server/request';
import { handleRequest } from '../../middlewares/handle-request.middleware';
import { parseDate } from '../../utils/date.util';
import { database } from '../../core/database/database';
import { requireAuth } from '../../middlewares/require-auth.middleware';

const router = Router();

const readSchema = z.object({
  page: z.coerce.number().positive().optional(),
});

router.get(
  '/',
  requireAuth,
  validateSchema(readSchema, { path: 'query' }),
  handleRequest(async (req: RequestQuery<z.infer<typeof readSchema>>, res) => {
    const today = parseDate();
    const transactions = await readTransactions({
      sort: {
        column: 'created_at',
        direction: 'desc',
      },
      paginated: true,
      page: req.query.page,
      limit: 10,
      start_at: today.startOf('day').toDate(),
      end_at: today.endOf('day').toDate(),
      user_id: req.user.id,
    });
    const userStats = await getUserStats(req.user);

    return res.render('dashboard', {
      transactions,
      userStats,
      user: req.user,
      title: 'Dashboard',
    });
  }),
);

export { router as dashboardRoute };
