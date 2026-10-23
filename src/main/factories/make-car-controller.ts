import { IdGenerator } from '../../application/protocols/id-generator';
import {
  CreateCarUseCase,
  DeleteCarUseCase,
  GetCarByIdUseCase,
  ListCarsUseCase,
  UpdateCarUseCase,
} from '../../application/use-cases/cars';
import { CarRepository } from '../../domain/repositories/car-repository';
import { CarUsageRepository } from '../../domain/repositories/car-usage-repository';
import { CarController } from '../../presentation/http/controllers/car.controller';

export function makeCarController(
  carRepository: CarRepository,
  carUsageRepository: CarUsageRepository,
  idGenerator: IdGenerator,
): CarController {
  return new CarController({
    createCar: new CreateCarUseCase(carRepository, idGenerator),
    updateCar: new UpdateCarUseCase(carRepository),
    deleteCar: new DeleteCarUseCase(carRepository, carUsageRepository),
    getCarById: new GetCarByIdUseCase(carRepository),
    listCars: new ListCarsUseCase(carRepository),
  });
}
