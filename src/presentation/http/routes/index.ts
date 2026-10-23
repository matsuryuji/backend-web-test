import { Router } from 'express';
import { CarUsageController } from '../controllers/car-usage.controller';
import { CarController } from '../controllers/car.controller';
import { DriverController } from '../controllers/driver.controller';
import { createCarUsageRoutes } from './car-usage.routes';
import { createCarRoutes } from './car.routes';
import { docsRoutes } from './docs.routes';
import { createDriverRoutes } from './driver.routes';
import { healthRoutes } from './health.routes';

export interface HttpControllers {
  carController: CarController;
  driverController: DriverController;
  carUsageController: CarUsageController;
}

export function createRoutes({ carController, driverController, carUsageController }: HttpControllers): Router {
  const routes = Router();

  routes.use('/health', healthRoutes);
  routes.use('/docs', docsRoutes);
  routes.use('/cars', createCarRoutes(carController));
  routes.use('/drivers', createDriverRoutes(driverController));
  routes.use('/car-usages', createCarUsageRoutes(carUsageController));

  return routes;
}
