import { DeleteCarUseCase } from '../../../../src/application/use-cases/cars';
import { Car } from '../../../../src/domain/entities/car';
import { NotFoundError } from '../../../../src/domain/errors';
import { InMemoryCarRepository } from '../../../../src/infra/repositories/in-memory/in-memory-car-repository';

describe('DeleteCarUseCase', () => {
  let repository: InMemoryCarRepository;
  let deleteCar: DeleteCarUseCase;

  beforeEach(async () => {
    repository = new InMemoryCarRepository();
    deleteCar = new DeleteCarUseCase(repository);
    await repository.save(Car.create('car-1', { plate: 'AAA1111', color: 'Preto', brand: 'Fiat' }));
  });

  it('deletes an existing car', async () => {
    await deleteCar.execute('car-1');

    expect(await repository.findById('car-1')).toBeNull();
  });

  it('throws NotFoundError when the car does not exist', async () => {
    await expect(deleteCar.execute('missing')).rejects.toThrow(NotFoundError);
  });
});
