import { Router } from 'express';
import { CarController } from '../controllers/car.controller';
import { createCarRoutes } from './car.routes';
import { healthRoutes } from './health.routes';

export interface HttpControllers {
  carController: CarController;
}

export function createRoutes({ carController }: HttpControllers): Router {
  const routes = Router();

  routes.use('/health', healthRoutes);
  routes.use('/cars', createCarRoutes(carController));

  return routes;
}
