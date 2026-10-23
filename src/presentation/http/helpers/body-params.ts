import { ValidationError } from '../../../domain/errors';

export function optionalDate(value: unknown, field: string): Date | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const date = typeof value === 'string' ? new Date(value) : new Date(NaN);

  if (Number.isNaN(date.getTime())) {
    throw new ValidationError('Invalid request body', [`${field} must be a valid ISO 8601 date`]);
  }

  return date;
}
