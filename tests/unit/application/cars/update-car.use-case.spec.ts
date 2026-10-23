import { UpdateCarUseCase } from '../../../../src/application/use-cases/cars';
import { Car } from '../../../../src/domain/entities/car';
import { ConflictError, NotFoundError } from '../../../../src/domain/errors';
import { InMemoryCarRepository } from '../../../../src/infra/repositories/in-memory/in-memory-car-repository';

describe('UpdateCarUseCase', () => {
  let repository: InMemoryCarRepository;
  let updateCar: UpdateCarUseCase;

  beforeEach(async () => {
    repository = new InMemoryCarRepository();
    updateCar = new UpdateCarUseCase(repository);
    await repository.save(Car.create('car-1', { plate: 'AAA1111', color: 'Preto', brand: 'Fiat' }));
    await repository.save(Car.create('car-2', { plate: 'BBB2222', color: 'Branco', brand: 'Ford' }));
  });

  it('updates and persists the car', async () => {
    const car = await updateCar.execute('car-1', { plate: 'AAA1111', color: 'Vermelho', brand: 'Fiat' });

    expect(car.color).toBe('Vermelho');
    expect((await repository.findById('car-1'))?.color).toBe('Vermelho');
  });

  it('allows changing the plate to a free one', async () => {
    const car = await updateCar.execute('car-1', { plate: 'CCC3333', color: 'Preto', brand: 'Fiat' });

    expect(car.plate).toBe('CCC3333');
  });

  it('rejects a plate that belongs to another car', async () => {
    await expect(updateCar.execute('car-1', { plate: 'BBB2222', color: 'Preto', brand: 'Fiat' })).rejects.toThrow(
      ConflictError,
    );
    expect((await repository.findById('car-1'))?.plate).toBe('AAA1111');
  });

  it('throws NotFoundError when the car does not exist', async () => {
    await expect(updateCar.execute('missing', { plate: 'AAA1111', color: 'Preto', brand: 'Fiat' })).rejects.toThrow(
      NotFoundError,
    );
  });
});
