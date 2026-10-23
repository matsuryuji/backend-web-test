import { ListCarsUseCase } from '../../../../src/application/use-cases/cars';
import { Car } from '../../../../src/domain/entities/car';
import { InMemoryCarRepository } from '../../../../src/infra/repositories/in-memory/in-memory-car-repository';

describe('ListCarsUseCase', () => {
  let listCars: ListCarsUseCase;

  beforeEach(async () => {
    const repository = new InMemoryCarRepository();
    listCars = new ListCarsUseCase(repository);
    await repository.save(Car.create('car-1', { plate: 'AAA1111', color: 'Preto', brand: 'Fiat' }));
    await repository.save(Car.create('car-2', { plate: 'BBB2222', color: 'Branco', brand: 'Ford' }));
  });

  it('lists every car without filters', async () => {
    expect(await listCars.execute()).toHaveLength(2);
  });

  it('applies the given filters', async () => {
    const cars = await listCars.execute({ color: 'branco', brand: 'ford' });

    expect(cars.map((car) => car.id)).toEqual(['car-2']);
  });
});
