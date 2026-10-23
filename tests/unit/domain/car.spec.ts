import { Car } from '../../../src/domain/entities/car';
import { ValidationError } from '../../../src/domain/errors';

const validData = { plate: 'abc-1234', color: ' Preto ', brand: ' Fiat ' };

function captureError(action: () => unknown): ValidationError {
  try {
    action();
  } catch (error) {
    return error as ValidationError;
  }
  throw new Error('Expected action to throw');
}

describe('Car', () => {
  it('creates a car with normalized plate and trimmed fields', () => {
    const car = Car.create('car-1', validData);

    expect(car.toProps()).toEqual({ id: 'car-1', plate: 'ABC1234', color: 'Preto', brand: 'Fiat' });
  });

  it('accepts Mercosul plates', () => {
    const car = Car.create('car-1', { ...validData, plate: 'bra2e19' });

    expect(car.plate).toBe('BRA2E19');
  });

  it('rejects missing fields listing every problem', () => {
    const error = captureError(() =>
      Car.create('car-1', { plate: '', color: '  ', brand: undefined as unknown as string }),
    );

    expect(error).toBeInstanceOf(ValidationError);
    expect(error.details).toEqual(['plate is required', 'color is required', 'brand is required']);
  });

  it('rejects plates in an invalid format', () => {
    const error = captureError(() => Car.create('car-1', { ...validData, plate: '1234-ABC' }));

    expect(error.details).toEqual(['plate must follow the format ABC1234, ABC-1234 or ABC1D23']);
  });

  it('updates its data keeping the same id', () => {
    const car = Car.create('car-1', validData);

    car.update({ plate: 'XYZ9A87', color: 'Branco', brand: 'Volkswagen' });

    expect(car.toProps()).toEqual({ id: 'car-1', plate: 'XYZ9A87', color: 'Branco', brand: 'Volkswagen' });
  });

  it('keeps previous data when an update is invalid', () => {
    const car = Car.create('car-1', validData);

    expect(() => car.update({ ...validData, color: '' })).toThrow(ValidationError);
    expect(car.color).toBe('Preto');
  });
});
