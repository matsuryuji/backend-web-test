import { Router } from 'express';
import { CarController } from '../controllers/car.controller';
import { DriverController } from '../controllers/driver.controller';
import { createCarRoutes } from './car.routes';
import { createDriverRoutes } from './driver.routes';
import { healthRoutes } from './health.routes';

export interface HttpControllers {
  carController: CarController;
  driverController: DriverController;
}

export function createRoutes({ carController, driverController }: HttpControllers): Router {
  const routes = Router();

  routes.use('/health', healthRoutes);
  routes.use('/cars', createCarRoutes(carController));
  routes.use('/drivers', createDriverRoutes(driverController));

  return routes;
}
