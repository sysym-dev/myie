import { authRoute } from './features/auth/auth.route';
import { dashboardRoute } from './features/dashboard/dashboard.route';
import { transactionRoute } from './features/transaction/transaction.route';

export const routes = [dashboardRoute, transactionRoute, authRoute];
