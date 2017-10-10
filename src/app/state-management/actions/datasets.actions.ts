import {Injectable} from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {DatasetFilters} from 'datasets/datasets-filter/dataset-filters';
import {Observable} from 'rxjs/Observable';
import * as lb from 'shared/sdk/models';

export const LOAD = '[Dataset] Load';

export const SEARCH = '[Dataset] Search';
export const SEARCH_COMPLETE = '[Dataset] Search Complete';
export const SEARCH_FAILED = '[Dataset] Search Failed';

export const SEARCH_ID = '[Dataset] Search ID';
export const SEARCH_ID_COMPLETE = '[Dataset] Search ID Complete';
export const SEARCH_ID_FAILED = '[Dataset] Search ID Failed';

export const FILTER_UPDATE = '[Dataset]  Filter Update';
export const FILTER_UPDATE_COMPLETE = '[Dataset]  Filter Update Complete';
export const FILTER_VALUE_UPDATE = '[Dataset]  Filter Update';
export const FILTER_FAILED = '[Dataset]  Filter Failed';

export const DATABLOCKS = '[Dataset]  Datablocks Update';
export const DATABLOCKS_COMPLETE = '[Dataset]  Datablocks Update Complete';
export const DATABLOCKS_FAILED = '[Dataset]  Datablocks Failed';

export const ADD_GROUPS = '[User] Add Groups';
export const ADD_GROUPS_COMPLETE = '[User] Add Groups Complete';
export const ADD_GROUPS_FAILED = '[User] Add Groups Failed';

export const SELECT_CURRENT = '[Dataset] Current set selected';

export const SELECTED_UPDATE = '[Dataset]  Selected Datasets Update';
// export const FILTER_UPDATE_COMPLETE = '[Dataset]  Filter Update Complete';

export class SearchAction implements Action {
  readonly type = SEARCH;

  constructor(public payload: string) {}
  }
export class SearchCompleteAction implements Action {
  readonly type = SEARCH_COMPLETE;

  constructor(public payload: lb.RawDataset[]) {}
  }
export class SearchFailedAction implements Action {
  readonly type = SEARCH_FAILED;

  constructor() {}
  }

export class UpdateFilterAction implements Action {
  readonly type = FILTER_UPDATE;

  constructor(public payload: DatasetFilters) {}
  }
export class UpdateFilterCompleteAction implements Action {
  readonly type = FILTER_UPDATE_COMPLETE;

  constructor(public payload: DatasetFilters) {}
  }
export class FilterFailedAction implements Action {
  readonly type = FILTER_FAILED;

  constructor() {}
  }
export class FilterValueAction implements Action {
  readonly type = FILTER_VALUE_UPDATE;

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

export class DatablocksAction implements Action {
  readonly type = DATABLOCKS;

  constructor() {}
  }
export class DatablocksCompleteAction implements Action {
  readonly type = DATABLOCKS_COMPLETE;

  constructor() {}
  }
export class DatablocksFailedAction implements Action {
  readonly type = DATABLOCKS_FAILED;

  constructor() {}
  }

export class AddGroupsAction implements Action {
  readonly type = ADD_GROUPS;

  constructor(public payload: lb.User) {}
  }
export class AddGroupsCompleteAction implements Action {
  readonly type = ADD_GROUPS_COMPLETE;

  constructor(public payload: lb.AccessGroup[]) {}
  }
export class AddGroupsFailedAction implements Action {
  readonly type = ADD_GROUPS_FAILED;

  constructor(public payload: any) {}
  }

export class UpdateSelectedAction implements Action {
  readonly type = SELECTED_UPDATE;

  constructor(public payload: any) {}
  }

export class CurrentSetAction implements Action {
  readonly type = SELECT_CURRENT;

  constructor(public payload: lb.RawDataset) {}
  }

export type Actions =
    SearchAction | SearchCompleteAction | SearchFailedAction |
    UpdateFilterAction | UpdateFilterCompleteAction | FilterFailedAction |
    FilterValueAction | SearchIDAction | SearchIDCompleteAction |
    SearchIDFailedAction | DatablocksAction | DatablocksCompleteAction |
    DatablocksAction | AddGroupsAction | AddGroupsCompleteAction |
    AddGroupsFailedAction | UpdateSelectedAction;
