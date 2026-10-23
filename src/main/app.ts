import express, { Express } from 'express';
import { routes } from '../presentation/http/routes';
import { errorHandler } from '../presentation/http/middlewares/error-handler';
import { notFoundRoute } from '../presentation/http/middlewares/not-found-route';

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(routes);
  app.use(notFoundRoute);
  app.use(errorHandler);

  return app;
}
