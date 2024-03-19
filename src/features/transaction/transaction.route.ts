import { Router } from 'express';

const router = Router();

router.get('/transactions/create', (req, res) => {
  return res.render('transaction/create');
});

export { router as transactionRoute };
