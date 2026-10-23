import { CarUsage } from '../entities/car-usage';

export interface CarUsageFilters {
  carId?: string;
  driverId?: string;
}

export interface CarUsageRepository {
  save(carUsage: CarUsage): Promise<void>;
  findById(id: string): Promise<CarUsage | null>;
  findAll(filters?: CarUsageFilters): Promise<CarUsage[]>;
}
