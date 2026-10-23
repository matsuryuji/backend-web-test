import { Car } from '../../../src/domain/entities/car';
import { InMemoryCarRepository } from '../../../src/infra/repositories/in-memory/in-memory-car-repository';

describe('InMemoryCarRepository', () => {
  let repository: InMemoryCarRepository;

  beforeEach(async () => {
    repository = new InMemoryCarRepository();
    await repository.save(Car.create('car-1', { plate: 'AAA1111', color: 'Preto', brand: 'Fiat' }));
    await repository.save(Car.create('car-2', { plate: 'BBB2222', color: 'Branco', brand: 'Fiat' }));
    await repository.save(Car.create('car-3', { plate: 'CCC3C33', color: 'Preto', brand: 'Citroën' }));
  });

  it('finds a car by id', async () => {
    const car = await repository.findById('car-2');

    expect(car?.plate).toBe('BBB2222');
  });

  it('returns null when the id does not exist', async () => {
    expect(await repository.findById('missing')).toBeNull();
  });

  it('finds a car by plate regardless of formatting', async () => {
    const car = await repository.findByPlate('aaa-1111');

    expect(car?.id).toBe('car-1');
  });

  it('lists every car when no filter is given', async () => {
    const cars = await repository.findAll();

    expect(cars.map((car) => car.id)).toEqual(['car-1', 'car-2', 'car-3']);
  });

  it('filters by color ignoring case', async () => {
    const cars = await repository.findAll({ color: 'preto' });

    expect(cars.map((car) => car.id)).toEqual(['car-1', 'car-3']);
  });

  it('filters by brand ignoring case and accents', async () => {
    const cars = await repository.findAll({ brand: 'citroen' });

    expect(cars.map((car) => car.id)).toEqual(['car-3']);
  });

  it('combines color and brand filters', async () => {
    const cars = await repository.findAll({ color: 'Preto', brand: 'Fiat' });

    expect(cars.map((car) => car.id)).toEqual(['car-1']);
  });

  it('deletes a car', async () => {
    await repository.delete('car-1');

    expect(await repository.findById('car-1')).toBeNull();
  });

  it('does not expose stored state to outside mutations', async () => {
    const car = await repository.findById('car-1');
    car?.update({ plate: 'ZZZ9999', color: 'Azul', brand: 'Ford' });

    const stored = await repository.findById('car-1');

    expect(stored?.plate).toBe('AAA1111');
  });
});
