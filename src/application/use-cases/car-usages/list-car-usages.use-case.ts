import { CarRepository } from '../../../domain/repositories/car-repository';
import { CarUsageRepository } from '../../../domain/repositories/car-usage-repository';
import { DriverRepository } from '../../../domain/repositories/driver-repository';
import { CarUsageDetails, CarUsageDetailsLoader } from './car-usage-details';

export class ListCarUsagesUseCase {
  private readonly detailsLoader: CarUsageDetailsLoader;

  constructor(
    private readonly carUsageRepository: CarUsageRepository,
    carRepository: CarRepository,
    driverRepository: DriverRepository,
  ) {
    this.detailsLoader = new CarUsageDetailsLoader(carRepository, driverRepository);
  }

  async execute(): Promise<CarUsageDetails[]> {
    const carUsages = await this.carUsageRepository.findAll();

    return Promise.all(carUsages.map((carUsage) => this.detailsLoader.load(carUsage)));
  }
}
