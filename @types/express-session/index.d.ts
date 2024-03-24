import 'express-session';
import { User } from '../../src/features/user/user';

declare module 'express-session' {
  interface SessionData {
    isLoggedIn: boolean;
    userId: User['id'];
  }
}
