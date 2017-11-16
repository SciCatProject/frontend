import {getDefaultLocale, getFirstDayOfWeekIdx} from './localeInfo';
import DateWrapper from './DateWrapper';
import TimeRange from './TimeRange';

type DateTime = DateWrapper | Date | number;

class Day extends TimeRange {
  constructor(
      date: DateTime = null,
      locale: string = null,
      localFirstDayOfWeekJsIdx: number = null) {
    locale = locale || getDefaultLocale();
    localFirstDayOfWeekJsIdx = getFirstDayOfWeekIdx(localFirstDayOfWeekJsIdx, locale);
    let dw: DateWrapper;
    if (date instanceof DateWrapper) {
      dw = date;
    } else {
      dw = new DateWrapper(date, localFirstDayOfWeekJsIdx);
    }
    localFirstDayOfWeekJsIdx = dw.localFirstDayOfWeekJsIdx;
    super(dw.startOfDay, dw.endOfDay, locale, localFirstDayOfWeekJsIdx);
  }

  get monthDate(): number {
    // work around potential edge cases
    const startTime = this._dwStart.date.getTime();
    const endTime = this._dwEnd.date.getTime();
    const middleOfDay = new Date(Math.round((startTime + endTime) / 2));
    return middleOfDay.getDate();
  }

  get dayOfWeekIdx(): number {
    const numDaysEachWeek = 7;
    return (this._dwStart.date.getDay() - this._localFirstDayOfWeekJsIdx) % numDaysEachWeek;
  }


  getWeekDayName(dayStyle = 'long'): string  {
    // work around edge cases
    const startTime = this._dwStart.date.getTime();
    const endTime = this._dwEnd.date.getTime();
    const middleOfDay = new Date(Math.round((startTime + endTime) / 2));
    return middleOfDay.toLocaleString(this._locale, {weekday: dayStyle});
  }

  get weekDayName(): string {
    return this.getWeekDayName('long');
  }

  get shortWeekDayName(): string  {
    return this.getWeekDayName('short');
  }

  get narrowWeekDayName(): string  {
    return this.getWeekDayName('narrow');
  }

  get isoSubstr(): string {
    const d = new Date('0000-01-01T00:00:00.000Z');
    d.setUTCFullYear(this._dwStart.fullYear);
    const dIsoStr = d.toISOString();
    const yyyy = dIsoStr.substring(0, dIsoStr.substring(1).indexOf('-') + 1);
    const mm = ('0' + (this._dwStart.monthIdx + 1).toString()).substr(-2);
    const dd = ('0' + (this._dwStart.monthDate.toString())).substr(-2);
    return yyyy + '-' + mm + '-' + dd;
  }

  _createDay(date: DateTime = null): Day {
    return new Day(date, this.locale, this.localFirstDayOfWeekJsIdx);
  }

  get prevDay(): Day {
    return this._createDay(this._dwStart.startOfPrevDay);
  }

  get nextDay(): Day {
    return this._createDay(this._dwStart.startOfNextDay);
  }

  _createWeek(date: DateTime = null): Week {
    return new Week(date, this.locale, this.localFirstDayOfWeekJsIdx);
  }

  get week(): Week {
    return this._createWeek(this._dwStart);
  }

  _createMonth(date: DateTime = null): Month {
    return new Month(date, this.locale, this.localFirstDayOfWeekJsIdx);
  }

  get month(): Month {
    return this._createMonth(this._dwStart);
  }

  _createYear(date: DateTime = null): Year {
    return new Year(date, this.locale, this.localFirstDayOfWeekJsIdx);
  }

  get year(): Year {
    return this._createYear(this.startTime);
  }
}

class MultiDayRange extends TimeRange {
  constructor(
      firstDay: Day | DateTime = null,
      lastDay: Day | DateTime  = null,
      locale: string = null,
      localFirstDayOfWeekJsIdx: number = null) {
    locale = locale || getDefaultLocale();
    localFirstDayOfWeekJsIdx = getFirstDayOfWeekIdx(localFirstDayOfWeekJsIdx, locale);
    if (!(firstDay instanceof Day)) {
      firstDay = new Day(firstDay, locale, localFirstDayOfWeekJsIdx);
    }
    if (!(lastDay instanceof Day)) {
      lastDay = new Day(lastDay, locale, localFirstDayOfWeekJsIdx);
    }
    super(firstDay.startTime, lastDay.endTime, locale, localFirstDayOfWeekJsIdx);
  }


  _createDay(date: DateTime = null): Day {
    return new Day(date, this.locale, this.localFirstDayOfWeekJsIdx);
  }

  get firstDay(): Day {
    return this._createDay(this.startTime);
  }

  get lastDay(): Day {
    return this._createDay(this.endTime);
  }

  get isSingleDay(): boolean {
    return this.lastDay.isTemporallyEqualTo(this.firstDay);
  }

  get days(): Day[]{
    const daysArr = [];
    let day = this.firstDay;
    const lastDay = this.lastDay;
    while (!(day.happensAfter(lastDay))) {
      daysArr.push(day);
      day = this._createDay(day.endTime + 1);
    }
    return daysArr;
  }
}

