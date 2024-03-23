import { Router } from 'express';
import { createTransactionSchema } from './schemas/create.schema';
import { createTransaction } from './transaction.service';
import { validateSchema } from '../../middlewares/validate-schema.middleware';
import { handleRequest } from '../../middlewares/handle-request.middleware';

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
      await createTransaction(req.body);

      return res.redirect('/');
    }),
  );

export { router as transactionRoute };
