
import TimeRange from './LocalizedDateTime/TimeRange';
import {Day, MultiDayRange, Month, Year, MultiYearRange} from './LocalizedDateTime/timeRanges';
import CalSuperMonth from './LocalizedDateTime/CalSuperMonth';
import {getDefaultLocale, getDefaultFirstDayOfWeekIdx} from './LocalizedDateTime/localeInfo';

const defaultLocale = getDefaultLocale();
const defaultFirstWeekdayIdx = getDefaultFirstDayOfWeekIdx(defaultLocale);

export enum CalModes {
  dotm = 'dotm', // show days of the month
  moty = 'moty', // show months of the year
}
export enum SelectionModes {
  day = 'day', // allows selection of a single day
  range = 'range', // allows selection of a single range of days
}

const defaultCalMode = CalModes.dotm;
const timeNow = (new Date()).getTime();
const today = new Day(timeNow, defaultLocale, defaultFirstWeekdayIdx);
const thisMonth = today.month;
const fullYearToday = today.year.fullYear;
const defaultMinYear = fullYearToday - 125;
const defaultMaxYear = fullYearToday + 125;

const defaultSelectionMode = SelectionModes.range;
const defaultSelectedRanges = [];
const defaultActiveSelectedRangeIdx = 0;

export interface TimerRangeSelectorState {
  selectionMode: SelectionModes;
  activeSelectedRangeIdx: number;
  selectedRanges: TimeRange[]; // array to potentially support multi-range selections in the future
}
export const initialTimerRangeSelectorState: TimerRangeSelectorState = Object.freeze({
  selectionMode: defaultSelectionMode,
  selectedRanges: defaultSelectedRanges,
  activeSelectedRangeIdx: defaultActiveSelectedRangeIdx, // for potential future use (when multiple ranges may be selected at the same time)
});

// NOTE It IS ok to make up a state of other sub states

export interface DatepickerState {
  minYear: number;
  maxYear: number;
  locale: string;
  firstWeekdayIdx: number;
  showCal: boolean;
  calMode: CalModes;
  focusMonth: Month;
  today: Day;
  selections: TimerRangeSelectorState;
}

export const initialDatepickerState: DatepickerState = Object.freeze({
  minYear: defaultMinYear,
  maxYear: defaultMaxYear,
  locale: defaultLocale,
  firstWeekdayIdx: defaultFirstWeekdayIdx,
  showCal: false,
  calMode: defaultCalMode,
  focusMonth: thisMonth,
  today: today,
  selections: initialTimerRangeSelectorState
});


export const getSelectionMode = (state: DatepickerState) => {
  return state.selections.selectionMode;
};
export const getSelectedRanges = (state: DatepickerState) => {
  return state.selections.selectedRanges;
};

export const getDisplayTextForMonth = (m: Month) => {
  return m.monthName;
};

export const getDisplayTextForYear = (y: Year) => {
  const fullYear = y.fullYear;
  let text = '';
  if (fullYear < 1) {
    // JavaScript Date.prorotype.toLocaleDateString is extremely buggy before Year 1
    // (default to toStringing the number ignoring the locale)
    text = fullYear.toString();
  } else {
    text = (new Date(y.startTime)).toLocaleDateString(y.locale, {year: 'numeric'});
  }
  return text;
};

export const getMinYear = (state: DatepickerState) => {
  return state.minYear;
};
export const getMaxYear = (state: DatepickerState) => {
  return state.maxYear;
};
export const getLocale = (state: DatepickerState) => {
  return state.locale;
};
export const getFirstWeekdayIdx = (state: DatepickerState) => {
  return state.firstWeekdayIdx;
};
export const getShowCal = (state: DatepickerState) => {
  return state.showCal;
};
export const getCalMode = (state: DatepickerState) => {
  return state.calMode;
};
export const getFocusMonth = (state: DatepickerState) => {
  return state.focusMonth;
};
export const getToday = (state: DatepickerState) => {
  return state.today;
};


export const getFocusYear = (state: DatepickerState) => {
  return getFocusMonth(state).year;
};

export const getThisMonth = (state: DatepickerState) => {
  return getToday(state).month;
};

export const getThisYear = (state: DatepickerState) => {
  return getToday(state).year;
};


export const getCalSuperMonth = (state: DatepickerState) => {
  return new CalSuperMonth(getFocusMonth(state).startTime, getLocale(state), getFirstWeekdayIdx(state));
};

export const getCalYearMonths = (state: DatepickerState) => {
  return getFocusYear(state).months;
};

export const getYearDisplayText = (state: DatepickerState) => {
  return getDisplayTextForYear(getFocusYear(state));
};

export const getMonthDisplayText = (state: DatepickerState) => {
  return getDisplayTextForMonth(getFocusMonth(state));
};

export const getSliderYear = (state: DatepickerState) => {
  return getFocusYear(state).fullYear;
};

export const getWeekdayNames = (state: DatepickerState) => {
  return getCalSuperMonth(state).firstWeek.days.map(d => ({
    long: d.weekDayName,
    short: d.shortWeekDayName,
    narrow: d.narrowWeekDayName
  }));
};

export const getNumFormatter = (state: DatepickerState) => {
  return (new Intl.NumberFormat(getLocale(state))).format;
};

export const getTitleTextPrev = (state: DatepickerState) => {
  switch (getCalMode(state)) {
    case CalModes.moty:
      return getDisplayTextForYear(getFocusYear(state).prevYear);
    case CalModes.dotm:
      return getDisplayTextForMonth(getFocusMonth(state).prevMonth) + ' ' + getDisplayTextForYear(getFocusMonth(state).prevMonth.year);
  }
};

export const getTitleTextNow = (state: DatepickerState) => {
  switch (state.calMode) {
    case CalModes.moty:
      return getDisplayTextForYear(getThisYear(state));
    case CalModes.dotm:
      return getDisplayTextForMonth(getThisMonth(state)) + ' ' + getDisplayTextForYear(getThisYear(state));
  }
};

export const getTitleTextNext = (state: DatepickerState) => {
  switch (state.calMode) {
    case CalModes.moty:
      return getDisplayTextForYear(getFocusYear(state).nextYear);
    case CalModes.dotm:
      return getDisplayTextForMonth(getFocusMonth(state).nextMonth) + ' ' + getDisplayTextForYear(getFocusMonth(state).nextMonth.year);
  }
};

export const getEarliestSelectedTime = (state: DatepickerState) => {
  const firstStartTime = Math.min.apply(null,
    state.selections.selectedRanges.filter(t => (t instanceof TimeRange)).map((t: TimeRange) => t.startTime)
  );
  return firstStartTime;
};
