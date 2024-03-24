import { RecordNotFoundException } from '../../exceptions/record-not-found.exception';
import { UnauthorizedException } from '../../exceptions/unauthorized.exception';
import { User } from '../user/user';
import { findByEmail } from '../user/user.service';
import bcrypt from 'bcrypt';

export async function checkValidLogin(credential: {
  email: User['email'];
  password: User['password'];
}): Promise<User> {
  try {
    const user = await findByEmail(credential.email);

    if (!(await bcrypt.compare(credential.password, user.password))) {
      throw new UnauthorizedException('password incorrect');
    }

    return user;
  } catch (err) {
    throw err instanceof RecordNotFoundException
      ? new UnauthorizedException('email not found')
      : err;
  }
}
