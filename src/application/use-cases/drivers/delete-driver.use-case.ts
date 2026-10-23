import { ConflictError } from '../../../domain/errors';
import { CarUsageRepository } from '../../../domain/repositories/car-usage-repository';
import { DriverRepository } from '../../../domain/repositories/driver-repository';
import { GetDriverByIdUseCase } from './get-driver-by-id.use-case';

export class DeleteDriverUseCase {
  private readonly getDriverById: GetDriverByIdUseCase;

  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly carUsageRepository: CarUsageRepository,
  ) {
    this.getDriverById = new GetDriverByIdUseCase(driverRepository);
  }

  async execute(id: string): Promise<void> {
    const driver = await this.getDriverById.execute(id);
    const driverUsages = await this.carUsageRepository.findAll({ driverId: driver.id });

    if (driverUsages.length > 0) {
      throw new ConflictError(`Driver "${driver.id}" has usage records and cannot be deleted`);
    }

    await this.driverRepository.delete(driver.id);
  }
}
