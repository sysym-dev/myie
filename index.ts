import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import flash from 'express-flash-message';
import { routes } from './src/routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'pug');

app.use(
  session({
    secret: process.env.SECRET || 'secret',
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

app.listen(port, () => {
  console.log(`app listen in ${port}`);
});
