import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import flash from 'express-flash-message';
import { routes } from './src/routes';
import { parseDate } from './src/utils/date.util';

const app = express();
const port = process.env.PORT || 3000;

app.locals.parseDate = parseDate;
app.locals.formatCurrency = (val: string) =>
  new Intl.NumberFormat().format(Number(val));
app.set('view engine', 'pug');

app.use(
  session({
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
    console.log(err);
    return res.status(500).render('errors/500');
  },
);

app.listen(port, () => {
  console.log(`app listen in ${port}`);
});
