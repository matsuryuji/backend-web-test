import { CarUsage } from '../../../src/domain/entities/car-usage';
import { CarAlreadyInUseError, DriverAlreadyInUseError } from '../../../src/domain/errors';
import { InMemoryCarUsageRepository } from '../../../src/infra/repositories/in-memory/in-memory-car-usage-repository';

function usage(id: string, carId: string, driverId: string, startDate = '2026-10-20T08:00:00Z') {
  return CarUsage.start(id, { carId, driverId, reason: 'Visita', startDate: new Date(startDate) });
}

describe('InMemoryCarUsageRepository', () => {
  let repository: InMemoryCarUsageRepository;

  beforeEach(() => {
    repository = new InMemoryCarUsageRepository();
  });

  it('saves and finds a usage by id', async () => {
    await repository.save(usage('usage-1', 'car-1', 'driver-1'));

    const found = await repository.findById('usage-1');

    expect(found?.carId).toBe('car-1');
  });

  it('returns null when the id does not exist', async () => {
    expect(await repository.findById('missing')).toBeNull();
  });

  it('filters by car and by driver', async () => {
    const first = usage('usage-1', 'car-1', 'driver-1');
    first.finish(new Date('2026-10-20T12:00:00Z'));
    await repository.save(first);
    await repository.save(usage('usage-2', 'car-2', 'driver-1', '2026-10-21T08:00:00Z'));
    await repository.save(usage('usage-3', 'car-1', 'driver-2', '2026-10-22T08:00:00Z'));

    const byCar = await repository.findAll({ carId: 'car-1' });
    const byDriver = await repository.findAll({ driverId: 'driver-1' });

    expect(byCar.map((item) => item.id)).toEqual(['usage-1', 'usage-3']);
    expect(byDriver.map((item) => item.id)).toEqual(['usage-1', 'usage-2']);
    expect(await repository.findAll()).toHaveLength(3);
  });

  it('persists a finish on the same record', async () => {
    const saved = usage('usage-1', 'car-1', 'driver-1');
    await repository.save(saved);

    saved.finish(new Date('2026-10-20T12:00:00Z'));
    await repository.save(saved);

    expect((await repository.findById('usage-1'))?.isActive).toBe(false);
  });

  it('rejects an overlapping usage for the same car', async () => {
    await repository.save(usage('usage-1', 'car-1', 'driver-1'));

    await expect(repository.save(usage('usage-2', 'car-1', 'driver-2'))).rejects.toThrow(CarAlreadyInUseError);
  });

  it('rejects an overlapping usage for the same driver', async () => {
    await repository.save(usage('usage-1', 'car-1', 'driver-1'));

    await expect(repository.save(usage('usage-2', 'car-2', 'driver-1'))).rejects.toThrow(DriverAlreadyInUseError);
  });

  it('does not expose stored state to outside mutations', async () => {
    const saved = usage('usage-1', 'car-1', 'driver-1');
    await repository.save(saved);

    saved.finish(new Date('2026-10-20T12:00:00Z'));

    expect((await repository.findById('usage-1'))?.isActive).toBe(true);
  });
});
