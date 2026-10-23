import { CreateCarUseCase } from '../../../../src/application/use-cases/cars';
import { ConflictError, ValidationError } from '../../../../src/domain/errors';
import { InMemoryCarRepository } from '../../../../src/infra/repositories/in-memory/in-memory-car-repository';
import { SequentialIdGenerator } from '../../../helpers/sequential-id-generator';

describe('CreateCarUseCase', () => {
  let repository: InMemoryCarRepository;
  let createCar: CreateCarUseCase;

  beforeEach(() => {
    repository = new InMemoryCarRepository();
    createCar = new CreateCarUseCase(repository, new SequentialIdGenerator());
  });

  it('creates and persists a car', async () => {
    const car = await createCar.execute({ plate: 'ABC1234', color: 'Preto', brand: 'Fiat' });

    expect(car.toProps()).toEqual({ id: 'id-1', plate: 'ABC1234', color: 'Preto', brand: 'Fiat' });
    expect(await repository.findById('id-1')).not.toBeNull();
  });

  it('rejects a plate that is already registered, even with different formatting', async () => {
    await createCar.execute({ plate: 'ABC1234', color: 'Preto', brand: 'Fiat' });

    await expect(createCar.execute({ plate: 'abc-1234', color: 'Branco', brand: 'Ford' })).rejects.toThrow(
      ConflictError,
    );
  });

  it('does not persist invalid cars', async () => {
    await expect(createCar.execute({ plate: '', color: 'Preto', brand: 'Fiat' })).rejects.toThrow(ValidationError);

    expect(await repository.findAll()).toHaveLength(0);
  });
});
