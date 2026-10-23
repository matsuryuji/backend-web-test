import { Driver, DriverProps } from '../../../domain/entities/driver';
import { DriverFilters, DriverRepository } from '../../../domain/repositories/driver-repository';
import { containsIgnoringCase } from './text-match';

export class InMemoryDriverRepository implements DriverRepository {
  private readonly drivers = new Map<string, DriverProps>();

  async save(driver: Driver): Promise<void> {
    this.drivers.set(driver.id, driver.toProps());
  }

  async findById(id: string): Promise<Driver | null> {
    const props = this.drivers.get(id);

    return props ? Driver.restore(props) : null;
  }

  async findAll(filters: DriverFilters = {}): Promise<Driver[]> {
    return [...this.drivers.values()]
      .filter((driver) => containsIgnoringCase(driver.name, filters.name))
      .map((props) => Driver.restore(props));
  }

  async delete(id: string): Promise<void> {
    this.drivers.delete(id);
  }
}
