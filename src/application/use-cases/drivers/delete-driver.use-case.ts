import { DriverRepository } from '../../../domain/repositories/driver-repository';
import { GetDriverByIdUseCase } from './get-driver-by-id.use-case';

export class DeleteDriverUseCase {
  private readonly getDriverById: GetDriverByIdUseCase;

  constructor(private readonly driverRepository: DriverRepository) {
    this.getDriverById = new GetDriverByIdUseCase(driverRepository);
  }

  async execute(id: string): Promise<void> {
    const driver = await this.getDriverById.execute(id);

    await this.driverRepository.delete(driver.id);
  }
}
