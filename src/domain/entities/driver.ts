import { ValidationError } from '../errors';
import { isNonEmptyText } from '../validation/text';

export interface DriverProps {
  id: string;
  name: string;
}

export type DriverData = Omit<DriverProps, 'id'>;

export class Driver {
  private constructor(private props: DriverProps) {}

  static create(id: string, data: DriverData): Driver {
    return new Driver({ id, ...Driver.validate(data) });
  }

  static restore(props: DriverProps): Driver {
    return new Driver({ ...props });
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  update(data: DriverData): void {
    this.props = { id: this.props.id, ...Driver.validate(data) };
  }

  toProps(): DriverProps {
    return { ...this.props };
  }

  private static validate(data: DriverData): DriverData {
    if (!isNonEmptyText(data.name)) {
      throw new ValidationError('Invalid driver data', ['name is required']);
    }

    return { name: data.name.trim().replace(/\s+/g, ' ') };
  }
}
