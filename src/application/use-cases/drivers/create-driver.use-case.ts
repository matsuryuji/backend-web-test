import { Driver, DriverData } from '../../../domain/entities/driver';
import { DriverRepository } from '../../../domain/repositories/driver-repository';
import { IdGenerator } from '../../protocols/id-generator';

export class CreateDriverUseCase {
  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: DriverData): Promise<Driver> {
    const driver = Driver.create(this.idGenerator.generate(), input);

    await this.driverRepository.save(driver);

    return driver;
  }
}
