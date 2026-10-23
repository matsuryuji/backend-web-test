import { CarUsage } from '../../../domain/entities/car-usage';
import { CarAlreadyInUseError, DriverAlreadyInUseError } from '../../../domain/errors';
import { CarRepository } from '../../../domain/repositories/car-repository';
import { CarUsageRepository } from '../../../domain/repositories/car-usage-repository';
import { DriverRepository } from '../../../domain/repositories/driver-repository';
import { Clock } from '../../protocols/clock';
import { IdGenerator } from '../../protocols/id-generator';
import { CarUsageDetails, CarUsageDetailsLoader } from './car-usage-details';

export interface StartCarUsageInput {
  carId: string;
  driverId: string;
  reason: string;
  startDate?: Date;
}

export class StartCarUsageUseCase {
  private readonly detailsLoader: CarUsageDetailsLoader;

  constructor(
    private readonly carUsageRepository: CarUsageRepository,
    carRepository: CarRepository,
    driverRepository: DriverRepository,
    private readonly idGenerator: IdGenerator,
    private readonly clock: Clock,
  ) {
    this.detailsLoader = new CarUsageDetailsLoader(carRepository, driverRepository);
  }

  async execute(input: StartCarUsageInput): Promise<CarUsageDetails> {
    const carUsage = CarUsage.start(this.idGenerator.generate(), {
      carId: input.carId,
      driverId: input.driverId,
      reason: input.reason,
      startDate: input.startDate ?? this.clock.now(),
    });

    const details = await this.detailsLoader.load(carUsage);

    await this.ensureCarIsAvailable(carUsage);
    await this.ensureDriverIsAvailable(carUsage);
    await this.carUsageRepository.save(carUsage);

    return details;
  }

  private async ensureCarIsAvailable(carUsage: CarUsage): Promise<void> {
    const carUsages = await this.carUsageRepository.findAll({ carId: carUsage.carId });

    if (carUsages.some((existing) => existing.overlaps(carUsage))) {
      throw new CarAlreadyInUseError(carUsage.carId);
    }
  }

  private async ensureDriverIsAvailable(carUsage: CarUsage): Promise<void> {
    const driverUsages = await this.carUsageRepository.findAll({ driverId: carUsage.driverId });

    if (driverUsages.some((existing) => existing.overlaps(carUsage))) {
      throw new DriverAlreadyInUseError(carUsage.driverId);
    }
  }
}
