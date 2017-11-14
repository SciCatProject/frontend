import TimeRange from './LocalizedDateTime/TimeRange';
import {Day, MultiDayRange, Month, Year, MultiYearRange} from './LocalizedDateTime/timeRanges';
import CalSuperMonth from './LocalizedDateTime/CalSuperMonth';
import {DatePickerAction, datepickerActionTypes} from './datepicker.actions';
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
export const initialTimerRangeSelectorState: TimerRangeSelectorState = {
  selectionMode: defaultSelectionMode,
  selectedRanges: defaultSelectedRanges,
  activeSelectedRangeIdx: defaultActiveSelectedRangeIdx, // for potential future use (when multiple ranges may be selected at the same time)
};


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

export const initialDatepickerState: DatepickerState = {
    minYear: defaultMinYear,
    maxYear: defaultMaxYear,
    locale: defaultLocale,
    firstWeekdayIdx: defaultFirstWeekdayIdx,
    showCal: false,
    calMode: defaultCalMode,
    focusMonth: thisMonth,
    today: today,
    selections: initialTimerRangeSelectorState
};




export const getSelectionMode = (state: DatepickerState) => {
  return state.selections.selectionMode;
};
export const getSelectedRanges = (state: DatepickerState) => {
  return state.selections.selectedRanges;
};

