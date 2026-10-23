import { CarUsageDetails } from '../../../application/use-cases/car-usages';
import { CarResponse, toCarResponse } from './car.presenter';
import { DriverResponse, toDriverResponse } from './driver.presenter';

export interface CarUsageResponse {
  id: string;
  reason: string;
  startDate: string;
  endDate: string | null;
  driver: DriverResponse;
  car: CarResponse;
}

export function toCarUsageResponse({ carUsage, car, driver }: CarUsageDetails): CarUsageResponse {
  return {
    id: carUsage.id,
    reason: carUsage.reason,
    startDate: carUsage.startDate.toISOString(),
    endDate: carUsage.endDate?.toISOString() ?? null,
    driver: toDriverResponse(driver),
    car: toCarResponse(car),
  };
}
