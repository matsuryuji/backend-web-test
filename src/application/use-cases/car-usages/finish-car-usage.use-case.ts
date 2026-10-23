import { NotFoundError } from '../../../domain/errors';
import { CarRepository } from '../../../domain/repositories/car-repository';
import { CarUsageRepository } from '../../../domain/repositories/car-usage-repository';
import { DriverRepository } from '../../../domain/repositories/driver-repository';
import { Clock } from '../../protocols/clock';
import { CarUsageDetails, CarUsageDetailsLoader } from './car-usage-details';

export interface FinishCarUsageInput {
  endDate?: Date;
}

export class FinishCarUsageUseCase {
  private readonly detailsLoader: CarUsageDetailsLoader;

  constructor(
    private readonly carUsageRepository: CarUsageRepository,
    carRepository: CarRepository,
    driverRepository: DriverRepository,
    private readonly clock: Clock,
  ) {
    this.detailsLoader = new CarUsageDetailsLoader(carRepository, driverRepository);
  }

  async execute(id: string, input: FinishCarUsageInput = {}): Promise<CarUsageDetails> {
    const carUsage = await this.carUsageRepository.findById(id);

    if (!carUsage) {
      throw new NotFoundError('Car usage', id);
    }

    carUsage.finish(input.endDate ?? this.clock.now());
    await this.carUsageRepository.save(carUsage);

    return this.detailsLoader.load(carUsage);
  }
}
