import { ValidationError } from '../errors';
import { isNonEmptyText } from '../validation/text';

const PLATE_PATTERN = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

export interface CarProps {
  id: string;
  plate: string;
  color: string;
  brand: string;
}

export type CarData = Omit<CarProps, 'id'>;

export function normalizePlate(plate: string): string {
  return plate.trim().toUpperCase().replace('-', '');
}

export class Car {
  private constructor(private props: CarProps) {}

  static create(id: string, data: CarData): Car {
    return new Car({ id, ...Car.validate(data) });
  }

  static restore(props: CarProps): Car {
    return new Car({ ...props });
  }

  get id(): string {
    return this.props.id;
  }

  get plate(): string {
    return this.props.plate;
  }

  get color(): string {
    return this.props.color;
  }

  get brand(): string {
    return this.props.brand;
  }

  update(data: CarData): void {
    this.props = { id: this.props.id, ...Car.validate(data) };
  }

  toProps(): CarProps {
    return { ...this.props };
  }

  private static validate(data: CarData): CarData {
    const errors: string[] = [];

    if (!isNonEmptyText(data.plate)) {
      errors.push('plate is required');
    } else if (!PLATE_PATTERN.test(normalizePlate(data.plate))) {
      errors.push('plate must follow the format ABC1234, ABC-1234 or ABC1D23');
    }

    if (!isNonEmptyText(data.color)) {
      errors.push('color is required');
    }

    if (!isNonEmptyText(data.brand)) {
      errors.push('brand is required');
    }

    if (errors.length > 0) {
      throw new ValidationError('Invalid car data', errors);
    }

    return {
      plate: normalizePlate(data.plate),
      color: data.color.trim(),
      brand: data.brand.trim(),
    };
  }
}
