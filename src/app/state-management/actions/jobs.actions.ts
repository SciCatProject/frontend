import { Action, Store } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as lb from 'shared/sdk/models';

export const SUBMIT = '[Jobs] Submit';
export const RETRIEVE = '[Jobs] Retrieve';
export const SUBMIT_COMPLETE = '[Jobs] Submit Complete';
export const RETRIEVE_COMPLETE = '[Jobs] Retrieve Complete';
export const UI_STORE = '[Jobs] UI Store';
export const CHILD_RETRIEVE = '[Jobs] Child Retrieve';
export const CHILD_RETRIEVE_COMPLETE = '[Jobs] Child Retrieve Complete';
export const SEARCH_ID = '[Jobs] Search ID';
export const SEARCH_ID_COMPLETE = '[Jobs] Search ID Complete';
export const SEARCH_ID_FAILED = '[Jobs] Search ID Failed';
export const SELECT_CURRENT = '[Dataset] Current set selected';

export class SubmitAction implements Action {
  readonly type = SUBMIT;

  constructor(public payload?: any) { }
}
export class RetrieveAction implements Action {
  readonly type = RETRIEVE;

  constructor() { }
}
export class UIStoreAction implements Action {
  readonly type = UI_STORE;

  constructor(public payload?: any) { }
}
export class SubmitCompleteAction implements Action {
  readonly type = SUBMIT_COMPLETE;

  constructor(public payload?: any) { }
}
export class RetrieveCompleteAction implements Action {
  readonly type = RETRIEVE_COMPLETE;

  constructor(public payload?: any) { }
}
export class ChildRetrieveAction implements Action {
  readonly type = CHILD_RETRIEVE;

  constructor(public payload?: any) {}
}
export class ChildRetrieveCompleteAction implements Action {
  readonly type = CHILD_RETRIEVE_COMPLETE;

  constructor(public payload?: any) {}
}


export class SearchIDAction implements Action {
  readonly type = SEARCH_ID;

  constructor() {}
}
export class SearchIDCompleteAction implements Action {
  readonly type = SEARCH_ID_COMPLETE;

  constructor() {}
}
export class SearchIDFailedAction implements Action {
  readonly type = SEARCH_ID_FAILED;

  constructor() {}
}

export class CurrentSetAction implements Action {
  readonly type = SELECT_CURRENT;

  constructor(public payload: lb.RawDataset) {}
}


export type Actions =
  SubmitAction |
  SubmitCompleteAction |
  SearchIDAction | SearchIDCompleteAction |
  SearchIDFailedAction |
  RetrieveAction|
  RetrieveCompleteAction;
