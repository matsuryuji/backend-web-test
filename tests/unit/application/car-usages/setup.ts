import { Car } from '../../../../src/domain/entities/car';
import { Driver } from '../../../../src/domain/entities/driver';
import { InMemoryCarRepository } from '../../../../src/infra/repositories/in-memory/in-memory-car-repository';
import { InMemoryCarUsageRepository } from '../../../../src/infra/repositories/in-memory/in-memory-car-usage-repository';
import { InMemoryDriverRepository } from '../../../../src/infra/repositories/in-memory/in-memory-driver-repository';
import { FixedClock } from '../../../helpers/fixed-clock';
import { SequentialIdGenerator } from '../../../helpers/sequential-id-generator';

export async function makeCarUsageScenario() {
  const carRepository = new InMemoryCarRepository();
  const driverRepository = new InMemoryDriverRepository();
  const carUsageRepository = new InMemoryCarUsageRepository();
  const clock = new FixedClock(new Date('2026-10-20T08:00:00.000Z'));
  const idGenerator = new SequentialIdGenerator();

  await carRepository.save(Car.create('car-1', { plate: 'AAA1111', color: 'Preto', brand: 'Fiat' }));
  await carRepository.save(Car.create('car-2', { plate: 'BBB2222', color: 'Branco', brand: 'Ford' }));
  await driverRepository.save(Driver.create('driver-1', { name: 'João' }));
  await driverRepository.save(Driver.create('driver-2', { name: 'Maria' }));

  return { carRepository, driverRepository, carUsageRepository, clock, idGenerator };
}
