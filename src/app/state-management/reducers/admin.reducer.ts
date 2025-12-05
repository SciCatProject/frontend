import { createReducer, Action, on } from "@ngrx/store";
import * as fromActions from "state-management/actions/admin.action";
import {
  AdminState,
  initialAdminState,
} from "state-management/state/admin.store";

const reducer = createReducer(
  initialAdminState,
  on(
    fromActions.loadConfigurationSuccess,
    (state, { config }): AdminState => ({
      ...state,
      config,
    }),
  ),

  on(
    fromActions.updateConfigurationSuccess,
    (state, { config }): AdminState => ({
      ...state,
      config,
    }),
  ),
);

export const adminReducer = (state: AdminState | undefined, action: Action) => {
  if (action.type.indexOf("[Admin]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
};