const updateSelections = (state: DatepickerState, clickedDay: Day) => {
  const newState = Object.assign({}, state);
  newState.selections = Object.assign({}, newState.selections);
  newState.selections.selectedRanges = [].concat(newState.selections.selectedRanges);
  const asri = newState.selections.activeSelectedRangeIdx;
  const activeSelectedRange = newState.selections.selectedRanges[asri] ;
  let newActiveSelectedRange = activeSelectedRange;
  const selectionMode = getSelectionMode(newState);
  switch (selectionMode) {
    case SelectionModes.day:
      if ((activeSelectedRange instanceof TimeRange) && clickedDay.isTemporallyEqualTo(activeSelectedRange)) {
        // deselect
        newActiveSelectedRange = null;
      } else {
        // overwrite
        newActiveSelectedRange = clickedDay;
      }
      break;
    case SelectionModes.range:
      if ((activeSelectedRange instanceof Day) && (!clickedDay.happensBefore(activeSelectedRange))) {
        if (clickedDay.isTemporallyEqualTo(activeSelectedRange)) {
          // deselect
          newActiveSelectedRange = null;
        } else  {
          // expand (complete)
          newActiveSelectedRange = new MultiDayRange(activeSelectedRange, clickedDay, newState.locale, newState.firstWeekdayIdx);
        }
      } else {
        // overwrite
        newActiveSelectedRange = clickedDay;
      }
      break;
  }
  newState.selections.selectedRanges[asri] = newActiveSelectedRange;
  return newState;
};
const setSelectionMode = (state: DatepickerState, selectionMode: SelectionModes) => {
  const newState = Object.assign({}, state);
  newState.selections = Object.assign({}, newState.selections);
  newState.selections.selectionMode = selectionMode;
  newState.selections.selectedRanges = [].concat(defaultSelectedRanges);
  newState.selections.activeSelectedRangeIdx = defaultActiveSelectedRangeIdx;
  return newState;
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


const toggleCalDisp = (state: DatepickerState) => {
  const newState = Object.assign({}, state);
  newState.showCal = !newState.showCal;
  if (newState.showCal) {
    newState.calMode = CalModes.dotm;
    let earliestSelectedTime = getEarliestSelectedTime(state);
    if ((!Number.isFinite(earliestSelectedTime)) || ((!earliestSelectedTime && (earliestSelectedTime !== 0)))) {
      earliestSelectedTime = newState.today.startTime;
    }
    newState.focusMonth = new Month(earliestSelectedTime, newState.locale, newState.firstWeekdayIdx);
  }
  return newState;
};

const toggleCalMode = (state: DatepickerState) => {
  const newState = Object.assign({}, state);
  switch (newState.calMode) {
    case CalModes.dotm:
      newState.calMode = CalModes.moty;
      break;
    case CalModes.moty:
      newState.calMode = CalModes.dotm;
      break;
  }
  return newState;
};

const resyncToday = (state: DatepickerState) => {
  const newState = Object.assign({}, state);
  const newTimeNow = new Date().getTime();
  newState.today = new Day(newTimeNow, newState.locale, newState.firstWeekdayIdx);
  return newState;
};

const refocusToCurrentMonth = (state: DatepickerState) => {
  const newState = Object.assign({}, state);
  newState.focusMonth = newState.today.month;
  return newState;
};

const updateFocusMonth = (state: DatepickerState, newFocusMonth: Month) => {
  const newState = Object.assign({}, state);
  newState.focusMonth = newFocusMonth;
  return newState;
};

const stepFocusBack = (state: DatepickerState) => {
  switch (state.calMode) {
    case CalModes.dotm:
      return updateFocusMonth(state, state.focusMonth.prevMonth);
    case CalModes.moty:
      const calSuperMonth = getCalSuperMonth(state);
      return updateFocusMonth(state, calSuperMonth.prevYearCalSuperMonth.focusMonth);
  }
  return state;
};

const stepFocusForward = (state: DatepickerState) => {
  switch (state.calMode) {
    case CalModes.dotm:
      return updateFocusMonth(state, state.focusMonth.nextMonth);
    case CalModes.moty:
      const calSuperMonth = getCalSuperMonth(state);
      return updateFocusMonth(state, calSuperMonth.nextYearCalSuperMonth.focusMonth);
  }
  return state;
};


const focusOnMonth = (state: DatepickerState, clickedMonth: Month) => {
  let newState = Object.assign({}, state);
  newState = updateFocusMonth(newState, clickedMonth);
  newState.calMode = CalModes.dotm;
  return newState;
};

const setFocusYear = (state: DatepickerState, newFocusYearNumber: number) => {
  const oldFocusMonth = getFocusMonth(state);
  const middleOfOldFocusMonthTimeApprox = Math.round((oldFocusMonth.startTime + oldFocusMonth.endTime) / 2);
  const locale = getLocale(state);
  const firstWeekdayIdx = getFirstWeekdayIdx(state);
  const d = new Date(middleOfOldFocusMonthTimeApprox);
  d.setUTCFullYear(newFocusYearNumber);
  const newFocusMonth = new Month(d.getTime(), locale, firstWeekdayIdx);
  return updateFocusMonth(state, newFocusMonth);
};




export function datepickerReducer(state = initialDatepickerState, action: DatePickerAction): DatepickerState {

  if (action.type.indexOf('[DatePicker]') !== -1) {
    console.log('Action came in! ' + action.type);
  }
  switch (action.type) {


    case datepickerActionTypes.TOGGLE_CAL_DISP: {
      return toggleCalDisp(state);
    }

    case datepickerActionTypes.TOGGLE_CAL_MODE: {
      return toggleCalMode(state);
    }

    case datepickerActionTypes.RESYNC_TODAY: {
      return resyncToday(state);
    }

    case datepickerActionTypes.REFOCUS_TO_CURRENT_MONTH: {
      return refocusToCurrentMonth(state);
    }

    case datepickerActionTypes.STEP_FOCUS_BACK: {
      return stepFocusBack(state);
    }

    case datepickerActionTypes.STEP_FOCUS_FORWARD: {
      return stepFocusForward(state);
    }

    case datepickerActionTypes.UPDATE_FOCUS_MONTH: {
      return updateFocusMonth(state, action['payload']);
    }

    case datepickerActionTypes.UPDATE_SELECTIONS: {
      return updateSelections(state, action['payload']);
    }

    case datepickerActionTypes.FOCUS_ON_MONTH: {
      return focusOnMonth(state, action['payload']);
    }

    case datepickerActionTypes.SET_FOCUS_YEAR: {
      return setFocusYear(state, action['payload']);
    }

    case datepickerActionTypes.SET_SELECTION_MODE: {
      return setSelectionMode(state, action['payload']);
    }

    default: {
      return state;
    }
  }
}
