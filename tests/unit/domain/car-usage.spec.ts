import { CarUsage } from '../../../src/domain/entities/car-usage';
import { CarUsageAlreadyFinishedError, ValidationError } from '../../../src/domain/errors';

const startDate = new Date('2026-10-20T08:00:00.000Z');

function startUsage(overrides: Partial<{ id: string; startDate: Date }> = {}) {
  return CarUsage.start(overrides.id ?? 'usage-1', {
    carId: 'car-1',
    driverId: 'driver-1',
    reason: '  Visita ao cliente ',
    startDate: overrides.startDate ?? startDate,
  });
}

function finishedUsage(id: string, start: string, end: string) {
  const usage = startUsage({ id, startDate: new Date(start) });
  usage.finish(new Date(end));
  return usage;
}

describe('CarUsage', () => {
  it('starts an active usage with a trimmed reason', () => {
    const usage = startUsage();

    expect(usage.toProps()).toEqual({
      id: 'usage-1',
      carId: 'car-1',
      driverId: 'driver-1',
      reason: 'Visita ao cliente',
      startDate,
      endDate: null,
    });
    expect(usage.isActive).toBe(true);
  });

  it('rejects missing data listing every problem', () => {
    let error: ValidationError | undefined;

    try {
      CarUsage.start('usage-1', { carId: '', driverId: ' ', reason: '', startDate: new Date('invalid') });
    } catch (caught) {
      error = caught as ValidationError;
    }

    expect(error).toBeInstanceOf(ValidationError);
    expect(error?.details).toEqual([
      'carId is required',
      'driverId is required',
      'reason is required',
      'startDate must be a valid date',
    ]);
  });

  it('finishes the usage storing the end date', () => {
    const usage = startUsage();
    const endDate = new Date('2026-10-20T18:00:00.000Z');

    usage.finish(endDate);

    expect(usage.isActive).toBe(false);
    expect(usage.endDate).toEqual(endDate);
  });

  it('accepts an end date equal to the start date', () => {
    const usage = startUsage();

    usage.finish(startDate);

    expect(usage.endDate).toEqual(startDate);
  });

  it('rejects an end date before the start date', () => {
    const usage = startUsage();

    expect(() => usage.finish(new Date('2026-10-19T08:00:00.000Z'))).toThrow(ValidationError);
    expect(usage.isActive).toBe(true);
  });

  it('cannot be finished twice', () => {
    const usage = startUsage();
    usage.finish(new Date('2026-10-20T18:00:00.000Z'));

    expect(() => usage.finish(new Date('2026-10-21T18:00:00.000Z'))).toThrow(CarUsageAlreadyFinishedError);
  });

  it('does not expose its dates to outside mutations', () => {
    const usage = startUsage();

    usage.startDate.setFullYear(2000);
    usage.toProps().startDate.setFullYear(2000);

    expect(usage.startDate).toEqual(startDate);
  });

  describe('overlaps', () => {
    it('an active usage overlaps any usage that starts after it', () => {
      const active = startUsage({ id: 'a', startDate: new Date('2026-10-20T08:00:00Z') });
      const later = startUsage({ id: 'b', startDate: new Date('2026-10-25T08:00:00Z') });

      expect(active.overlaps(later)).toBe(true);
      expect(later.overlaps(active)).toBe(true);
    });

    it('a new usage overlaps a finished one when it starts before the end', () => {
      const finished = finishedUsage('a', '2026-10-20T08:00:00Z', '2026-10-20T12:00:00Z');
      const backdated = startUsage({ id: 'b', startDate: new Date('2026-10-20T10:00:00Z') });

      expect(backdated.overlaps(finished)).toBe(true);
    });

    it('a new usage does not overlap a usage that finished before it starts', () => {
      const finished = finishedUsage('a', '2026-10-20T08:00:00Z', '2026-10-20T12:00:00Z');
      const next = startUsage({ id: 'b', startDate: new Date('2026-10-20T12:00:00Z') });

      expect(next.overlaps(finished)).toBe(false);
    });

    it('finished usages in separate periods do not overlap', () => {
      const first = finishedUsage('a', '2026-10-20T08:00:00Z', '2026-10-20T12:00:00Z');
      const second = finishedUsage('b', '2026-10-21T08:00:00Z', '2026-10-21T12:00:00Z');

      expect(first.overlaps(second)).toBe(false);
    });
  });
});
