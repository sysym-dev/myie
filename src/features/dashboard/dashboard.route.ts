import { Router } from 'express';
import { readTransactions } from '../transaction/transaction.service';

const router = Router();

router.get('/', async (req, res) => {
  const transactions = await readTransactions({
    sort: {
      column: 'created_at',
      direction: 'desc',
    },
    paginated: true,
    page: 1,
    limit: 2,
  });

  return res.render('dashboard', {
    transactions,
  });
});

export { router as dashboardRoute };
