import { Request, Response } from 'express';
import {
  CreateCarUseCase,
  DeleteCarUseCase,
  GetCarByIdUseCase,
  ListCarsUseCase,
  UpdateCarUseCase,
} from '../../../application/use-cases/cars';
import { optionalQueryString } from '../helpers/query-params';
import { toCarResponse } from '../presenters/car.presenter';

export interface CarUseCases {
  createCar: CreateCarUseCase;
  updateCar: UpdateCarUseCase;
  deleteCar: DeleteCarUseCase;
  getCarById: GetCarByIdUseCase;
  listCars: ListCarsUseCase;
}

export class CarController {
  constructor(private readonly useCases: CarUseCases) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const { plate, color, brand } = req.body ?? {};
    const car = await this.useCases.createCar.execute({ plate, color, brand });

    res.status(201).json(toCarResponse(car));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { plate, color, brand } = req.body ?? {};
    const car = await this.useCases.updateCar.execute(req.params.id, { plate, color, brand });

    res.json(toCarResponse(car));
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.useCases.deleteCar.execute(req.params.id);

    res.status(204).send();
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const car = await this.useCases.getCarById.execute(req.params.id);

    res.json(toCarResponse(car));
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const cars = await this.useCases.listCars.execute({
      color: optionalQueryString(req, 'color'),
      brand: optionalQueryString(req, 'brand'),
    });

    res.json(cars.map(toCarResponse));
  };
}
