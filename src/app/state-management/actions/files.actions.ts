import { createAction, props } from "@ngrx/store";
import { FileOrigdatablock } from "state-management/models";

export const fetchAllOrigDatablocksAction = createAction(
  "[OrigDatablock] Fetch All Orig Datablocks",
  props<{
    skip?: number;
    limit?: number;
    search?: string;
    sortDirection?: string;
    sortColumn?: string;
  }>(),
);
export const fetchAllOrigDatablocksCompleteAction = createAction(
  "[OrigDatablock] Fetch All Orig Datablocks Complete",
  props<{ origDatablocks: FileOrigdatablock[] }>(),
);
export const fetchAllOrigDatablocksFailedAction = createAction(
  "[OrigDatablock] Fetch All Orig Datablocks Failed",
);

export const fetchCountAction = createAction(
  "[OrigDatablock] Fetch Count",
  props<{ fields?: Record<string, unknown> }>(),
);
export const fetchCountCompleteAction = createAction(
  "[OrigDatablock] Fetch Count Complete",
  props<{ count: number; fields?: Record<string, unknown> }>(),
);
export const fetchCountFailedAction = createAction(
  "[OrigDatablock] Fetch Count Failed",
);

// Dataset Dynamic DataFiles actions
export const fetchDatasetOrigDatablocksAction = createAction(
  "[OrigDatablock] Fetch Dataset Orig Datablocks",
  props<{
    datasetId?: string;
    skip?: number;
    limit?: number;
    search?: string;
    sortDirection?: string;
    sortColumn?: string;
  }>(),
);
export const fetchDatasetOrigDatablocksCompleteAction = createAction(
  "[OrigDatablock] Fetch Dataset Orig Datablocks Complete",
  props<{ currentDatasetOrigDatablocks: FileOrigdatablock[] }>(),
);
export const fetchDatasetOrigDatablocksFailedAction = createAction(
  "[OrigDatablock] Fetch Dataset Orig Datablocks Failed",
);

// DataFiles Table selection
export const selectOrigDatablockAction = createAction(
  "[OrigDatablock] Select Orig Datablock",
  props<{ origDatablock: FileOrigdatablock }>(),
);
export const deselectOrigDatablockAction = createAction(
  "[OrigDatablock] Deselect Orig Datablock",
  props<{ origDatablock: FileOrigdatablock }>(),
);
export const selectAllOrigDatablocksAction = createAction(
  "[OrigDatablock] Select All Orig Datablocks",
  props<{ origDatablocks: FileOrigdatablock[] }>(),
);
export const deselectOrigDatablocksAction = createAction(
  "[OrigDatablock] Deselect Orig Datablocks",
  props<{ origDatablocks: FileOrigdatablock[] }>(),
);
export const clearSelectionAction = createAction(
  "[OrigDatablock] Clear Selection",
);

export const fetchOrigDatablockAction = createAction(
  "[OrigDatablock] Fetch Orig Datablock",
  props<{ id: string }>(),
);
export const fetchOrigDatablockCompleteAction = createAction(
  "[OrigDatablock] Fetch Orig Datablock Complete",
  props<{ origDatablock: FileOrigdatablock }>(),
);
export const fetchOrigDatablockFailedAction = createAction(
  "[OrigDatablock] Fetch Orig Datablock Failed",
);

export const clearOrigDatablockStateAction = createAction(
  "[OrigDatablock] Clear State",
);
