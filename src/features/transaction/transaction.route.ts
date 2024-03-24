import { Router } from 'express';
import { createTransactionSchema } from './schemas/create.schema';
import { createTransaction } from './transaction.service';
import { validateSchema } from '../../middlewares/validate-schema.middleware';
import { handleRequest } from '../../middlewares/handle-request.middleware';
import { User } from '../user/user';
import { requireAuth } from '../../middlewares/require-auth.middleware';

const router = Router();

router
  .route('/transactions/create')
  .get(
    requireAuth,
    handleRequest((req, res) => {
      return res.render('transaction/create', {
        title: 'Create Transaction',
      });
    }),
  )
  .post(
    requireAuth,
    validateSchema(createTransactionSchema, {
      errorKey: 'create-transaction-error',
    }),
    handleRequest(async (req, res) => {
      await createTransaction(req.user, req.body);

      return res.redirect('/');
    }),
  );

export { router as transactionRoute };
