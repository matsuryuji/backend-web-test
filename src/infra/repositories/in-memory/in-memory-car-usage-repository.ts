import { CarUsage, CarUsageProps } from '../../../domain/entities/car-usage';
import { CarAlreadyInUseError, DriverAlreadyInUseError } from '../../../domain/errors';
import { CarUsageFilters, CarUsageRepository } from '../../../domain/repositories/car-usage-repository';

export class InMemoryCarUsageRepository implements CarUsageRepository {
  private readonly carUsages = new Map<string, CarUsageProps>();

  async save(carUsage: CarUsage): Promise<void> {
    this.ensureNoOverlap(carUsage);
    this.carUsages.set(carUsage.id, carUsage.toProps());
  }

  async findById(id: string): Promise<CarUsage | null> {
    const props = this.carUsages.get(id);

    return props ? CarUsage.restore(props) : null;
  }

  async findAll(filters: CarUsageFilters = {}): Promise<CarUsage[]> {
    return [...this.carUsages.values()]
      .filter((props) => filters.carId === undefined || props.carId === filters.carId)
      .filter((props) => filters.driverId === undefined || props.driverId === filters.driverId)
      .map((props) => CarUsage.restore(props));
  }

  private ensureNoOverlap(carUsage: CarUsage): void {
    const others = [...this.carUsages.values()]
      .filter((props) => props.id !== carUsage.id)
      .map((props) => CarUsage.restore(props))
      .filter((other) => other.overlaps(carUsage));

    if (others.some((other) => other.carId === carUsage.carId)) {
      throw new CarAlreadyInUseError(carUsage.carId);
    }

    if (others.some((other) => other.driverId === carUsage.driverId)) {
      throw new DriverAlreadyInUseError(carUsage.driverId);
    }
  }
}
