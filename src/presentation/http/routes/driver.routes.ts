import { Router } from 'express';
import { DriverController } from '../controllers/driver.controller';
import { asyncHandler } from '../helpers/async-handler';

export function createDriverRoutes(controller: DriverController): Router {
  const router = Router();

  router.get('/', asyncHandler(controller.list));
  router.post('/', asyncHandler(controller.create));
  router.get('/:id', asyncHandler(controller.getById));
  router.put('/:id', asyncHandler(controller.update));
  router.delete('/:id', asyncHandler(controller.delete));

  return router;
}
