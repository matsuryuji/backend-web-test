import { CarRepository } from '../../../domain/repositories/car-repository';
import { GetCarByIdUseCase } from './get-car-by-id.use-case';

export class DeleteCarUseCase {
  private readonly getCarById: GetCarByIdUseCase;

  constructor(private readonly carRepository: CarRepository) {
    this.getCarById = new GetCarByIdUseCase(carRepository);
  }

  async execute(id: string): Promise<void> {
    const car = await this.getCarById.execute(id);

    await this.carRepository.delete(car.id);
  }
}
