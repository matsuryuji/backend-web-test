import { randomUUID } from 'node:crypto';
import { IdGenerator } from '../../application/protocols/id-generator';

export class CryptoIdGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
