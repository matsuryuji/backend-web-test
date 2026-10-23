import { DomainError } from './domain-error';

export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly details: string[] = [],
  ) {
    super(message);
  }
}
