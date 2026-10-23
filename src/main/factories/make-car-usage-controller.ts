import { Clock } from '../../application/protocols/clock';
import { IdGenerator } from '../../application/protocols/id-generator';
import {
  FinishCarUsageUseCase,
  ListCarUsagesUseCase,
  StartCarUsageUseCase,
} from '../../application/use-cases/car-usages';
import { CarRepository } from '../../domain/repositories/car-repository';
import { CarUsageRepository } from '../../domain/repositories/car-usage-repository';
import { DriverRepository } from '../../domain/repositories/driver-repository';
import { CarUsageController } from '../../presentation/http/controllers/car-usage.controller';

interface CarUsageControllerDependencies {
  carUsageRepository: CarUsageRepository;
  carRepository: CarRepository;
  driverRepository: DriverRepository;
  idGenerator: IdGenerator;
  clock: Clock;
}

export function makeCarUsageController({
  carUsageRepository,
  carRepository,
  driverRepository,
  idGenerator,
  clock,
}: CarUsageControllerDependencies): CarUsageController {
  return new CarUsageController({
    startCarUsage: new StartCarUsageUseCase(carUsageRepository, carRepository, driverRepository, idGenerator, clock),
    finishCarUsage: new FinishCarUsageUseCase(carUsageRepository, carRepository, driverRepository, clock),
    listCarUsages: new ListCarUsagesUseCase(carUsageRepository, carRepository, driverRepository),
  });
}
