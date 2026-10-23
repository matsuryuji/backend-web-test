import { Driver, DriverProps } from '../../../domain/entities/driver';

export type DriverResponse = DriverProps;

export function toDriverResponse(driver: Driver): DriverResponse {
  return driver.toProps();
}
