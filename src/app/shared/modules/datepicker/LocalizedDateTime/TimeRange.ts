import {getDefaultLocale, getFirstDayOfWeekIdx, hasGregDateTimeFormatSupport} from './localeInfo';
import DateWrapper from './DateWrapper';

export default class TimeRange {
  _locale: string;
  _localFirstDayOfWeekJsIdx: number;
  _dwStart: DateWrapper;
  _dwEnd: DateWrapper;

  // note: both dateStart & dateEnd times are inclusive in the range and the resolution is 1 millisecond
  constructor(
      dateStart: DateWrapper | Date | number = null,
      dateEnd: DateWrapper | Date | number = null,
      locale: string = null,
      localFirstDayOfWeekJsIdx: number = null) {
    locale = locale || getDefaultLocale();
    if (!hasGregDateTimeFormatSupport(locale)) {
      throw new Error('Unsupported locale');
    }

    localFirstDayOfWeekJsIdx = getFirstDayOfWeekIdx(localFirstDayOfWeekJsIdx, locale);


    if (!(dateStart instanceof DateWrapper)) {
      dateStart = new DateWrapper(dateStart, localFirstDayOfWeekJsIdx);
    }
    if (!(dateEnd instanceof DateWrapper)) {
      dateEnd = new DateWrapper(dateEnd, localFirstDayOfWeekJsIdx);
    }

    if (!(dateStart.time < dateEnd.time)) {
      throw new Error('Invalid start or end date');
    }

    this._locale = locale;
    this._localFirstDayOfWeekJsIdx = localFirstDayOfWeekJsIdx;
    this._dwStart = dateStart;
    this._dwEnd = dateEnd;
  }

  get locale(): string {
    return this._locale;
  }

  get localFirstDayOfWeekJsIdx(): number {
    return this._localFirstDayOfWeekJsIdx;
  }

  get startTime(): number {
    return this._dwStart.time;
  }

  get endTime(): number {
    return this._dwEnd.time;
  }

  get datePair() {
    return [new Date(this.startTime), new Date(this.endTime)];
  }

  isTemporallyEqualTo(o: TimeRange | Date): boolean {
    if (o instanceof TimeRange) {
      return (o.startTime === this.startTime) && (o.endTime === this.endTime);
    } else if (o instanceof Date) {
      return (this.startTime === o.getTime()) && (this.endTime === o.getTime());
    }
    return false;
  }

  contains(o: TimeRange | Date): boolean {
    if (o instanceof TimeRange) {
      return (this.startTime <= o.startTime) && (this.endTime >= o.endTime);
    } else if (o instanceof Date) {
      return (this.startTime <= o.getTime()) && (this.endTime >= o.getTime());
    }
    return false;
  }

  hasOverlapWith(o: TimeRange | Date): boolean {
    if (o instanceof TimeRange) {
      return (this.contains(new Date(o.startTime)) ||
        this.contains(new Date(o.endTime)) ||
        o.contains(new Date (this.startTime)) ||
        o.contains(new Date(this.endTime)));
    } else if (o instanceof Date) {
      return this.contains(o);
    }
    return false;
  }

  isAdjacentTo(o: TimeRange | Date): boolean {
    if (o instanceof TimeRange) {
      return (o.startTime === this.endTime + 1) || (o.endTime + 1 === this.startTime);
    } else if (o instanceof Date) {
      return (o.getTime() === this.endTime + 1) || (o.getTime() + 1 === this.startTime);
    }
    return false;
  }

  happensBefore(o: TimeRange | Date): boolean {
    if (o instanceof TimeRange) {
      return (this.endTime < o.startTime);
    } else if (o instanceof Date) {
      return (this.endTime < o.getTime());
    }
    return false;
  }

  happensAfter(o: TimeRange | Date): boolean {
    if (o instanceof TimeRange) {
      return (o.endTime < this.startTime);
    } else if (o instanceof Date) {
      return (o.getTime() < this.startTime);
    }
    return false;
  }
}
