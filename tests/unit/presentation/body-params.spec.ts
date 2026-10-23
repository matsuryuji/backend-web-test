import { ValidationError } from '../../../src/domain/errors';
import { optionalDate } from '../../../src/presentation/http/helpers/body-params';

describe('optionalDate', () => {
  it.each([undefined, null])('returns undefined for %p', (value) => {
    expect(optionalDate(value, 'startDate')).toBeUndefined();
  });

  it('parses ISO 8601 strings', () => {
    expect(optionalDate('2026-10-20T08:00:00.000Z', 'startDate')).toEqual(new Date('2026-10-20T08:00:00.000Z'));
  });

  it.each(['not a date', 1729411200000, {}])('rejects %p', (value) => {
    expect(() => optionalDate(value, 'startDate')).toThrow(ValidationError);
  });
});
