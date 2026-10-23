import { Car } from '../../../domain/entities/car';
import { CarUsage } from '../../../domain/entities/car-usage';
import { Driver } from '../../../domain/entities/driver';
import { CarRepository } from '../../../domain/repositories/car-repository';
import { DriverRepository } from '../../../domain/repositories/driver-repository';
import { GetCarByIdUseCase } from '../cars/get-car-by-id.use-case';
import { GetDriverByIdUseCase } from '../drivers/get-driver-by-id.use-case';

export interface CarUsageDetails {
  carUsage: CarUsage;
  car: Car;
  driver: Driver;
}

export class CarUsageDetailsLoader {
  private readonly getCarById: GetCarByIdUseCase;
  private readonly getDriverById: GetDriverByIdUseCase;

  constructor(carRepository: CarRepository, driverRepository: DriverRepository) {
    this.getCarById = new GetCarByIdUseCase(carRepository);
    this.getDriverById = new GetDriverByIdUseCase(driverRepository);
  }

  async load(carUsage: CarUsage): Promise<CarUsageDetails> {
    const [car, driver] = await Promise.all([
      this.getCarById.execute(carUsage.carId),
      this.getDriverById.execute(carUsage.driverId),
    ]);

    return { carUsage, car, driver };
  }
}
