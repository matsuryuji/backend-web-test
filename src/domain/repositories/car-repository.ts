import { Car } from '../entities/car';

export interface CarFilters {
  color?: string;
  brand?: string;
}

export interface CarRepository {
  save(car: Car): Promise<void>;
  findById(id: string): Promise<Car | null>;
  findByPlate(plate: string): Promise<Car | null>;
  findAll(filters?: CarFilters): Promise<Car[]>;
  delete(id: string): Promise<void>;
}
