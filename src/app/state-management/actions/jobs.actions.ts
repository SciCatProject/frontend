import {Action} from '@ngrx/store';

import * as lb from 'shared/sdk/models';

export const SUBMIT = '[Jobs] Submit';
export const RETRIEVE = '[Jobs] Retrieve';
export const SUBMIT_COMPLETE = '[Jobs] Submit Complete';
export const FAILED = '[Jobs] Action Failed';
export const RETRIEVE_COMPLETE = '[Jobs] Retrieve Complete';
export const UI_STORE = '[Jobs] UI Store';
export const CHILD_RETRIEVE = '[Jobs] Child Retrieve';
export const CHILD_RETRIEVE_COMPLETE = '[Jobs] Child Retrieve Complete';
export const SEARCH_ID = '[Jobs] Search ID';
export const SEARCH_ID_COMPLETE = '[Jobs] Search ID Complete';
export const SEARCH_ID_FAILED = '[Jobs] Search ID Failed';
export const SELECT_CURRENT = '[Jobs] Current set selected';

export const SORT_UPDATE = '[Jobs]  Sort Update';
export const SORT_UPDATE_COMPLETE = '[Jobs]  Sort Update Complete';
export const SORT_VALUE_UPDATE = '[Jobs]  Sort Update';
export const SORT_FAILED = '[Jobs]  Sort Failed';

export class SubmitAction implements Action {
  readonly type = SUBMIT;

  constructor(public payload?: any) {
  }
}

export class RetrieveAction implements Action {
  readonly type = RETRIEVE;

  constructor(public payload?: any) {
  }
}

export class UIStoreAction implements Action {
  readonly type = UI_STORE;

  constructor(public payload?: any) {
  }
}

export class SubmitCompleteAction implements Action {
  readonly type = SUBMIT_COMPLETE;

  constructor(public payload?: any) {
  }
}

export class FailedAction implements Action {
  readonly type = FAILED;

  constructor(public payload?: any) {
  }
}

export class RetrieveCompleteAction implements Action {
  readonly type = RETRIEVE_COMPLETE;

  constructor(public payload?: any) {
  }
}

export class ChildRetrieveAction implements Action {
  readonly type = CHILD_RETRIEVE;

  constructor(public payload?: any) {
  }
}

export class ChildRetrieveCompleteAction implements Action {
  readonly type = CHILD_RETRIEVE_COMPLETE;

  constructor(public payload?: any) {
  }
}


export class SearchIDAction implements Action {
  readonly type = SEARCH_ID;

  constructor() {
  }
}

export class SearchIDCompleteAction implements Action {
  readonly type = SEARCH_ID_COMPLETE;

  constructor() {
  }
}

export class SearchIDFailedAction implements Action {
  readonly type = SEARCH_ID_FAILED;

  constructor() {
  }
}

export class CurrentSetAction implements Action {
  readonly type = SELECT_CURRENT;

  constructor(public payload: lb.Job) {
  }
}

export class SortUpdateAction implements Action {
  readonly type = SORT_UPDATE;

  constructor(public payload: lb.Job) {
  }
}

export class UpdateSortCompleteAction implements Action {
  readonly type = SORT_UPDATE_COMPLETE;

  constructor(public payload: lb.Job) {
  }
}

export class SortFailedAction implements Action {
  readonly type = SORT_FAILED;

  constructor() {
  }
}

export class SortValueAction implements Action {
  readonly type = SORT_VALUE_UPDATE;

  constructor(public payload?: any) {
  }
}


export type Actions =
  SortUpdateAction |
  UpdateSortCompleteAction |
  SortFailedAction |
  SortValueAction |
  CurrentSetAction |
  SubmitAction |
  FailedAction |
  SubmitCompleteAction |
  SearchIDAction | SearchIDCompleteAction |
  SearchIDFailedAction |
  RetrieveAction |
  RetrieveCompleteAction;
