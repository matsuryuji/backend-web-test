import { Clock } from '../../application/protocols/clock';

export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}
