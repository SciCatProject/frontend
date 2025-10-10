import { createReducer, Action, on } from "@ngrx/store";
import * as fromActions from "state-management/actions/depositor.actions";
import {
  DepositorState,
  initialDepositorState,
} from "state-management/state/depositor.store";

export const depositorReducer = (
  state: DepositorState | undefined,
  action: Action,
) => {
  if (action.type.indexOf("[Depositor]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
};

const reducer = createReducer(
  initialDepositorState,
  on(
    fromActions.connectToDepositor,
    (state): DepositorState => ({
      ...state,
      interactionError: undefined,
    }),
  ),
  on(
    fromActions.connectToDepositorSuccess,
    (state): DepositorState => ({
      ...state,
      interactionError: undefined,
    }),
  ),
  on(
    fromActions.connectToDepositorFailure,
    (state, { err }): DepositorState => ({
      ...state,
      interactionError: err,
    }),
  ),
);