import 'dotenv/config';
import express from 'express';
import { routes } from './src/routes';

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'pug');

routes.forEach((route) => {
  app.use(route);
});

app.listen(port, () => {
  console.log(`app listen in ${port}`);
});
