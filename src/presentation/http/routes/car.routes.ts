import { Router } from 'express';
import { CarController } from '../controllers/car.controller';
import { asyncHandler } from '../helpers/async-handler';

export function createCarRoutes(controller: CarController): Router {
  const router = Router();

  router.get('/', asyncHandler(controller.list));
  router.post('/', asyncHandler(controller.create));
  router.get('/:id', asyncHandler(controller.getById));
  router.put('/:id', asyncHandler(controller.update));
  router.delete('/:id', asyncHandler(controller.delete));

  return router;
}
