import { Driver } from '../entities/driver';

export interface DriverFilters {
  name?: string;
}

export interface DriverRepository {
  save(driver: Driver): Promise<void>;
  findById(id: string): Promise<Driver | null>;
  findAll(filters?: DriverFilters): Promise<Driver[]>;
  delete(id: string): Promise<void>;
}
