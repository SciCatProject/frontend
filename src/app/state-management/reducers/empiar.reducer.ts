import { createReducer, Action, on } from "@ngrx/store";
import * as fromActions from "state-management/actions/depositor.actions";
import {
  EmpiarSchemaState,
  initialEMPIARState,
} from "state-management/state/depositor.store";

export const empiarReducer = (
  state: EmpiarSchemaState | undefined,
  action: Action,
) => {
  if (action.type.indexOf("[Depositor]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return schemaReducer(state, action);
};

const schemaReducer = createReducer(
  initialEMPIARState,
  on(
    fromActions.accessEmpiarSchemaSuccess,
    (state, { schema }): EmpiarSchemaState => ({
      ...state,
      schema,
    }),
  ),
  on(
    fromActions.accessEmpiarSchemaFailure,
    (state, { err }): EmpiarSchemaState => ({
      ...state,
      empiarInteractionError: err,
    }),
  ),
);