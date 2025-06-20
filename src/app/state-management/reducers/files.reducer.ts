import { createReducer, Action, on } from "@ngrx/store";
import * as fromActions from "state-management/actions/files.actions";
import {
  FilesState,
  initialFilesState,
} from "state-management/state/files.store";

const reducer = createReducer(
  initialFilesState,
  on(
    fromActions.fetchAllOrigDatablocksCompleteAction,
    (state, { origDatablocks }): FilesState => ({
      ...state,
      origDatablocks,
    }),
  ),

  on(
    fromActions.fetchCountCompleteAction,
    (state, { count }): FilesState => ({
      ...state,
      totalCount: count,
    }),
  ),

  on(
    fromActions.fetchOrigDatablockCompleteAction,
    (state, { origDatablock }): FilesState => ({
      ...state,
      currentOrigDatablock: origDatablock,
    }),
  ),

  on(
    fromActions.clearOrigDatablockStateAction,
    (): FilesState => ({
      ...initialFilesState,
    }),
  ),
);

export const filesReducer = (state: FilesState | undefined, action: Action) => {
  if (action.type.indexOf("[Orig]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
};
