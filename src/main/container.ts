import { CryptoIdGenerator } from '../infra/id/crypto-id-generator';
import { InMemoryCarRepository } from '../infra/repositories/in-memory/in-memory-car-repository';
import { InMemoryDriverRepository } from '../infra/repositories/in-memory/in-memory-driver-repository';
import { HttpControllers } from '../presentation/http/routes';
import { makeCarController } from './factories/make-car-controller';
import { makeDriverController } from './factories/make-driver-controller';

export function makeControllers(): HttpControllers {
  const idGenerator = new CryptoIdGenerator();
  const carRepository = new InMemoryCarRepository();
  const driverRepository = new InMemoryDriverRepository();

  return {
    carController: makeCarController(carRepository, idGenerator),
    driverController: makeDriverController(driverRepository, idGenerator),
  };
}
