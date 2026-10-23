import { CarUsageAlreadyFinishedError, ValidationError } from '../errors';
import { isValidDate } from '../validation/date';
import { isNonEmptyText } from '../validation/text';

export interface CarUsageProps {
  id: string;
  carId: string;
  driverId: string;
  reason: string;
  startDate: Date;
  endDate: Date | null;
}

export type StartCarUsageData = Omit<CarUsageProps, 'id' | 'endDate'>;

export class CarUsage {
  private constructor(private props: CarUsageProps) {}

  static start(id: string, data: StartCarUsageData): CarUsage {
    return new CarUsage({ id, ...CarUsage.validate(data), endDate: null });
  }

  static restore(props: CarUsageProps): CarUsage {
    return new CarUsage(copyProps(props));
  }

  get id(): string {
    return this.props.id;
  }

  get carId(): string {
    return this.props.carId;
  }

  get driverId(): string {
    return this.props.driverId;
  }

  get reason(): string {
    return this.props.reason;
  }

  get startDate(): Date {
    return new Date(this.props.startDate);
  }

  get endDate(): Date | null {
    return this.props.endDate ? new Date(this.props.endDate) : null;
  }

  get isActive(): boolean {
    return this.props.endDate === null;
  }

  finish(endDate: Date): void {
    if (!this.isActive) {
      throw new CarUsageAlreadyFinishedError(this.id);
    }

    if (!isValidDate(endDate) || endDate < this.props.startDate) {
      throw new ValidationError('Invalid car usage data', ['endDate must not be before startDate']);
    }

    this.props = { ...this.props, endDate: new Date(endDate) };
  }

  overlaps(other: CarUsage): boolean {
    const thisEnd = this.props.endDate?.getTime() ?? Infinity;
    const otherEnd = other.props.endDate?.getTime() ?? Infinity;

    return this.props.startDate.getTime() < otherEnd && other.props.startDate.getTime() < thisEnd;
  }

  toProps(): CarUsageProps {
    return copyProps(this.props);
  }

  private static validate(data: StartCarUsageData): StartCarUsageData {
    const errors: string[] = [];

    if (!isNonEmptyText(data.carId)) {
      errors.push('carId is required');
    }

    if (!isNonEmptyText(data.driverId)) {
      errors.push('driverId is required');
    }

    if (!isNonEmptyText(data.reason)) {
      errors.push('reason is required');
    }

    if (!isValidDate(data.startDate)) {
      errors.push('startDate must be a valid date');
    }

    if (errors.length > 0) {
      throw new ValidationError('Invalid car usage data', errors);
    }

    return {
      carId: data.carId.trim(),
      driverId: data.driverId.trim(),
      reason: data.reason.trim(),
      startDate: new Date(data.startDate),
    };
  }
}

function copyProps(props: CarUsageProps): CarUsageProps {
  return {
    ...props,
    startDate: new Date(props.startDate),
    endDate: props.endDate ? new Date(props.endDate) : null,
  };
}
