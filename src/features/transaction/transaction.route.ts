import { Router } from 'express';
import { createTransactionSchema } from './schemas/create.schema';
import { createTransaction } from './transaction.service';
import { validateSchema } from '../../middlewares/validate-schema.middleware';
import { handleRequest } from '../../middlewares/handle-request.middleware';
import { User } from '../user/user';

const router = Router();

router
  .route('/transactions/create')
  .get(
    handleRequest((req, res) => {
      return res.render('transaction/create', {
        title: 'Create Transaction',
      });
    }),
  )
  .post(
    validateSchema(createTransactionSchema, {
      key: 'create-transaction-error',
    }),
    handleRequest(async (req, res) => {
      const user: User = {
        id: 1,
      };
      await createTransaction(user, req.body);

      return res.redirect('/');
    }),
  );

export { router as transactionRoute };
