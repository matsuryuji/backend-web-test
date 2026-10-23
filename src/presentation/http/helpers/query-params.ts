import { Request } from 'express';
import { ValidationError } from '../../../domain/errors';

export function optionalQueryString(req: Request, name: string): string | undefined {
  const value = req.query[name];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new ValidationError('Invalid query parameters', [`${name} must be a single text value`]);
  }

  return value;
}
