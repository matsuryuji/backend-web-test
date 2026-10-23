import { Car, CarData } from '../../../domain/entities/car';
import { CarRepository } from '../../../domain/repositories/car-repository';
import { ensurePlateIsAvailable } from './ensure-plate-is-available';
import { GetCarByIdUseCase } from './get-car-by-id.use-case';

export class UpdateCarUseCase {
  private readonly getCarById: GetCarByIdUseCase;

  constructor(private readonly carRepository: CarRepository) {
    this.getCarById = new GetCarByIdUseCase(carRepository);
  }

  async execute(id: string, input: CarData): Promise<Car> {
    const car = await this.getCarById.execute(id);
    car.update(input);

    await ensurePlateIsAvailable(this.carRepository, car);
    await this.carRepository.save(car);

    return car;
  }
}
