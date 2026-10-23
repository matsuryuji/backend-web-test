import { FinishCarUsageUseCase } from '../../../../src/application/use-cases/car-usages';
import { CarUsage } from '../../../../src/domain/entities/car-usage';
import { CarUsageAlreadyFinishedError, NotFoundError, ValidationError } from '../../../../src/domain/errors';
import { makeCarUsageScenario } from './setup';

describe('FinishCarUsageUseCase', () => {
  let scenario: Awaited<ReturnType<typeof makeCarUsageScenario>>;
  let finishCarUsage: FinishCarUsageUseCase;

  beforeEach(async () => {
    scenario = await makeCarUsageScenario();
    const { carUsageRepository, carRepository, driverRepository, clock } = scenario;
    finishCarUsage = new FinishCarUsageUseCase(carUsageRepository, carRepository, driverRepository, clock);
    await carUsageRepository.save(
      CarUsage.start('usage-1', {
        carId: 'car-1',
        driverId: 'driver-1',
        reason: 'Visita',
        startDate: new Date('2026-10-20T08:00:00.000Z'),
      }),
    );
  });

  it('finishes the usage with the current date and persists it', async () => {
    scenario.clock.set(new Date('2026-10-20T17:00:00.000Z'));

    const { carUsage, car, driver } = await finishCarUsage.execute('usage-1');

    expect(carUsage.endDate).toEqual(new Date('2026-10-20T17:00:00.000Z'));
    expect(car.id).toBe('car-1');
    expect(driver.id).toBe('driver-1');
    expect((await scenario.carUsageRepository.findById('usage-1'))?.isActive).toBe(false);
  });

  it('uses the informed end date', async () => {
    const endDate = new Date('2026-10-20T11:00:00.000Z');

    const { carUsage } = await finishCarUsage.execute('usage-1', { endDate });

    expect(carUsage.endDate).toEqual(endDate);
  });

  it('rejects an end date before the start date', async () => {
    await expect(
      finishCarUsage.execute('usage-1', { endDate: new Date('2026-10-19T08:00:00.000Z') }),
    ).rejects.toThrow(ValidationError);
    expect((await scenario.carUsageRepository.findById('usage-1'))?.isActive).toBe(true);
  });

  it('cannot finish the same usage twice', async () => {
    await finishCarUsage.execute('usage-1');

    await expect(finishCarUsage.execute('usage-1')).rejects.toThrow(CarUsageAlreadyFinishedError);
  });

  it('throws NotFoundError when the usage does not exist', async () => {
    await expect(finishCarUsage.execute('missing')).rejects.toThrow('Car usage with id "missing" was not found');
    await expect(finishCarUsage.execute('missing')).rejects.toThrow(NotFoundError);
  });
});
