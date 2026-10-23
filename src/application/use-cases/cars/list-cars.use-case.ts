import { Car } from '../../../domain/entities/car';
import { CarFilters, CarRepository } from '../../../domain/repositories/car-repository';

export class ListCarsUseCase {
  constructor(private readonly carRepository: CarRepository) {}

  async execute(filters: CarFilters = {}): Promise<Car[]> {
    return this.carRepository.findAll(filters);
  }
}
