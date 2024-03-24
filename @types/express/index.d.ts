import { User } from '../../src/features/user/user';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
