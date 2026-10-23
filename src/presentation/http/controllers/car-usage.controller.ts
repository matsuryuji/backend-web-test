import { Request, Response } from 'express';
import {
  FinishCarUsageUseCase,
  ListCarUsagesUseCase,
  StartCarUsageUseCase,
} from '../../../application/use-cases/car-usages';
import { optionalDate } from '../helpers/body-params';
import { toCarUsageResponse } from '../presenters/car-usage.presenter';

export interface CarUsageUseCases {
  startCarUsage: StartCarUsageUseCase;
  finishCarUsage: FinishCarUsageUseCase;
  listCarUsages: ListCarUsagesUseCase;
}

export class CarUsageController {
  constructor(private readonly useCases: CarUsageUseCases) {}

  start = async (req: Request, res: Response): Promise<void> => {
    const { carId, driverId, reason, startDate } = req.body ?? {};
    const details = await this.useCases.startCarUsage.execute({
      carId,
      driverId,
      reason,
      startDate: optionalDate(startDate, 'startDate'),
    });

    res.status(201).json(toCarUsageResponse(details));
  };

  finish = async (req: Request, res: Response): Promise<void> => {
    const { endDate } = req.body ?? {};
    const details = await this.useCases.finishCarUsage.execute(req.params.id, {
      endDate: optionalDate(endDate, 'endDate'),
    });

    res.json(toCarUsageResponse(details));
  };

  list = async (_req: Request, res: Response): Promise<void> => {
    const carUsages = await this.useCases.listCarUsages.execute();

    res.json(carUsages.map(toCarUsageResponse));
  };
}
