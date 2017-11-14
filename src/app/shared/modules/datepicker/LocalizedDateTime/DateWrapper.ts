  // Note:
  // It is important to ensure that we properly account for edge cases
  //  where start of day isn't at 00:00:00 and end of day isn't at 23:59:59
  //  (when Date object is associated with a timezone with savings-time related
  //    jump around midnight of a particular day)
  // see: https://github.com/js-joda/js-joda/blob/bd07f21fbc6bf77c721f9c024fc9202e6f58045d/src/LocalDate.js#L1451
  // related: https://github.com/moment/moment/issues/3132
  // e.g.
  //  new Date(1508036399999) in Brazil should be 23:59:59.999 on 2017-10-14 in local time zone
  //   The next millisecond, DST should start, so the time should jump to 01:00:00.000
  //   So the start of day should be 1AM in the local time on 10-15 (1508036400000)

const MIN_VALID_JS_TIME = -8640000000000000;
const MAX_VALID_JS_TIME = 8640000000000000;
const NUM_DAYS_EACH_WEEK = 7;

const isValidTime = (time: number) => {
  return (time === Math.floor(time)) &&
    (time >= MIN_VALID_JS_TIME) &&
    (time <= MAX_VALID_JS_TIME);
};

export default class DateWrapper {
  _date: Date;
  _localFirstDayOfWeekJsIdx: number;

  constructor(date: Date | number = null, localFirstDayOfWeekJsIdx = 0) {
    let time = NaN;
    if (date === null) {
      date = new Date();
      time = date.getTime();
    } else {
      if (date instanceof Date) {
        time = date.getTime();
      } else if (typeof date === 'number') {
        time = date;
      } else {
        throw new Error('Invalid date argument');
      }

      if (isValidTime(time)) {
        date = new Date(time);
      } else {
        throw new RangeError('Numeric date argument has a value outside of the valid range');
      }
    }

    this._date = date;
    this._localFirstDayOfWeekJsIdx = localFirstDayOfWeekJsIdx;
  }

  get time() {
    return this._date.getTime();
  }

  get date() {
    return new Date(this.time);
  }

  get isValid() {
      return isValidTime(this.time);
  }

  get localFirstDayOfWeekJsIdx() {
    return this._localFirstDayOfWeekJsIdx;
  }



  // Methods that modify internal state

  _clearMilliseconds() {
    this._date.setMilliseconds(0);
    return this;
  }

  _clearSeconds() {
    this._clearMilliseconds();
    this._date.setSeconds(0);
    return this;
  }

  _clearMinutes() {
    this._clearSeconds();
    this._date.setMinutes(0);
    return this;
  }

  _clearHours() {
    this._clearMinutes();
    this._date.setHours(0);
    return this;
  }

  _clearDays() {
    this._clearHours();
    this._date.setDate(1);
    return this;
  }

  _clearDayOfWeek() {
    const localFirstDayOfWeekJsIdx = this._localFirstDayOfWeekJsIdx;
    const localDayOfWeekJsIdx = this.startOfDay.date.getDay(); // 0 = always day corresponding to Sunday in English locale
    this._clearHours();
    const currDate = this._date.getDate();
    const daysAgo = (NUM_DAYS_EACH_WEEK + (localDayOfWeekJsIdx - localFirstDayOfWeekJsIdx)) % NUM_DAYS_EACH_WEEK;
    this._date.setDate(currDate - daysAgo);
    return this;
  }

  _clearMonths() {
    this._clearDays();
    this._date.setMonth(0);
    return this;
  }



  _addMilliseconds(numMilliseconds: number) {
    this._date.setTime(this._date.getTime() + numMilliseconds);
    return this;
  }

  _addSeconds(numSeconds: number) {
    this._date.setSeconds(this._date.getSeconds() + numSeconds);
    return this;
  }

  _addMinutes(numMinutes: number) {
    this._date.setMinutes(this._date.getMinutes() + numMinutes);
    return this;
  }

  _addHours(numHours: number) {
    this._date.setHours(this._date.getHours() + numHours);
    return this;
  }

  _addDays(numDays: number) {
    this._date.setDate(this._date.getDate() + numDays);
    return this;
  }

  _addWeeks(numWeeks: number) {
    return this._addDays(NUM_DAYS_EACH_WEEK * numWeeks);
  }

  _addMonths(numMonths: number) {
    this._date.setMonth(this._date.getMonth() + numMonths);
    return this;
  }

  _addYears(numYears: number) {
    this._date.setFullYear(this._date.getFullYear() + numYears);
    return this;
  }


  // Methods that return a new DateWrapper object

  get clone() {
    return new DateWrapper(this._date, this._localFirstDayOfWeekJsIdx);
  }



  get startOfSecond() {
      return this.clone._clearMilliseconds();
  }

  get startOfMinute() {
      return this.clone._clearSeconds();
  }

  get startOfHour() {
    return this.clone._clearMinutes();
  }

  get startOfDay() {
    return this.clone._clearHours();
  }

  get startOfWeek() {
    return this.clone._clearDayOfWeek();
  }

  get startOfMonth() {
    return this.clone._clearDays();
  }

  get startOfYear() {
    return this.clone._clearMonths();
  }



  get startOfPrevSecond() {
    return this.startOfSecond._addSeconds(-1);
  }

  get startOfPrevMinute() {
    return this.startOfMinute._addMinutes(-1);
  }

  get startOfPrevHour() {
    return this.startOfHour._addHours(-1);
  }

  get startOfPrevDay() {
    return this.startOfDay._addDays(-1);
  }

  get startOfPrevWeek() {
    return this.startOfWeek._addWeeks(-1);
  }

  get startOfPrevMonth() {
    return this.startOfMonth._addMonths(-1);
  }

  get startOfPrevYear() {
    return this.startOfYear._addYears(-1);
  }



  get startOfNextSecond() {
    return this.startOfSecond._addSeconds(1);
  }

  get startOfNextMinute() {
    return this.startOfMinute._addMinutes(1);
  }

  get startOfNextHour() {
    return this.startOfHour._addHours(1);
  }

  get startOfNextDay() {
    return this.startOfDay._addDays(1);
  }

  get startOfNextWeek() {
    return this.startOfWeek._addWeeks(1);
  }

  get startOfNextMonth() {
    return this.startOfMonth._addMonths(1);
  }

  get startOfNextYear() {
    return this.startOfYear._addYears(1);
  }



  get endOfSecond() {
    return this.startOfNextSecond._addMilliseconds(-1);
  }

  get endOfMinute() {
    return this.startOfNextMinute._addMilliseconds(-1);
  }

  get endOfHour() {
    return this.startOfNextHour._addMilliseconds(-1);
  }

  get endOfDay() {
    return this.startOfNextDay._addMilliseconds(-1);
  }

  get endOfWeek() {
    return this.startOfNextWeek._addMilliseconds(-1);
  }

  get endOfMonth() {
    return this.startOfNextMonth._addMilliseconds(-1);
  }

  get endOfYear() {
    return this.startOfNextYear._addMilliseconds(-1);
  }



  // Methods that return a number

  get fullYear() {
    return this._date.getFullYear();
  }

  get monthIdx() {
    return this._date.getMonth();
  }

  get monthDate() {
    return this._date.getDate();
  }
}
