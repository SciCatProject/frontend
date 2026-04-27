import { createReducer, Action, on } from "@ngrx/store";
import * as fromActions from "state-management/actions/files.actions";
import {
  FilesState,
  getFileOrigdatablockKey,
  initialFilesState,
} from "state-management/state/files.store";
import { FileOrigdatablock } from "state-management/models";

const addSelectedOrigDatablocks = (
  currentSelection: FileOrigdatablock[],
  origDatablocksToSelect: FileOrigdatablock[],
) => {
  const selectedByKey = new Map(
    currentSelection.map((origDatablock) => [
      getFileOrigdatablockKey(origDatablock),
      origDatablock,
    ]),
  );

  origDatablocksToSelect.forEach((origDatablock) => {
    selectedByKey.set(getFileOrigdatablockKey(origDatablock), origDatablock);
  });

  return Array.from(selectedByKey.values());
};

const removeSelectedOrigDatablocks = (
  currentSelection: FileOrigdatablock[],
  origDatablocksToDeselect: FileOrigdatablock[],
) => {
  const deselectedKeys = new Set(
    origDatablocksToDeselect.map((origDatablock) =>
      getFileOrigdatablockKey(origDatablock),
    ),
  );

  return currentSelection.filter(
    (selectedOrigDatablock) =>
      !deselectedKeys.has(getFileOrigdatablockKey(selectedOrigDatablock)),
  );
};

const updateSelectedOrigDatablocks = (
  state: FilesState,
  selectedOrigDatablocks: FileOrigdatablock[],
): FilesState => ({
  ...state,
  selectedOrigDatablocks,
  selectedOrigDatablocksCount: selectedOrigDatablocks.length,
});

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
    fromActions.fetchDatasetOrigDatablocksCompleteAction,
    (state, { currentDatasetOrigDatablocks }): FilesState => ({
      ...state,
      currentDatasetOrigDatablocks,
    }),
  ),

  on(
    fromActions.fetchCountCompleteAction,
    (state, { count, fields }): FilesState => {
      if (fields?.datasetId) {
        return {
          ...state,
          currentDatasetCount: count,
        };
      }
      return {
        ...state,
        totalCount: count,
      };
    },
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

  on(
    fromActions.selectOrigDatablockAction,
    (state, { origDatablock }): FilesState =>
      updateSelectedOrigDatablocks(
        state,
        addSelectedOrigDatablocks(state.selectedOrigDatablocks, [
          origDatablock,
        ]),
      ),
  ),

  on(
    fromActions.selectAllOrigDatablocksAction,
    (state, { origDatablocks }): FilesState =>
      updateSelectedOrigDatablocks(
        state,
        addSelectedOrigDatablocks(state.selectedOrigDatablocks, origDatablocks),
      ),
  ),

  on(
    fromActions.deselectOrigDatablockAction,
    (state, { origDatablock }): FilesState =>
      updateSelectedOrigDatablocks(
        state,
        removeSelectedOrigDatablocks(state.selectedOrigDatablocks, [
          origDatablock,
        ]),
      ),
  ),

  on(
    fromActions.deselectOrigDatablocksAction,
    (state, { origDatablocks }): FilesState =>
      updateSelectedOrigDatablocks(
        state,
        removeSelectedOrigDatablocks(
          state.selectedOrigDatablocks,
          origDatablocks,
        ),
      ),
  ),

  on(
    fromActions.clearSelectionAction,
    (state): FilesState => updateSelectedOrigDatablocks(state, []),
  ),
);

export const filesReducer = (state: FilesState | undefined, action: Action) => {
  if (action.type.indexOf("[OrigDatablock]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
};
