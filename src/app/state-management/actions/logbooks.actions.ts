import { Action } from "@ngrx/store";
import { Logbook } from "../models";

export enum ActionTypes {
  FETCH = "[Logbook] Fetch Logbooks",
  FETCH_COMPLETE = "[Logbook] Fetch Logbooks Complete",
  FETCH_FAILED = "[Logbook] Fetch Logbooks Failed"
}

export class FetchLogbooksAction implements Action {
  readonly type = ActionTypes.FETCH;
}

export class FetchLogbooksCompleteAction implements Action {
  readonly type = ActionTypes.FETCH_COMPLETE;

  constructor(readonly logbooks: Logbook[]) {}
}

export class FetchLogbooksFailedAction implements Action {
  readonly type = ActionTypes.FETCH_FAILED;
}

export type LogbooksAction =
  | FetchLogbooksAction
  | FetchLogbooksCompleteAction
  | FetchLogbooksFailedAction;

export type FetchLogbooksOutcomeAction =
  | FetchLogbooksCompleteAction
  | FetchLogbooksFailedAction;
