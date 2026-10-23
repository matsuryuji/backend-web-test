import { Driver } from '../../../domain/entities/driver';
import { DriverFilters, DriverRepository } from '../../../domain/repositories/driver-repository';

export class ListDriversUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(filters: DriverFilters = {}): Promise<Driver[]> {
    return this.driverRepository.findAll(filters);
  }
}
