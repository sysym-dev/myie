import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import flash from 'express-flash-message';
import { routes } from './src/routes';
import { parseDate } from './src/utils/date.util';
import { ServerErrorException } from './src/exceptions/server-error.exception';
import { BaseException } from './src/core/server/exception';
import RedisStore from 'connect-redis';
import { redis } from './src/core/redis/redis';

const app = express();
const port = process.env.PORT || 3000;

app.locals.parseDate = parseDate;
app.locals.formatCurrency = (val: string) =>
  new Intl.NumberFormat().format(Number(val));
app.set('view engine', 'pug');

app.use(
  session({
    store: new RedisStore({
      client: redis,
    }),
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(
  flash({
    sessionKeyName: 'flash',
  }),
);

app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static('public'));

routes.forEach((route) => {
  app.use(route);
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (err instanceof BaseException) {
      return err.render(req, res);
    }

    console.log(err);

    return new ServerErrorException(err.message).render(req, res);
  },
);

async function main() {
  await redis.connect();

  app.listen(port, () => {
    console.log(`app listen in ${port}`);
  });
}

main();
