import { Car, CarProps, normalizePlate } from '../../../domain/entities/car';
import { CarFilters, CarRepository } from '../../../domain/repositories/car-repository';
import { matchesIgnoringCase } from './text-match';

export class InMemoryCarRepository implements CarRepository {
  private readonly cars = new Map<string, CarProps>();

  async save(car: Car): Promise<void> {
    this.cars.set(car.id, car.toProps());
  }

  async findById(id: string): Promise<Car | null> {
    const props = this.cars.get(id);

    return props ? Car.restore(props) : null;
  }

  async findByPlate(plate: string): Promise<Car | null> {
    const normalizedPlate = normalizePlate(plate);
    const props = [...this.cars.values()].find((car) => car.plate === normalizedPlate);

    return props ? Car.restore(props) : null;
  }

  async findAll(filters: CarFilters = {}): Promise<Car[]> {
    return [...this.cars.values()]
      .filter((car) => matchesIgnoringCase(car.color, filters.color))
      .filter((car) => matchesIgnoringCase(car.brand, filters.brand))
      .map((props) => Car.restore(props));
  }

  async delete(id: string): Promise<void> {
    this.cars.delete(id);
  }
}
