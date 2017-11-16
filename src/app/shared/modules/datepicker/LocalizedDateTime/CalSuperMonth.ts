import {getDefaultLocale, getFirstDayOfWeekIdx} from './localeInfo';
import DateWrapper from './DateWrapper';
import {Day, Month, MultiWeekRange} from './timeRanges';

type DateTime = DateWrapper | Date | number;

// Class for a time range which
export default class CalSuperMonth extends MultiWeekRange {
  _focusMonth: Month;
  _numCalWeeks: number;
  _minNumCalWeeks: number;

  constructor(
      date: DateTime = null,
      locale: string = null,
      localFirstDayOfWeekJsIdx: number = null,
      minNumCalWeeks = 6) {
    locale = locale || getDefaultLocale();
    localFirstDayOfWeekJsIdx = getFirstDayOfWeekIdx(localFirstDayOfWeekJsIdx, locale);
    let dw: DateWrapper;
    if (date instanceof DateWrapper) {
      dw = date;
    } else {
      dw = new DateWrapper(date, localFirstDayOfWeekJsIdx);
    }
    localFirstDayOfWeekJsIdx = dw.localFirstDayOfWeekJsIdx;

    const focusMonth = new Month(dw, locale, localFirstDayOfWeekJsIdx);
    let firstWeekOfExtendedMonth = focusMonth.firstDay.week;
    let lastWeekOfExtendedMonth =  focusMonth.lastDay.week;

    const approxMillisecondsInWeek = 604800000; // 7*24*60*60*1000
    const timeDiff = (lastWeekOfExtendedMonth.endTime - firstWeekOfExtendedMonth.startTime);
    const approxWeeksInMinimalSuperMonth = Math.round(timeDiff / approxMillisecondsInWeek);

    const numCalWeeks = Math.max(minNumCalWeeks, approxWeeksInMinimalSuperMonth);


    const weeksToAdd = numCalWeeks - approxWeeksInMinimalSuperMonth;
    let weeksStartPadding = Math.floor(weeksToAdd / 2);
    let weeksEndPadding = weeksStartPadding;
    if ((weeksToAdd % 2) === 1) {
      const timeDiffA = (focusMonth.firstDay.startTime - firstWeekOfExtendedMonth.startTime);
      const timeDiffB = (lastWeekOfExtendedMonth.endTime - focusMonth.lastDay.endTime);
      if (timeDiffA < timeDiffB) {
        weeksStartPadding++;
      } else {
        weeksEndPadding++;
      }
    }
    while (weeksStartPadding > 0) {
      firstWeekOfExtendedMonth = firstWeekOfExtendedMonth.prevWeek;
      weeksStartPadding--;
    }
    while (weeksEndPadding > 0) {
      lastWeekOfExtendedMonth = lastWeekOfExtendedMonth.nextWeek;
      weeksEndPadding--;
    }


    super(firstWeekOfExtendedMonth, lastWeekOfExtendedMonth, locale, localFirstDayOfWeekJsIdx);
    this._focusMonth = focusMonth;
    this._numCalWeeks = numCalWeeks;
    this._minNumCalWeeks = minNumCalWeeks;
  }

  get focusMonth(): Month {
    return new Month(this._focusMonth.startTime, this._locale, this._localFirstDayOfWeekJsIdx);
  }


  get prevCalSuperMonth(): CalSuperMonth {
    return new CalSuperMonth(
      new Date(this.focusMonth.prevMonth.startTime),
      this._locale,
      this._localFirstDayOfWeekJsIdx,
      this._minNumCalWeeks);
  }

  get nextCalSuperMonth(): CalSuperMonth {
    return new CalSuperMonth(
      new Date(this.focusMonth.nextMonth.startTime),
      this._locale,
      this._localFirstDayOfWeekJsIdx,
      this._minNumCalWeeks);
  }



  get prevYearCalSuperMonth(): CalSuperMonth {
    const focusMonth = this.focusMonth;
    const prevFocusYear = focusMonth.year.prevYear;
    const currFocusMonthIdx = focusMonth.monthIdx;
    const prevYearFocusMonth = prevFocusYear.months[currFocusMonthIdx];
    return new CalSuperMonth(
      new Date(prevYearFocusMonth.startTime),
      this._locale,
      this._localFirstDayOfWeekJsIdx,
      this._minNumCalWeeks);
  }

  get nextYearCalSuperMonth(): CalSuperMonth {
    const focusMonth = this.focusMonth;
    const nextFocusYear = focusMonth.year.nextYear;
    const currFocusMonthIdx = focusMonth.monthIdx;
    const nextYearFocusMonth = nextFocusYear.months[currFocusMonthIdx];
    return new CalSuperMonth(
      new Date(nextYearFocusMonth.startTime),
      this._locale,
      this._localFirstDayOfWeekJsIdx,
      this._minNumCalWeeks);
  }
}
