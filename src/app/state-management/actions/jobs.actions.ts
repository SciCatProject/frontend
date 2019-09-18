import { Action } from "@ngrx/store";
import { Job } from "shared/sdk/models";
import { JobViewMode } from "state-management/models";

export const SUBMIT = "[Jobs] Submit";
export const SUBMIT_COMPLETE = "[Jobs] Submit Complete";

export const RETRIEVE = "[Jobs] Retrieve";
export const RETRIEVE_COMPLETE = "[Jobs] Retrieve Complete";

export const FAILED = "[Jobs] Action Failed";
export const UI_STORE = "[Jobs] UI Store";
export const SELECT_CURRENT = "[Jobs] Current set selected";
export const SORT_VALUE_UPDATE = "[Jobs] Sort Update";
export const SORT_FAILED = "[Jobs] Sort Failed";

export const CHILD_RETRIEVE = "[Jobs] Child Retrieve";
export const CHILD_RETRIEVE_COMPLETE = "[Jobs] Child Retrieve Complete";

export const SEARCH_ID = "[Jobs] Search ID";
export const SEARCH_ID_COMPLETE = "[Jobs] Search ID Complete";
export const SEARCH_ID_FAILED = "[Jobs] Search ID Failed";

export const SORT_UPDATE = "[Jobs] Sort Update"; // Duplicate of SORT_VALUE_UPDATE?
export const SORT_UPDATE_COMPLETE = "[Jobs] Sort Update Complete";

export const GET_COUNT_COMPLETE = "[Jobs] Get Count Complete";

export class SubmitAction implements Action {
  readonly type = SUBMIT;
  constructor(readonly job: Job) {}
}

export class SubmitCompleteAction implements Action {
  readonly type = SUBMIT_COMPLETE;
  constructor(readonly job: Job) {}
}

export class FailedAction implements Action {
  readonly type = FAILED;
  constructor(readonly error: Error) {}
}

export class RetrieveCompleteAction implements Action {
  readonly type = RETRIEVE_COMPLETE;
  constructor(readonly jobsets: Job[]) {}
}

export class GetCountCompleteAction implements Action {
  readonly type = GET_COUNT_COMPLETE;
  constructor(readonly totalJobNumber: number) {}
}

export class SearchIDAction implements Action {
  readonly type = SEARCH_ID;
  constructor(readonly id: string) {}
}

export class SearchIDCompleteAction implements Action {
  readonly type = SEARCH_ID_COMPLETE;
  constructor(readonly jobset: {}) {}
}

export class SearchIDFailedAction implements Action {
  readonly type = SEARCH_ID_FAILED;
  constructor(readonly error: Error) {}
}

export class CurrentJobAction implements Action {
  readonly type = SELECT_CURRENT;
  constructor(readonly job: Job) {}
}

export class SortUpdateAction implements Action {
  readonly type = SORT_UPDATE;
  constructor(
    readonly skip: number,
    readonly limit: number,
    readonly mode?: string | object
  ) {}
}

export type Actions =
  | SortUpdateAction
  | CurrentJobAction
  | SubmitAction
  | FailedAction
  | SubmitCompleteAction
  | SearchIDAction
  | SearchIDCompleteAction
  | SearchIDFailedAction
  | RetrieveCompleteAction;
