import { ConflictError } from './conflict-error';

export class CarAlreadyInUseError extends ConflictError {
  constructor(carId: string) {
    super(`Car "${carId}" is already in use during this period`);
  }
}

export class DriverAlreadyInUseError extends ConflictError {
  constructor(driverId: string) {
    super(`Driver "${driverId}" is already using a car during this period`);
  }
}

export class CarUsageAlreadyFinishedError extends ConflictError {
  constructor(carUsageId: string) {
    super(`Car usage "${carUsageId}" is already finished`);
  }
}
