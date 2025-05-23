import { createReducer, on, Action } from "@ngrx/store";
import {
  initialInstrumentState,
  InstrumentState,
} from "state-management/state/instruments.store";
import * as fromActions from "state-management/actions/instruments.actions";

const reducer = createReducer(
  initialInstrumentState,
  on(
    fromActions.fetchInstrumentsCompleteAction,
    (state, { instruments }): InstrumentState => ({
      ...state,
      instruments,
    }),
  ),

  on(
    fromActions.fetchCountCompleteAction,
    (state, { count }): InstrumentState => ({
      ...state,
      totalCount: count,
    }),
  ),

  on(
    fromActions.fetchInstrumentCompleteAction,
    (state, { instrument }): InstrumentState => ({
      ...state,
      currentInstrument: instrument,
    }),
  ),

  on(
    fromActions.saveCustomMetadataCompleteAction,
    (state, { instrument }): InstrumentState => ({
      ...state,
      currentInstrument: instrument,
    }),
  ),

  on(
    fromActions.clearInstrumentsStateAction,
    (): InstrumentState => ({
      ...initialInstrumentState,
    }),
  ),
);

export const instrumentsReducer = (
  state: InstrumentState | undefined,
  action: Action,
) => {
  if (action.type.indexOf("[Instrument]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
};
