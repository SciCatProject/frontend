import { createAction, props } from "@ngrx/store";
import { Logbook } from "shared/sdk";
import { LogbookFilters } from "state-management/models";

export const fetchLogbooksAction = createAction("[Logbook] Fetch Logbooks");
export const fetchLogbooksCompleteAction = createAction(
  "[Logbook] Fetch Logbooks Complete",
  props<{ logbooks: Logbook[] }>()
);
export const fetchLogbooksFailedAction = createAction(
  "[Logbook] Fetch Logbooks Failed"
);

export const fetchLogbookAction = createAction(
  "[Logbook] Fetch Logbook",
  props<{ name: string }>()
);
export const fetchLogbookCompleteAction = createAction(
  "[Logbook] Fetch Logbook Complete",
  props<{ logbook: Logbook }>()
);
export const fetchLogbookFailedAction = createAction(
  "[Logbook] Fetch Logbook Failed"
);

export const fetchFilteredEntriesAction = createAction(
  "[Logbook] Fetch Filtered Entries",
  props<{ name: string; filters: LogbookFilters }>()
);
export const fetchFilteredEntriesCompleteAction = createAction(
  "[Logbook] Fetch Filtered Entries Complete",
  props<{ logbook: Logbook }>()
);
export const fetchFilteredEntriesFailedAction = createAction(
  "[Logbook] Fetch Filtered Entries Failed"
);

export const setFilterAction = createAction(
  "[Logbook] Update Filter",
  props<{ filters: LogbookFilters }>()
);
