import { SystemClock } from '../infra/clock/system-clock';
import { CryptoIdGenerator } from '../infra/id/crypto-id-generator';
import { InMemoryCarRepository } from '../infra/repositories/in-memory/in-memory-car-repository';
import { InMemoryCarUsageRepository } from '../infra/repositories/in-memory/in-memory-car-usage-repository';
import { InMemoryDriverRepository } from '../infra/repositories/in-memory/in-memory-driver-repository';
import { HttpControllers } from '../presentation/http/routes';
import { makeCarController } from './factories/make-car-controller';
import { makeCarUsageController } from './factories/make-car-usage-controller';
import { makeDriverController } from './factories/make-driver-controller';

export function makeControllers(): HttpControllers {
  const idGenerator = new CryptoIdGenerator();
  const clock = new SystemClock();
  const carRepository = new InMemoryCarRepository();
  const driverRepository = new InMemoryDriverRepository();
  const carUsageRepository = new InMemoryCarUsageRepository();

  return {
    carController: makeCarController(carRepository, carUsageRepository, idGenerator),
    driverController: makeDriverController(driverRepository, carUsageRepository, idGenerator),
    carUsageController: makeCarUsageController({
      carUsageRepository,
      carRepository,
      driverRepository,
      idGenerator,
      clock,
    }),
  };
}
