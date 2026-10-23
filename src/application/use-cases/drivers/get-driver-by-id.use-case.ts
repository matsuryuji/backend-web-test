import { Driver } from '../../../domain/entities/driver';
import { NotFoundError } from '../../../domain/errors';
import { DriverRepository } from '../../../domain/repositories/driver-repository';

export class GetDriverByIdUseCase {
  constructor(private readonly driverRepository: DriverRepository) {}

  async execute(id: string): Promise<Driver> {
    const driver = await this.driverRepository.findById(id);

    if (!driver) {
      throw new NotFoundError('Driver', id);
    }

    return driver;
  }
}
