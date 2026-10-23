import { Driver } from '../../../src/domain/entities/driver';
import { ValidationError } from '../../../src/domain/errors';

describe('Driver', () => {
  it('creates a driver with a trimmed name', () => {
    const driver = Driver.create('driver-1', { name: '  João   da  Silva ' });

    expect(driver.toProps()).toEqual({ id: 'driver-1', name: 'João da Silva' });
  });

  it.each(['', '   ', undefined, 42])('rejects an invalid name (%p)', (name) => {
    expect(() => Driver.create('driver-1', { name: name as string })).toThrow(ValidationError);
  });

  it('updates the name keeping the same id', () => {
    const driver = Driver.create('driver-1', { name: 'João' });

    driver.update({ name: 'Maria' });

    expect(driver.toProps()).toEqual({ id: 'driver-1', name: 'Maria' });
  });

  it('keeps the previous name when an update is invalid', () => {
    const driver = Driver.create('driver-1', { name: 'João' });

    expect(() => driver.update({ name: '' })).toThrow(ValidationError);
    expect(driver.name).toBe('João');
  });
});
