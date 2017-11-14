import { Action, Store } from '@ngrx/store';
import { type } from './util';

import {Day, Month} from './LocalizedDateTime/timeRanges';
import {CalModes, SelectionModes} from './datepicker.reducer';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const datepickerActionTypes = {
  TOGGLE_CAL_DISP: type('[DatePicker] Toggle Cal Disp'),
  TOGGLE_CAL_MODE: type('[DatePicker] Toggle Cal Mode'),
  RESYNC_TODAY: type('[DatePicker] Resync Today'),
  REFOCUS_TO_CURRENT_MONTH: type('[DatePicker] Refocus to Current Month'),
  STEP_FOCUS_BACK: type('[DatePicker] Step Focus Back'),
  STEP_FOCUS_FORWARD: type('[DatePicker] Step Focus Forward'),
  UPDATE_FOCUS_MONTH: type('[DatePicker] Update Focus Month'),
  UPDATE_SELECTIONS: type('[DatePicker] Update Selections'),
  FOCUS_ON_MONTH: type('[DatePicker] Focus on Month'),
  SET_FOCUS_YEAR: type('[DatePicker] Set Focus Year'),
  SET_SELECTION_MODE: type('[DatePicker] Set Selection Mode')
};

export class ToggleCalDispAction implements Action {
  readonly type = datepickerActionTypes.TOGGLE_CAL_DISP;

  constructor() { }
}
export class ToggleCalModeAction implements Action {
  readonly type = datepickerActionTypes.TOGGLE_CAL_MODE;

  constructor() { }
}
export class ResyncTodayAction implements Action {
  readonly type = datepickerActionTypes.RESYNC_TODAY;

  constructor() { }
}
export class RefocusToCurrentMonthAction implements Action {
  readonly type = datepickerActionTypes.REFOCUS_TO_CURRENT_MONTH;

  constructor() { }
}
export class StepFocusBackAction implements Action {
  readonly type = datepickerActionTypes.STEP_FOCUS_BACK;

  constructor() { }
}
export class StepFocusForwardAction implements Action {
  readonly type = datepickerActionTypes.STEP_FOCUS_FORWARD;

  constructor() { }
}
export class UpdateFocusMonthAction implements Action {
  readonly type = datepickerActionTypes.UPDATE_FOCUS_MONTH;

  constructor(public payload: Month) { }
}
export class UpdateSelectionsAction implements Action {
  readonly type = datepickerActionTypes.UPDATE_SELECTIONS;

  constructor(public payload: Day) { }
}
export class FocusOnMonthAction implements Action {
  readonly type = datepickerActionTypes.FOCUS_ON_MONTH;

  constructor(public payload: Month) { }
}
export class SetFocusYearAction implements Action {
  readonly type = datepickerActionTypes.SET_FOCUS_YEAR;

  constructor(public payload: number) { }
}
export class SetSelectionModeAction implements Action {
  readonly type = datepickerActionTypes.SET_SELECTION_MODE;
  constructor(public payload: SelectionModes) { }
}


export type DatePickerAction =
  ToggleCalDispAction |
  ToggleCalModeAction |
  ResyncTodayAction |
  RefocusToCurrentMonthAction |
  StepFocusBackAction |
  StepFocusForwardAction |
  UpdateFocusMonthAction |
  UpdateSelectionsAction |
  FocusOnMonthAction |
  SetFocusYearAction |
  SetSelectionModeAction;
