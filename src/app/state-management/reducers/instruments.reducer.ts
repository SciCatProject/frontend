import { createReducer, on, Action } from "@ngrx/store";
import {
  initialInstrumentState,
  InstrumentState
} from "state-management/state/instruments.store";
import * as fromActions from "state-management/actions/instruments.actions";

const reducer = createReducer(
  initialInstrumentState,
  on(fromActions.fetchInstrumentsCompleteAction, (state, { instruments }) => ({
    ...state,
    instruments
  })),

  on(fromActions.fetchCountCompleteAction, (state, { count }) => ({
    ...state,
    totalCount: count
  })),

  on(fromActions.fetchInstrumentCompleteAction, (state, { instrument }) => ({
    ...state,
    currentInstrument: instrument
  })),

  on(fromActions.changePageAction, (state, { page, limit }) => {
    const skip = page * limit;
    const filters = { ...state.filters, skip, limit };
    return { ...state, filters };
  }),

  on(fromActions.sortByColumnAction, (state, { column, direction }) => {
    const sortField = column + (direction ? " " + direction : "");
    const filters = { ...state.filters, sortField, skip: 0 };
    return { ...state, filters };
  })
);

export function instrumentsReducer(
  state: InstrumentState | undefined,
  action: Action
) {
  if (action.type.indexOf("[Instrument]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
}
