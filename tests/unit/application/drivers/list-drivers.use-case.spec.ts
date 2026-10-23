import { ListDriversUseCase } from '../../../../src/application/use-cases/drivers';
import { Driver } from '../../../../src/domain/entities/driver';
import { InMemoryDriverRepository } from '../../../../src/infra/repositories/in-memory/in-memory-driver-repository';

describe('ListDriversUseCase', () => {
  let listDrivers: ListDriversUseCase;

  beforeEach(async () => {
    const repository = new InMemoryDriverRepository();
    listDrivers = new ListDriversUseCase(repository);
    await repository.save(Driver.create('driver-1', { name: 'João' }));
    await repository.save(Driver.create('driver-2', { name: 'Maria' }));
  });

  it('lists every driver without filters', async () => {
    expect(await listDrivers.execute()).toHaveLength(2);
  });

  it('applies the name filter', async () => {
    const drivers = await listDrivers.execute({ name: 'mar' });

    expect(drivers.map((driver) => driver.id)).toEqual(['driver-2']);
  });
});
