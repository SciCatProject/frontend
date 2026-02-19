import { createReducer, Action, on } from "@ngrx/store";
import * as fromActions from "state-management/actions/runtime-config.action";
import {
  RuntimeConfigState,
  initialRuntimeConfigState,
} from "state-management/state/runtimeConfig.store";

const reducer = createReducer(
  initialRuntimeConfigState,
  on(
    fromActions.loadConfigurationSuccess,
    (state, { config }): RuntimeConfigState => ({
      ...state,
      config,
    }),
  ),

  on(
    fromActions.updateConfigurationSuccess,
    (state, { config }): RuntimeConfigState => ({
      ...state,
      config,
    }),
  ),
);

export const runtimeConfigReducer = (
  state: RuntimeConfigState | undefined,
  action: Action,
) => {
  if (action.type.indexOf("[RunTimeConfig]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
};
