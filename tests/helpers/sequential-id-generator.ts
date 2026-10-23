import { IdGenerator } from '../../src/application/protocols/id-generator';

export class SequentialIdGenerator implements IdGenerator {
  private current = 0;

  generate(): string {
    this.current += 1;
    return `id-${this.current}`;
  }
}
