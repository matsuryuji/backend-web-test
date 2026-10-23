import { DeleteCarUseCase } from '../../../../src/application/use-cases/cars';
import { Car } from '../../../../src/domain/entities/car';
import { CarUsage } from '../../../../src/domain/entities/car-usage';
import { ConflictError, NotFoundError } from '../../../../src/domain/errors';
import { InMemoryCarRepository } from '../../../../src/infra/repositories/in-memory/in-memory-car-repository';
import { InMemoryCarUsageRepository } from '../../../../src/infra/repositories/in-memory/in-memory-car-usage-repository';

describe('DeleteCarUseCase', () => {
  let repository: InMemoryCarRepository;
  let carUsageRepository: InMemoryCarUsageRepository;
  let deleteCar: DeleteCarUseCase;

  beforeEach(async () => {
    repository = new InMemoryCarRepository();
    carUsageRepository = new InMemoryCarUsageRepository();
    deleteCar = new DeleteCarUseCase(repository, carUsageRepository);
    await repository.save(Car.create('car-1', { plate: 'AAA1111', color: 'Preto', brand: 'Fiat' }));
  });

  it('deletes an existing car', async () => {
    await deleteCar.execute('car-1');

    expect(await repository.findById('car-1')).toBeNull();
  });

  it('throws NotFoundError when the car does not exist', async () => {
    await expect(deleteCar.execute('missing')).rejects.toThrow(NotFoundError);
  });

  it('refuses to delete a car that has usage records', async () => {
    await carUsageRepository.save(
      CarUsage.start('usage-1', { carId: 'car-1', driverId: 'driver-1', reason: 'Visita', startDate: new Date() }),
    );

    await expect(deleteCar.execute('car-1')).rejects.toThrow(ConflictError);
    expect(await repository.findById('car-1')).not.toBeNull();
  });
});
