import { Action } from "@ngrx/store";
import { Logbook } from "../models";

export enum ActionTypes {
  FETCH_LOGBOOKS = "[Logbook] Fetch Logbooks",
  FETCH_LOGBOOKS_COMPLETE = "[Logbook] Fetch Logbooks Complete",
  FETCH_LOGBOOKS_FAILED = "[Logbook] Fetch Logbooks Failed",

  FETCH_LOGBOOK = "[Logbook] Fetch Logbook",
  FETCH_LOGBOOK_COMPLETE = "[Logbook] Fetch Logbook Complete",
  FETCH_LOGBOOK_FAILED = "[Logbook] Fetch Logbook Failed",

  FETCH_SEARCHED_ENTRIES = "[Logbook] Fetch Searched Entries",
  FETCH_SEARCHED_ENTRIES_COMPLETE = "[Logbook] Fetch Searched Entries Complete",
  FETCH_SEARCHED_ENTRIES_FAILED = "[Logbook] Fetch Searched Entries Failed",

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

export class FetchSearchedEntriesAction implements Action {
  readonly type = ActionTypes.FETCH_SEARCHED_ENTRIES;

  constructor(readonly name: string, readonly query: string) {}
}

export class FetchSearchedEntriesCompleteAction implements Action {
  readonly type = ActionTypes.FETCH_SEARCHED_ENTRIES_COMPLETE;

  constructor(readonly logbook: Logbook) {}
}

export class FetchSearchedEntriesFailedAction implements Action {
  readonly type = ActionTypes.FETCH_SEARCHED_ENTRIES_FAILED;
}

export class FetchFilteredEntriesAction implements Action {
  readonly type = ActionTypes.FETCH_FILTERED_ENTRIES;

  constructor(readonly name: string, readonly query: string) {}
}

export class FetchFilteredEntriesCompleteAction implements Action {
  readonly type = ActionTypes.FETCH_FILTERED_ENTRIES_COMPLETE;

  constructor(readonly logbook: Logbook) {}
}

export class FetchFilteredEntriesFailedAction implements Action {
  readonly type = ActionTypes.FETCH_FILTERED_ENTRIES_FAILED;
}

export type LogbooksAction =
  | FetchLogbooksAction
  | FetchLogbooksCompleteAction
  | FetchLogbooksFailedAction
  | FetchLogbookAction
  | FetchLogbookCompleteAction
  | FetchLogbookFailedAction
  | FetchSearchedEntriesAction
  | FetchSearchedEntriesCompleteAction
  | FetchSearchedEntriesFailedAction
  | FetchFilteredEntriesAction
  | FetchFilteredEntriesCompleteAction
  | FetchFilteredEntriesFailedAction;

export type FetchLogbooksOutcomeAction =
  | FetchLogbooksCompleteAction
  | FetchLogbooksFailedAction;

export type LogbookAction =
  | FetchLogbookAction
  | FetchLogbookCompleteAction
  | FetchLogbookFailedAction;

export type FetchLogbookOutcomeAction =
  | FetchLogbookCompleteAction
  | FetchLogbookFailedAction;

export type FetchSearchedEntriesOutcomeAction =
  | FetchSearchedEntriesCompleteAction
  | FetchSearchedEntriesFailedAction;

export type FetchFilteredEntriesOutcomeActions =
  | FetchFilteredEntriesCompleteAction
  | FetchFilteredEntriesFailedAction;
