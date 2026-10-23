import express, { Express } from 'express';
import { createRoutes, HttpControllers } from '../presentation/http/routes';
import { errorHandler } from '../presentation/http/middlewares/error-handler';
import { notFoundRoute } from '../presentation/http/middlewares/not-found-route';
import { makeControllers } from './container';

export function createApp(controllers: HttpControllers = makeControllers()): Express {
  const app = express();

  app.use(express.json());
  app.use(createRoutes(controllers));
  app.use(notFoundRoute);
  app.use(errorHandler);

  return app;
}
