import { ConflictError } from '../../../domain/errors';
import { CarRepository } from '../../../domain/repositories/car-repository';
import { CarUsageRepository } from '../../../domain/repositories/car-usage-repository';
import { GetCarByIdUseCase } from './get-car-by-id.use-case';

export class DeleteCarUseCase {
  private readonly getCarById: GetCarByIdUseCase;

  constructor(
    private readonly carRepository: CarRepository,
    private readonly carUsageRepository: CarUsageRepository,
  ) {
    this.getCarById = new GetCarByIdUseCase(carRepository);
  }

  async execute(id: string): Promise<void> {
    const car = await this.getCarById.execute(id);
    const carUsages = await this.carUsageRepository.findAll({ carId: car.id });

    if (carUsages.length > 0) {
      throw new ConflictError(`Car "${car.id}" has usage records and cannot be deleted`);
    }

    await this.carRepository.delete(car.id);
  }
}
