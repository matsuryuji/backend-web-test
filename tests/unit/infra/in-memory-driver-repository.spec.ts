import { Driver } from '../../../src/domain/entities/driver';
import { InMemoryDriverRepository } from '../../../src/infra/repositories/in-memory/in-memory-driver-repository';

describe('InMemoryDriverRepository', () => {
  let repository: InMemoryDriverRepository;

  beforeEach(async () => {
    repository = new InMemoryDriverRepository();
    await repository.save(Driver.create('driver-1', { name: 'João da Silva' }));
    await repository.save(Driver.create('driver-2', { name: 'Maria Souza' }));
    await repository.save(Driver.create('driver-3', { name: 'Joana Lima' }));
  });

  it('finds a driver by id', async () => {
    const driver = await repository.findById('driver-2');

    expect(driver?.name).toBe('Maria Souza');
  });

  it('returns null when the id does not exist', async () => {
    expect(await repository.findById('missing')).toBeNull();
  });

  it('lists every driver when no filter is given', async () => {
    const drivers = await repository.findAll();

    expect(drivers.map((driver) => driver.id)).toEqual(['driver-1', 'driver-2', 'driver-3']);
  });

  it('filters by part of the name ignoring case and accents', async () => {
    const drivers = await repository.findAll({ name: 'jo' });

    expect(drivers.map((driver) => driver.id)).toEqual(['driver-1', 'driver-3']);
  });

  it('returns an empty list when no name matches', async () => {
    expect(await repository.findAll({ name: 'Pedro' })).toEqual([]);
  });

  it('deletes a driver', async () => {
    await repository.delete('driver-1');

    expect(await repository.findById('driver-1')).toBeNull();
  });

  it('does not expose stored state to outside mutations', async () => {
    const driver = await repository.findById('driver-1');
    driver?.update({ name: 'Outro Nome' });

    expect((await repository.findById('driver-1'))?.name).toBe('João da Silva');
  });
});
