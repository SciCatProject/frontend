import { Action } from "@ngrx/store";
import { Logbook } from "../models";

export enum ActionTypes {
  FETCH_LOGBOOKS = "[Logbook] Fetch Logbooks",
  FETCH_LOGBOOKS_COMPLETE = "[Logbook] Fetch Logbooks Complete",
  FETCH_LOGBOOKS_FAILED = "[Logbook] Fetch Logbooks Failed",
  FETCH_LOGBOOK = "[Logbook] Fetch Logbook",
  FETCH_LOGBOOK_COMPLETE = "[Logbook] Fetch Logbook Complete",
  FETCH_LOGBOOK_FAILED = "[Logbook] Fetch Logbook Failed"
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

export type LogbooksAction =
  | FetchLogbooksAction
  | FetchLogbooksCompleteAction
  | FetchLogbooksFailedAction
  | FetchLogbookAction
  | FetchLogbookCompleteAction
  | FetchLogbookFailedAction;

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
