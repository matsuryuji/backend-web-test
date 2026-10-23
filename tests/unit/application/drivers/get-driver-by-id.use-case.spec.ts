import { GetDriverByIdUseCase } from '../../../../src/application/use-cases/drivers';
import { Driver } from '../../../../src/domain/entities/driver';
import { NotFoundError } from '../../../../src/domain/errors';
import { InMemoryDriverRepository } from '../../../../src/infra/repositories/in-memory/in-memory-driver-repository';

describe('GetDriverByIdUseCase', () => {
  let getDriverById: GetDriverByIdUseCase;

  beforeEach(async () => {
    const repository = new InMemoryDriverRepository();
    getDriverById = new GetDriverByIdUseCase(repository);
    await repository.save(Driver.create('driver-1', { name: 'João' }));
  });

  it('returns the driver', async () => {
    const driver = await getDriverById.execute('driver-1');

    expect(driver.name).toBe('João');
  });

  it('throws NotFoundError when the driver does not exist', async () => {
    await expect(getDriverById.execute('missing')).rejects.toThrow(NotFoundError);
    await expect(getDriverById.execute('missing')).rejects.toThrow('Driver with id "missing" was not found');
  });
});
