import { IdGenerator } from '../../application/protocols/id-generator';
import {
  CreateDriverUseCase,
  DeleteDriverUseCase,
  GetDriverByIdUseCase,
  ListDriversUseCase,
  UpdateDriverUseCase,
} from '../../application/use-cases/drivers';
import { DriverRepository } from '../../domain/repositories/driver-repository';
import { DriverController } from '../../presentation/http/controllers/driver.controller';

export function makeDriverController(driverRepository: DriverRepository, idGenerator: IdGenerator): DriverController {
  return new DriverController({
    createDriver: new CreateDriverUseCase(driverRepository, idGenerator),
    updateDriver: new UpdateDriverUseCase(driverRepository),
    deleteDriver: new DeleteDriverUseCase(driverRepository),
    getDriverById: new GetDriverByIdUseCase(driverRepository),
    listDrivers: new ListDriversUseCase(driverRepository),
  });
}
