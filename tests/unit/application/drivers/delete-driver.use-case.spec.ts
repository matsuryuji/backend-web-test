import { DeleteDriverUseCase } from '../../../../src/application/use-cases/drivers';
import { CarUsage } from '../../../../src/domain/entities/car-usage';
import { Driver } from '../../../../src/domain/entities/driver';
import { ConflictError, NotFoundError } from '../../../../src/domain/errors';
import { InMemoryCarUsageRepository } from '../../../../src/infra/repositories/in-memory/in-memory-car-usage-repository';
import { InMemoryDriverRepository } from '../../../../src/infra/repositories/in-memory/in-memory-driver-repository';

describe('DeleteDriverUseCase', () => {
  let repository: InMemoryDriverRepository;
  let carUsageRepository: InMemoryCarUsageRepository;
  let deleteDriver: DeleteDriverUseCase;

  beforeEach(async () => {
    repository = new InMemoryDriverRepository();
    carUsageRepository = new InMemoryCarUsageRepository();
    deleteDriver = new DeleteDriverUseCase(repository, carUsageRepository);
    await repository.save(Driver.create('driver-1', { name: 'João' }));
  });

  it('deletes an existing driver', async () => {
    await deleteDriver.execute('driver-1');

    expect(await repository.findById('driver-1')).toBeNull();
  });

  it('throws NotFoundError when the driver does not exist', async () => {
    await expect(deleteDriver.execute('missing')).rejects.toThrow(NotFoundError);
  });

  it('refuses to delete a driver that has usage records', async () => {
    await carUsageRepository.save(
      CarUsage.start('usage-1', { carId: 'car-1', driverId: 'driver-1', reason: 'Visita', startDate: new Date() }),
    );

    await expect(deleteDriver.execute('driver-1')).rejects.toThrow(ConflictError);
    expect(await repository.findById('driver-1')).not.toBeNull();
  });
});
