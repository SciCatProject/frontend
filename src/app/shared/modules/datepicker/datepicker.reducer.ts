import TimeRange from './LocalizedDateTime/TimeRange';
import {Day, MultiDayRange, Month, Year, MultiYearRange} from './LocalizedDateTime/timeRanges';
import CalSuperMonth from './LocalizedDateTime/CalSuperMonth';
import {DatepickerState, CalModes, SelectionModes} from './datepicker.store';
import * as dps from './datepicker.store';
import {DatePickerAction, datepickerActionTypes} from './datepicker.actions';
export {DatePickerAction, datepickerActionTypes};

const setSelections = (state: DatepickerState, timeranges: TimeRange[]) => {
  const newState = Object.assign({}, state);
  newState.selections = Object.assign({}, newState.selections);
  newState.selections.selectedRanges = [];
  newState.selections.activeSelectedRangeIdx = 0;
  const selectionMode = dps.getSelectionMode(newState);
  switch (selectionMode) {
    case SelectionModes.day:
      if (timeranges.length > 1) {
        throw new Error('Multiple range selections are not supported yet');
      }
      for (let idx = 0; idx < timeranges.length; idx++) {
        const tr = timeranges[idx];
        if ((tr === null) || (tr instanceof Day)) {
          newState.selections.selectedRanges.push(tr);
        } else {
          throw new Error('Set selection is incompatible with selection mode');
        }
      }
      break;
    case SelectionModes.range:
      if (timeranges.length > 1) {
        throw new Error('Multiple range selections are not supported yet');
      }
      for (let idx = 0; idx < timeranges.length; idx++) {
        const tr = timeranges[idx];
        if ((tr === null) || (tr instanceof Day) || (tr instanceof MultiDayRange)) {
          newState.selections.selectedRanges.push(tr);
        } else {
          throw new Error('Set selection is incompatible with selection mode');
        }
      }
     break;
  }
  newState.selections.activeSelectedRangeIdx = Math.max(0, newState.selections.selectedRanges.length - 1);
  return newState;
};

const updateSelections = (state: DatepickerState, clickedDay: Day) => {
  console.log({state, clickedDay});
  const newState = Object.assign({}, state);
  newState.selections = Object.assign({}, newState.selections);
  newState.selections.selectedRanges = [].concat(newState.selections.selectedRanges);
  const asri = newState.selections.activeSelectedRangeIdx;
  const activeSelectedRange = newState.selections.selectedRanges[asri] ;
  let newActiveSelectedRange = activeSelectedRange;
  const selectionMode = dps.getSelectionMode(newState);
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
  console.log({newActiveSelectedRange, selectedRanges: newState.selections.selectedRanges});
  return newState;
};

const setSelectionMode = (state: DatepickerState, selectionMode: SelectionModes) => {
  const newState = Object.assign({}, state);
  newState.selections = Object.assign({}, newState.selections);
  newState.selections.selectionMode = selectionMode;
  newState.selections.selectedRanges = [].concat(dps.initialDatepickerState.selections.selectedRanges);
  newState.selections.activeSelectedRangeIdx = dps.initialDatepickerState.selections.activeSelectedRangeIdx;
  return newState;
};

const toggleCalDisp = (state: DatepickerState) => {
  const newState = Object.assign({}, state);
  newState.showCal = !newState.showCal;
  if (newState.showCal) {
    newState.calMode = CalModes.dotm;
    let earliestSelectedTime = dps.getEarliestSelectedTime(state);
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
      const calSuperMonth = dps.getCalSuperMonth(state);
      return updateFocusMonth(state, calSuperMonth.prevYearCalSuperMonth.focusMonth);
  }
  return state;
};

const stepFocusForward = (state: DatepickerState) => {
  switch (state.calMode) {
    case CalModes.dotm:
      return updateFocusMonth(state, state.focusMonth.nextMonth);
    case CalModes.moty:
      const calSuperMonth = dps.getCalSuperMonth(state);
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
  const oldFocusMonth = dps.getFocusMonth(state);
  const middleOfOldFocusMonthTimeApprox = Math.round((oldFocusMonth.startTime + oldFocusMonth.endTime) / 2);
  const locale = dps.getLocale(state);
  const firstWeekdayIdx = dps.getFirstWeekdayIdx(state);
  const d = new Date(middleOfOldFocusMonthTimeApprox);
  d.setUTCFullYear(newFocusYearNumber);
  const newFocusMonth = new Month(d.getTime(), locale, firstWeekdayIdx);
  return updateFocusMonth(state, newFocusMonth);
};




export function datepickerReducer(state = dps.initialDatepickerState, action: DatePickerAction): DatepickerState {

  if (action.type.indexOf('[DatePicker]') !== -1) {
//    console.log('Action came in! ' + action.type);
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

    case datepickerActionTypes.SET_SELECTIONS: {
      return setSelections(state, action['payload']);
    }

    default: {
      return state;
    }
  }
}
