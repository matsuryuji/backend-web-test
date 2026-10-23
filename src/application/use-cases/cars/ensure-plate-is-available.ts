import { ConflictError } from '../../../domain/errors';
import { Car } from '../../../domain/entities/car';
import { CarRepository } from '../../../domain/repositories/car-repository';

export async function ensurePlateIsAvailable(carRepository: CarRepository, car: Car): Promise<void> {
  const carWithSamePlate = await carRepository.findByPlate(car.plate);

  if (carWithSamePlate && carWithSamePlate.id !== car.id) {
    throw new ConflictError(`A car with plate "${car.plate}" is already registered`);
  }
}
