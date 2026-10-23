import { ListCarUsagesUseCase } from '../../../../src/application/use-cases/car-usages';
import { CarUsage } from '../../../../src/domain/entities/car-usage';
import { makeCarUsageScenario } from './setup';

describe('ListCarUsagesUseCase', () => {
  it('lists every usage with its car and driver', async () => {
    const { carUsageRepository, carRepository, driverRepository } = await makeCarUsageScenario();
    const listCarUsages = new ListCarUsagesUseCase(carUsageRepository, carRepository, driverRepository);

    await carUsageRepository.save(
      CarUsage.start('usage-1', { carId: 'car-1', driverId: 'driver-1', reason: 'Visita', startDate: new Date() }),
    );
    await carUsageRepository.save(
      CarUsage.start('usage-2', { carId: 'car-2', driverId: 'driver-2', reason: 'Entrega', startDate: new Date() }),
    );

    const usages = await listCarUsages.execute();

    expect(
      usages.map(({ carUsage, car, driver }) => ({ id: carUsage.id, plate: car.plate, driver: driver.name })),
    ).toEqual([
      { id: 'usage-1', plate: 'AAA1111', driver: 'João' },
      { id: 'usage-2', plate: 'BBB2222', driver: 'Maria' },
    ]);
  });

  it('returns an empty list when there are no usages', async () => {
    const { carUsageRepository, carRepository, driverRepository } = await makeCarUsageScenario();
    const listCarUsages = new ListCarUsagesUseCase(carUsageRepository, carRepository, driverRepository);

    expect(await listCarUsages.execute()).toEqual([]);
  });
});
