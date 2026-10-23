import { Car } from '../../../domain/entities/car';
import { NotFoundError } from '../../../domain/errors';
import { CarRepository } from '../../../domain/repositories/car-repository';

export class GetCarByIdUseCase {
  constructor(private readonly carRepository: CarRepository) {}

  async execute(id: string): Promise<Car> {
    const car = await this.carRepository.findById(id);

    if (!car) {
      throw new NotFoundError('Car', id);
    }

    return car;
  }
}
