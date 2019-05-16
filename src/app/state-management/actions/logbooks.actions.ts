import { Action } from "@ngrx/store";
import { Logbook, LogbookFilters } from "../models";

export enum ActionTypes {
  FETCH_LOGBOOKS = "[Logbook] Fetch Logbooks",
  FETCH_LOGBOOKS_COMPLETE = "[Logbook] Fetch Logbooks Complete",
  FETCH_LOGBOOKS_FAILED = "[Logbook] Fetch Logbooks Failed",

  FETCH_LOGBOOK = "[Logbook] Fetch Logbook",
  FETCH_LOGBOOK_COMPLETE = "[Logbook] Fetch Logbook Complete",
  FETCH_LOGBOOK_FAILED = "[Logbook] Fetch Logbook Failed",

  UPDATE_FILTER = "[Logbook] Update Filter",
  UPDATE_FILTER_COMPLETE = "[Logbook] Update Filter Complete",
  UPDATE_FILTER_FAILED = "[Logbook] Update Filter Failed",

  FETCH_FILTERED_ENTRIES = "[Logbook] Fetch Filtered Entries",
  FETCH_FILTERED_ENTRIES_COMPLETE = "[Logbook] Fetch Filtered Entries Complete",
  FETCH_FILTERED_ENTRIES_FAILED = "[Logbook] Fetch Filtered Entries Failed"
}

export class FetchLogbooksAction implements Action {
  readonly type = ActionTypes.FETCH_LOGBOOKS;
}

export class FetchLogbooksCompleteAction implements Action {
  readonly type = ActionTypes.FETCH_LOGBOOKS_COMPLETE;

  constructor(readonly logbooks: Logbook[]) {}
}

export class FetchLogbooksFailedAction implements Action {
  readonly type = ActionTypes.FETCH_LOGBOOKS_FAILED;
}

export class FetchLogbookAction implements Action {
  readonly type = ActionTypes.FETCH_LOGBOOK;

  constructor(readonly name: string) {}
}

export class FetchLogbookCompleteAction implements Action {
  readonly type = ActionTypes.FETCH_LOGBOOK_COMPLETE;

  constructor(readonly logbook: Logbook) {}
}

export class FetchLogbookFailedAction implements Action {
  readonly type = ActionTypes.FETCH_LOGBOOK_FAILED;
}

export class FetchFilteredEntriesAction implements Action {
  readonly type = ActionTypes.FETCH_FILTERED_ENTRIES;

  constructor(readonly name: string, readonly filter: Object) {}
}

export class FetchFilteredEntriesCompleteAction implements Action {
  readonly type = ActionTypes.FETCH_FILTERED_ENTRIES_COMPLETE;

  constructor(readonly logbook: Logbook) {}
}

export class FetchFilteredEntriesFailedAction implements Action {
  readonly type = ActionTypes.FETCH_FILTERED_ENTRIES_FAILED;
}

export class UpdateFilterAction implements Action {
  readonly type = ActionTypes.UPDATE_FILTER;

  constructor(readonly filter: LogbookFilters) {}
}

export class UpdateFilterCompleteAction implements Action {
  readonly type = ActionTypes.UPDATE_FILTER_COMPLETE;

  constructor(readonly filter: LogbookFilters) {}
}

export class UpdateFilterFailedAction implements Action {
  readonly type = ActionTypes.UPDATE_FILTER_FAILED;
}

export type AllActions =
  | FetchLogbooksAction
  | FetchLogbooksCompleteAction
  | FetchLogbooksFailedAction
  | FetchLogbookAction
  | FetchLogbookCompleteAction
  | FetchLogbookFailedAction
  | FetchFilteredEntriesAction
  | FetchFilteredEntriesCompleteAction
  | FetchFilteredEntriesFailedAction
  | UpdateFilterAction
  | UpdateFilterCompleteAction
  | UpdateFilterFailedAction;

export type FetchLogbooksOutcomeAction =
  | FetchLogbooksCompleteAction
  | FetchLogbooksFailedAction;

export type FetchLogbookOutcomeAction =
  | FetchLogbookCompleteAction
  | FetchLogbookFailedAction;

export type FetchFilteredEntriesOutcomeActions =
  | FetchFilteredEntriesCompleteAction
  | FetchFilteredEntriesFailedAction;

export type UpdateFilterOutcomeActions =
  | UpdateFilterCompleteAction
  | UpdateFilterFailedAction;