class Week extends MultiDayRange {
  constructor (
      date: DateWrapper | Date | number = null,
      locale: string = null,
      localFirstDayOfWeekJsIdx: number = null) {
    locale = locale || getDefaultLocale();
    localFirstDayOfWeekJsIdx = getFirstDayOfWeekIdx(localFirstDayOfWeekJsIdx, locale);
    let dw: DateWrapper;
    if (date instanceof DateWrapper) {
      dw = date;
    } else {
      dw = new DateWrapper(date, localFirstDayOfWeekJsIdx);
    }
    const firstDayOfWeek = new Day(dw.startOfWeek, locale, localFirstDayOfWeekJsIdx);
    const lastDayOfWeek = new Day(dw.endOfWeek, locale, localFirstDayOfWeekJsIdx);
    super(firstDayOfWeek, lastDayOfWeek, locale, localFirstDayOfWeekJsIdx);
  }

  _createWeek(date: DateWrapper | Date | number = null): Week {
    return new Week(date, this.locale, this.localFirstDayOfWeekJsIdx);
  }

  get prevWeek(): Week {
    return this._createWeek(this._dwStart.startOfPrevWeek);
  }

  get nextWeek(): Week {
    return this._createWeek(this._dwStart.startOfNextWeek);
  }
}

class MultiWeekRange extends MultiDayRange {
  constructor(
      firstWeek: Week | DateTime  = null,
      lastWeek: Week | DateTime = null,
      locale: string = null,
      localFirstDayOfWeekJsIdx: number = null) {
    locale = locale || getDefaultLocale();
    localFirstDayOfWeekJsIdx = getFirstDayOfWeekIdx(localFirstDayOfWeekJsIdx, locale);
    if (!(firstWeek instanceof Week)) {
      firstWeek = new Week(firstWeek, locale, localFirstDayOfWeekJsIdx);
    }
    if (!(lastWeek instanceof Week)) {
      lastWeek = new Week(lastWeek, locale, localFirstDayOfWeekJsIdx);
    }
    super(firstWeek.startTime, lastWeek.endTime, locale, localFirstDayOfWeekJsIdx);
  }

  _createWeek(date: DateTime = null): Week {
    return new Week(date, this.locale, this.localFirstDayOfWeekJsIdx);
  }

  get firstWeek(): Week {
    return this._createWeek(this.startTime);
  }

  get lastWeek(): Week {
    return this._createWeek(this.endTime);
  }

  get weeks(): Week[] {
    const weeksArr = [];
    let week = this.firstWeek;
    const lastWeek = this.lastWeek;
    while (!(week.happensAfter(lastWeek))) {
      weeksArr.push(week);
      week = this._createWeek(week.endTime + 1);
    }
    return weeksArr;
  }
}

class Month extends MultiDayRange {
  constructor(
      date: DateTime = null,
      locale: string = null,
      localFirstDayOfWeekJsIdx: number = null) {
    locale = locale || getDefaultLocale();
    localFirstDayOfWeekJsIdx = getFirstDayOfWeekIdx(localFirstDayOfWeekJsIdx, locale);
    let dw: DateWrapper;
    if (date instanceof DateWrapper) {
      dw = date;
    } else {
      dw = new DateWrapper(date, localFirstDayOfWeekJsIdx);
    }
    const firstDayOfMonth = new Day(dw.startOfMonth, locale, localFirstDayOfWeekJsIdx);
    const lastDayOfMonth = new Day(dw.endOfMonth, locale, localFirstDayOfWeekJsIdx);
    super(firstDayOfMonth, lastDayOfMonth, locale, localFirstDayOfWeekJsIdx);
  }

  getMonthName(monthStyle = 'long'): string {
    // work around known edge cases
    const startTime = this._dwStart.date.getTime();
    const endTime = this._dwEnd.date.getTime();
    const middleOfMonth = new Date(Math.round((startTime + endTime) / 2));
    return middleOfMonth.toLocaleString(this._locale, {month: monthStyle});
  }

  get monthName(): string {
    return this.getMonthName('long');
  }

  get shortMonthName(): string {
    return this.getMonthName('short');
  }

  get narrowMonthName(): string {
    return this.getMonthName('narrow');
  }


  get monthIdx(): number {
    return this._dwStart.monthIdx;
  }

  get numDaysInMonth(): number {
    return this._dwEnd.monthDate;
  }

  get isoSubstr(): string {
    const d = new Date('0000-01-01T00:00:00.000Z');
    d.setUTCFullYear(this._dwStart.fullYear);
    const dIsoStr = d.toISOString();
    const yyyy = dIsoStr.substring(0, dIsoStr.substring(1).indexOf('-') + 1);
    const mm = ('0' + (this._dwStart.monthIdx + 1).toString()).substr(-2);
    return yyyy + '-' + mm;
  }

  _createMonth(date: DateTime = null): Month {
    return new Month(date, this.locale, this.localFirstDayOfWeekJsIdx);
  }

