import { UpdateDriverUseCase } from '../../../../src/application/use-cases/drivers';
import { Driver } from '../../../../src/domain/entities/driver';
import { NotFoundError, ValidationError } from '../../../../src/domain/errors';
import { InMemoryDriverRepository } from '../../../../src/infra/repositories/in-memory/in-memory-driver-repository';

describe('UpdateDriverUseCase', () => {
  let repository: InMemoryDriverRepository;
  let updateDriver: UpdateDriverUseCase;

  beforeEach(async () => {
    repository = new InMemoryDriverRepository();
    updateDriver = new UpdateDriverUseCase(repository);
    await repository.save(Driver.create('driver-1', { name: 'João' }));
  });

  it('updates and persists the driver', async () => {
    const driver = await updateDriver.execute('driver-1', { name: 'João Pedro' });

    expect(driver.name).toBe('João Pedro');
    expect((await repository.findById('driver-1'))?.name).toBe('João Pedro');
  });

  it('does not persist invalid data', async () => {
    await expect(updateDriver.execute('driver-1', { name: '' })).rejects.toThrow(ValidationError);

    expect((await repository.findById('driver-1'))?.name).toBe('João');
  });

  it('throws NotFoundError when the driver does not exist', async () => {
    await expect(updateDriver.execute('missing', { name: 'Maria' })).rejects.toThrow(NotFoundError);
  });
});
