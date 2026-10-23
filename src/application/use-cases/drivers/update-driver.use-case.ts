import { Driver, DriverData } from '../../../domain/entities/driver';
import { DriverRepository } from '../../../domain/repositories/driver-repository';
import { GetDriverByIdUseCase } from './get-driver-by-id.use-case';

export class UpdateDriverUseCase {
  private readonly getDriverById: GetDriverByIdUseCase;

  constructor(private readonly driverRepository: DriverRepository) {
    this.getDriverById = new GetDriverByIdUseCase(driverRepository);
  }

  async execute(id: string, input: DriverData): Promise<Driver> {
    const driver = await this.getDriverById.execute(id);
    driver.update(input);

    await this.driverRepository.save(driver);

    return driver;
  }
}
