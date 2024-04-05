import { Router } from 'express';
import { handleRequest } from '../../middlewares/handle-request.middleware';
import { validateSchema } from '../../middlewares/validate-schema.middleware';
import { loginSchema } from './schemas/login.schema';
import { checkValidLogin } from './auth.service';
import { UnauthorizedException } from '../../exceptions/unauthorized.exception';

const router = Router();

router
  .route('/login')
  .get(
    handleRequest((req, res) => {
      return res.render('auth/login', {
        title: 'Login',
      });
    }),
  )
  .post(
    validateSchema(loginSchema, { errorKey: 'login-error' }),
    handleRequest(async (req, res) => {
      try {
        const user = await checkValidLogin(req.body);

        req.session.isLoggedIn = true;
        req.session.userId = user.id;

        return res.redirect('/');
      } catch (err) {
        if (err instanceof UnauthorizedException) {
          res.flash('login-error', err.message);

          return res.redirect('/login');
        }

        throw err;
      }
    }),
  );
router.get('/logout', handleRequest((req, res) => {
  req.session.isLoggedIn = false
  req.session.userId = null

  return res.redirect('/login')
}))
router.route('/register')
  .get(handleRequest((req, res) => {
    return res.render('auth/register', {
      title: 'Reister'
    })
  }))

export { router as authRoute };
