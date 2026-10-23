import { Request, Response } from 'express';
import {
  CreateDriverUseCase,
  DeleteDriverUseCase,
  GetDriverByIdUseCase,
  ListDriversUseCase,
  UpdateDriverUseCase,
} from '../../../application/use-cases/drivers';
import { optionalQueryString } from '../helpers/query-params';
import { toDriverResponse } from '../presenters/driver.presenter';

export interface DriverUseCases {
  createDriver: CreateDriverUseCase;
  updateDriver: UpdateDriverUseCase;
  deleteDriver: DeleteDriverUseCase;
  getDriverById: GetDriverByIdUseCase;
  listDrivers: ListDriversUseCase;
}

export class DriverController {
  constructor(private readonly useCases: DriverUseCases) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body ?? {};
    const driver = await this.useCases.createDriver.execute({ name });

    res.status(201).json(toDriverResponse(driver));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body ?? {};
    const driver = await this.useCases.updateDriver.execute(req.params.id, { name });

    res.json(toDriverResponse(driver));
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.useCases.deleteDriver.execute(req.params.id);

    res.status(204).send();
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const driver = await this.useCases.getDriverById.execute(req.params.id);

    res.json(toDriverResponse(driver));
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const drivers = await this.useCases.listDrivers.execute({
      name: optionalQueryString(req, 'name'),
    });

    res.json(drivers.map(toDriverResponse));
  };
}