  get prevMonth(): Month {
    return this._createMonth(this._dwStart.startOfPrevMonth);
  }

  get nextMonth(): Month {
    return this._createMonth(this._dwStart.startOfNextMonth);
  }

  _createYear(date: DateTime = null): Year {
    return new Year(date, this.locale, this.localFirstDayOfWeekJsIdx);
  }

  get year(): Year {
    return this._createYear(this.startTime);
  }
}

class MultiMonthRange extends MultiDayRange {
  constructor(
      firstMonth: Month | DateTime = null,
      lastMonth: Month | DateTime = null,
      locale: string = null,
      localFirstDayOfWeekJsIdx: number = null) {
    locale = locale || getDefaultLocale();
    localFirstDayOfWeekJsIdx = getFirstDayOfWeekIdx(localFirstDayOfWeekJsIdx, locale);
    if (!(firstMonth instanceof Month)) {
      firstMonth = new Month(firstMonth, locale, localFirstDayOfWeekJsIdx);
    }
    if (!(lastMonth instanceof Month)) {
      lastMonth = new Month(lastMonth, locale, localFirstDayOfWeekJsIdx);
    }
    super(firstMonth.startTime, lastMonth.endTime, locale, localFirstDayOfWeekJsIdx);
  }

  _createMonth(date: DateTime = null): Month {
    return new Month(date, this.locale, this.localFirstDayOfWeekJsIdx);
  }

  get firstMonth(): Month {
    return this._createMonth(this.startTime);
  }

  get lastMonth(): Month {
    return this._createMonth(this.endTime);
  }

  get months(): Month[] {
    const monthsArr = [];
    let month = this.firstMonth;
    const lastMonth = this.lastMonth;
    while (!(month.happensAfter(lastMonth))) {
      monthsArr.push(month);
      month = this._createMonth(month.endTime + 1);
    }
    return monthsArr;
  }
}

class Year extends MultiMonthRange {
  constructor(
      date: DateWrapper | Date | number = null,
      locale: string = null,
      localFirstDayOfWeekJsIdx: number = null) {
    locale = locale || getDefaultLocale();
    localFirstDayOfWeekJsIdx = getFirstDayOfWeekIdx(localFirstDayOfWeekJsIdx, locale);
    let dw: DateWrapper;
    if (date instanceof DateWrapper) {
      dw = date;
    } else {
      dw = new DateWrapper(date, localFirstDayOfWeekJsIdx);
    }
    const firstMonthOfYear = new Month(dw.startOfYear, locale, localFirstDayOfWeekJsIdx);
    const lastMonthOfYear = new Month(dw.endOfYear, locale, localFirstDayOfWeekJsIdx);
    super(firstMonthOfYear, lastMonthOfYear, locale, localFirstDayOfWeekJsIdx);
  }


  get fullYear(): number {
    return this._dwStart.fullYear;
  }

  get isoSubstr(): string {
    const d = new Date('0000-01-01T00:00:00.000Z');
    d.setUTCFullYear(this._dwStart.fullYear);
    const dIsoStr = d.toISOString();
    const yyyy = dIsoStr.substring(0, dIsoStr.substring(1).indexOf('-') + 1);
    return yyyy;
  }

  _createYear(date: DateTime = null): Year {
    return new Year(date, this.locale, this.localFirstDayOfWeekJsIdx);
  }

  get prevYear(): Year {
    return this._createYear(this._dwStart.startOfPrevYear);
  }

  get nextYear(): Year {
    return this._createYear(this._dwStart.startOfNextYear);
  }
}

class MultiYearRange extends MultiMonthRange {
  constructor(
      firstYear: Year | DateTime = null,
      lastYear: Year | DateTime = null,
      locale: string = null,
      localFirstDayOfWeekJsIdx: number = null) {
    locale = locale || getDefaultLocale();
    localFirstDayOfWeekJsIdx = getFirstDayOfWeekIdx(localFirstDayOfWeekJsIdx, locale);
    if (!(firstYear instanceof Year)) {
      firstYear = new Year(firstYear, locale, localFirstDayOfWeekJsIdx);
    }
    if (!(lastYear instanceof Year)) {
      lastYear = new Year(lastYear, locale, localFirstDayOfWeekJsIdx);
    }
    super(firstYear.startTime, lastYear.endTime, locale, localFirstDayOfWeekJsIdx);
  }

  _createYear(date: DateTime = null): Year {
    return new Year(date, this.locale, this.localFirstDayOfWeekJsIdx);
  }

  get firstYear(): Year {
    return this._createYear(this.startTime);
  }

  get lastYear(): Year {
    return this._createYear(this.endTime);
  }

  get years(): Year[] {
    const yearsArr = [];
    let year = this.firstYear;
    const lastYear = this.lastYear;
    while (!(year.happensAfter(lastYear))) {
      yearsArr.push(year);
      year = this._createYear(year.endTime + 1);
    }
    return yearsArr;
  }
}

export {
  Day,
  MultiDayRange,
  Week,
  MultiWeekRange,
  Month,
  MultiMonthRange,
  Year,
  MultiYearRange
};
