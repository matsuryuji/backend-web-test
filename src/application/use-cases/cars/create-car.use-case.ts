import { Car, CarData } from '../../../domain/entities/car';
import { CarRepository } from '../../../domain/repositories/car-repository';
import { IdGenerator } from '../../protocols/id-generator';
import { ensurePlateIsAvailable } from './ensure-plate-is-available';

export class CreateCarUseCase {
  constructor(
    private readonly carRepository: CarRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: CarData): Promise<Car> {
    const car = Car.create(this.idGenerator.generate(), input);

    await ensurePlateIsAvailable(this.carRepository, car);
    await this.carRepository.save(car);

    return car;
  }
}
