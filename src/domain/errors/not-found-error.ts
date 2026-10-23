import { DomainError } from './domain-error';

export class NotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super(`${resource} with id "${id}" was not found`);
  }
}
