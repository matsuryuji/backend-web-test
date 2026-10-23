import { DeleteDriverUseCase } from '../../../../src/application/use-cases/drivers';
import { Driver } from '../../../../src/domain/entities/driver';
import { NotFoundError } from '../../../../src/domain/errors';
import { InMemoryDriverRepository } from '../../../../src/infra/repositories/in-memory/in-memory-driver-repository';

describe('DeleteDriverUseCase', () => {
  let repository: InMemoryDriverRepository;
  let deleteDriver: DeleteDriverUseCase;

  beforeEach(async () => {
    repository = new InMemoryDriverRepository();
    deleteDriver = new DeleteDriverUseCase(repository);
    await repository.save(Driver.create('driver-1', { name: 'João' }));
  });

  it('deletes an existing driver', async () => {
    await deleteDriver.execute('driver-1');

    expect(await repository.findById('driver-1')).toBeNull();
  });

  it('throws NotFoundError when the driver does not exist', async () => {
    await expect(deleteDriver.execute('missing')).rejects.toThrow(NotFoundError);
  });
});
