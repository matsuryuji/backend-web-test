import { CreateDriverUseCase } from '../../../../src/application/use-cases/drivers';
import { ValidationError } from '../../../../src/domain/errors';
import { InMemoryDriverRepository } from '../../../../src/infra/repositories/in-memory/in-memory-driver-repository';
import { SequentialIdGenerator } from '../../../helpers/sequential-id-generator';

describe('CreateDriverUseCase', () => {
  let repository: InMemoryDriverRepository;
  let createDriver: CreateDriverUseCase;

  beforeEach(() => {
    repository = new InMemoryDriverRepository();
    createDriver = new CreateDriverUseCase(repository, new SequentialIdGenerator());
  });

  it('creates and persists a driver', async () => {
    const driver = await createDriver.execute({ name: 'João' });

    expect(driver.toProps()).toEqual({ id: 'id-1', name: 'João' });
    expect(await repository.findById('id-1')).not.toBeNull();
  });

  it('allows drivers with the same name', async () => {
    await createDriver.execute({ name: 'João' });
    await createDriver.execute({ name: 'João' });

    expect(await repository.findAll()).toHaveLength(2);
  });

  it('does not persist invalid drivers', async () => {
    await expect(createDriver.execute({ name: '' })).rejects.toThrow(ValidationError);

    expect(await repository.findAll()).toHaveLength(0);
  });
});
