import { createReducer, Action, on } from "@ngrx/store";
import * as fromActions from "state-management/actions/onedep.actions";
import {
  OneDepState,
  initialOneDepState,
} from "state-management/state/onedep.store";

const reducer = createReducer(
  initialOneDepState,
  on(
    fromActions.submitDepositionSuccess,
    (state, { deposition }): OneDepState => ({
      ...state,
      depositionCreated: deposition,
      oneDepInteractionError: undefined,
    }),
  ),
  on(
    fromActions.submitDepositionFailure,
    (state, { err }): OneDepState => ({
      ...state,
      oneDepInteractionError: err,
    }),
  ),
);

export const onedepReducer = (
  state: OneDepState | undefined,
  action: Action,
) => {
  if (action.type.indexOf("[OneDep]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
};
