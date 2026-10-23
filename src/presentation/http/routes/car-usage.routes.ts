import { Router } from 'express';
import { CarUsageController } from '../controllers/car-usage.controller';
import { asyncHandler } from '../helpers/async-handler';

export function createCarUsageRoutes(controller: CarUsageController): Router {
  const router = Router();

  router.get('/', asyncHandler(controller.list));
  router.post('/', asyncHandler(controller.start));
  router.patch('/:id/finish', asyncHandler(controller.finish));

  return router;
}
