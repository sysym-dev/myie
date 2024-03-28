import { User } from '../user/user';

export interface TransactionCategory {
  id: number;
  name: string;
  user_id: User['id'];
}
