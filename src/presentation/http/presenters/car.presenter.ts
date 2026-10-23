import { Car, CarProps } from '../../../domain/entities/car';

export type CarResponse = CarProps;

export function toCarResponse(car: Car): CarResponse {
  return car.toProps();
}
