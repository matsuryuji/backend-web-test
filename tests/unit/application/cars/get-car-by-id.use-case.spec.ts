import { GetCarByIdUseCase } from '../../../../src/application/use-cases/cars';
import { Car } from '../../../../src/domain/entities/car';
import { NotFoundError } from '../../../../src/domain/errors';
import { InMemoryCarRepository } from '../../../../src/infra/repositories/in-memory/in-memory-car-repository';

describe('GetCarByIdUseCase', () => {
  let getCarById: GetCarByIdUseCase;

  beforeEach(async () => {
    const repository = new InMemoryCarRepository();
    getCarById = new GetCarByIdUseCase(repository);
    await repository.save(Car.create('car-1', { plate: 'AAA1111', color: 'Preto', brand: 'Fiat' }));
  });

  it('returns the car', async () => {
    const car = await getCarById.execute('car-1');

    expect(car.plate).toBe('AAA1111');
  });

  it('throws NotFoundError when the car does not exist', async () => {
    await expect(getCarById.execute('missing')).rejects.toThrow('Car with id "missing" was not found');
    await expect(getCarById.execute('missing')).rejects.toThrow(NotFoundError);
  });
});
