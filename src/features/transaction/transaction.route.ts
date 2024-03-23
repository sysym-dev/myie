import { Router } from 'express';
import { createTransactionSchema } from './schemas/create.schema';
import { createTransaction } from './transaction.service';
import { validateSchema } from '../../middlewares/validate-schema.middleware';

const router = Router();

router
  .route('/transactions/create')
  .get((req, res) => {
    return res.render('transaction/create');
  })
  .post(
    validateSchema(createTransactionSchema, {
      key: 'create-transaction-error',
    }),
    async (req, res, next) => {
      try {
        await createTransaction(req.body);

        return res.redirect('/');
      } catch (err) {
        return next(err);
      }
    },
  );

export { router as transactionRoute };
