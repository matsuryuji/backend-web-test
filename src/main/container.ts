import { CryptoIdGenerator } from '../infra/id/crypto-id-generator';
import { InMemoryCarRepository } from '../infra/repositories/in-memory/in-memory-car-repository';
import { HttpControllers } from '../presentation/http/routes';
import { makeCarController } from './factories/make-car-controller';

export function makeControllers(): HttpControllers {
  const idGenerator = new CryptoIdGenerator();
  const carRepository = new InMemoryCarRepository();

  return {
    carController: makeCarController(carRepository, idGenerator),
  };
}
