import { FinishCarUsageUseCase, StartCarUsageUseCase } from '../../../../src/application/use-cases/car-usages';
import {
  CarAlreadyInUseError,
  DriverAlreadyInUseError,
  NotFoundError,
  ValidationError,
} from '../../../../src/domain/errors';
import { makeCarUsageScenario } from './setup';

describe('StartCarUsageUseCase', () => {
  let scenario: Awaited<ReturnType<typeof makeCarUsageScenario>>;
  let startCarUsage: StartCarUsageUseCase;
  let finishCarUsage: FinishCarUsageUseCase;

  beforeEach(async () => {
    scenario = await makeCarUsageScenario();
    const { carUsageRepository, carRepository, driverRepository, idGenerator, clock } = scenario;
    startCarUsage = new StartCarUsageUseCase(carUsageRepository, carRepository, driverRepository, idGenerator, clock);
    finishCarUsage = new FinishCarUsageUseCase(carUsageRepository, carRepository, driverRepository, clock);
  });

  it('starts a usage with the current date and returns car and driver details', async () => {
    const { carUsage, car, driver } = await startCarUsage.execute({
      carId: 'car-1',
      driverId: 'driver-1',
      reason: 'Visita ao cliente',
    });

    expect(carUsage.toProps()).toEqual({
      id: 'id-1',
      carId: 'car-1',
      driverId: 'driver-1',
      reason: 'Visita ao cliente',
      startDate: new Date('2026-10-20T08:00:00.000Z'),
      endDate: null,
    });
    expect(car.plate).toBe('AAA1111');
    expect(driver.name).toBe('João');
    expect(await scenario.carUsageRepository.findById('id-1')).not.toBeNull();
  });

  it('uses the informed start date', async () => {
    const startDate = new Date('2026-10-19T14:30:00.000Z');

    const { carUsage } = await startCarUsage.execute({
      carId: 'car-1',
      driverId: 'driver-1',
      reason: 'Visita',
      startDate,
    });

    expect(carUsage.startDate).toEqual(startDate);
  });

  it('validates the input before looking up car and driver', async () => {
    await expect(startCarUsage.execute({ carId: '', driverId: '', reason: '' })).rejects.toThrow(ValidationError);
  });

  it('throws NotFoundError when the car does not exist', async () => {
    await expect(startCarUsage.execute({ carId: 'missing', driverId: 'driver-1', reason: 'Visita' })).rejects.toThrow(
      'Car with id "missing" was not found',
    );
  });

  it('throws NotFoundError when the driver does not exist', async () => {
    await expect(startCarUsage.execute({ carId: 'car-1', driverId: 'missing', reason: 'Visita' })).rejects.toThrow(
      NotFoundError,
    );
  });

  it('does not allow a car to be used by two drivers at the same time', async () => {
    await startCarUsage.execute({ carId: 'car-1', driverId: 'driver-1', reason: 'Visita' });

    await expect(startCarUsage.execute({ carId: 'car-1', driverId: 'driver-2', reason: 'Entrega' })).rejects.toThrow(
      CarAlreadyInUseError,
    );
  });

  it('does not allow a driver to use two cars at the same time', async () => {
    await startCarUsage.execute({ carId: 'car-1', driverId: 'driver-1', reason: 'Visita' });

    await expect(startCarUsage.execute({ carId: 'car-2', driverId: 'driver-1', reason: 'Entrega' })).rejects.toThrow(
      DriverAlreadyInUseError,
    );
  });

  it('allows car and driver to be used again after the usage is finished', async () => {
    const { carUsage } = await startCarUsage.execute({ carId: 'car-1', driverId: 'driver-1', reason: 'Visita' });
    scenario.clock.set(new Date('2026-10-20T12:00:00.000Z'));
    await finishCarUsage.execute(carUsage.id);

    const otherDriver = await startCarUsage.execute({ carId: 'car-1', driverId: 'driver-2', reason: 'Entrega' });
    const otherCar = await startCarUsage.execute({ carId: 'car-2', driverId: 'driver-1', reason: 'Reunião' });

    expect(otherDriver.carUsage.isActive).toBe(true);
    expect(otherCar.carUsage.isActive).toBe(true);
  });

  it('rejects a backdated start inside a period in which the car was already in use', async () => {
    const { carUsage } = await startCarUsage.execute({ carId: 'car-1', driverId: 'driver-1', reason: 'Visita' });
    await finishCarUsage.execute(carUsage.id, { endDate: new Date('2026-10-20T12:00:00.000Z') });

    await expect(
      startCarUsage.execute({
        carId: 'car-1',
        driverId: 'driver-2',
        reason: 'Entrega',
        startDate: new Date('2026-10-20T10:00:00.000Z'),
      }),
    ).rejects.toThrow(CarAlreadyInUseError);
  });

  it('accepts only one of two simultaneous requests for the same car', async () => {
    const results = await Promise.allSettled([
      startCarUsage.execute({ carId: 'car-1', driverId: 'driver-1', reason: 'Visita' }),
      startCarUsage.execute({ carId: 'car-1', driverId: 'driver-2', reason: 'Entrega' }),
    ]);

    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1);
    expect(results.find((result) => result.status === 'rejected')).toEqual({
      status: 'rejected',
      reason: expect.any(CarAlreadyInUseError),
    });
  });
});
