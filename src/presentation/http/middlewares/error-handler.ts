import { NextFunction, Request, Response } from 'express';
import { ConflictError, NotFoundError, ValidationError } from '../../../domain/errors';

function isMalformedJson(error: Error): boolean {
  return error instanceof SyntaxError && 'body' in error;
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ValidationError) {
    res.status(400).json({ error: error.message, details: error.details });
    return;
  }

  if (isMalformedJson(error)) {
    res.status(400).json({ error: 'Malformed JSON body' });
    return;
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({ error: error.message });
    return;
  }

  if (error instanceof ConflictError) {
    res.status(409).json({ error: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}
