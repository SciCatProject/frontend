import { Action } from "@ngrx/store";
import { Update } from "@ngrx/entity";
import { PublishedData } from "state-management/models";

export enum PublishedDataActionTypes {
  FailedPublishedDataAction = "[PublishedData] Failed PublishedData Action",
  FetchAllPublishedData = "[PublishedData] Fetch all PublishedDatas",
  FetchPublishedData = "[PublishedData] Fetch PublishedDatas",
  LoadPublishedDatas = "[PublishedData] Load PublishedDatas",
  AddPublishedData = "[PublishedData] Add PublishedData",
  UpsertPublishedData = "[PublishedData] Upsert PublishedData",
  AddPublishedDatas = "[PublishedData] Add PublishedDatas",
  UpsertPublishedDatas = "[PublishedData] Upsert PublishedDatas",
  UpdatePublishedData = "[PublishedData] Update PublishedData",
  UpdatePublishedDatas = "[PublishedData] Update PublishedDatas",
  DeletePublishedData = "[PublishedData] Delete PublishedData",
  DeletePublishedDatas = "[PublishedData] Delete PublishedDatas",
  ClearPublishedDatas = "[PublishedData] Clear PublishedDatas",
  ChangePagePub = "[PublishedData] Change Page Pub",
  FetchCountPublishedData = "[PublishedData] Fetch count"
}

// universal error action
export class FailedPublishedDataAction implements Action {
  readonly type = PublishedDataActionTypes.FailedPublishedDataAction;

  constructor(public payload: { err: string }) {}
}

// trigger effect that will get one record from db
export class FetchPublishedData implements Action {
  readonly type = PublishedDataActionTypes.FetchPublishedData;

  constructor(public payload: { id: string }) {}
}

// trigger effect that will get all records from db
export class FetchAllPublishedData implements Action {
  readonly type = PublishedDataActionTypes.FetchAllPublishedData;
  constructor() {}
}

// add multiple records to store
export class LoadPublishedDatas implements Action {
  readonly type = PublishedDataActionTypes.LoadPublishedDatas;

  constructor(public payload: { publishedDatas: PublishedData[] }) {}
}

// add just one record to store
export class AddPublishedData implements Action {
  readonly type = PublishedDataActionTypes.AddPublishedData;

  constructor(public payload: { publishedData: PublishedData }) {}
}

export class UpsertPublishedData implements Action {
  readonly type = PublishedDataActionTypes.UpsertPublishedData;

  constructor(public payload: { publishedData: PublishedData }) {}
}

export class AddPublishedDatas implements Action {
  readonly type = PublishedDataActionTypes.AddPublishedDatas;

  constructor(public payload: { publishedDatas: PublishedData[] }) {}
}

export class UpsertPublishedDatas implements Action {
  readonly type = PublishedDataActionTypes.UpsertPublishedDatas;

  constructor(public payload: { publishedDatas: PublishedData[] }) {}
}

export class UpdatePublishedData implements Action {
  readonly type = PublishedDataActionTypes.UpdatePublishedData;

  constructor(public payload: { publishedData: Update<PublishedData> }) {}
}

export class UpdatePublishedDatas implements Action {
  readonly type = PublishedDataActionTypes.UpdatePublishedDatas;

  constructor(public payload: { publishedDatas: Update<PublishedData>[] }) {}
}

export class DeletePublishedData implements Action {
  readonly type = PublishedDataActionTypes.DeletePublishedData;

  constructor(public payload: { id: string }) {}
}

export class DeletePublishedDatas implements Action {
  readonly type = PublishedDataActionTypes.DeletePublishedDatas;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearPublishedDatas implements Action {
  readonly type = PublishedDataActionTypes.ClearPublishedDatas;
}

export class ChangePagePub implements Action {
  readonly type = PublishedDataActionTypes.ChangePagePub;
  constructor(public payload: { page: number, limit: number }) {}
}


export class FetchCountPublishedData implements Action {
  readonly type = PublishedDataActionTypes.FetchCountPublishedData;
  constructor(public payload: { count: number }) {}
}

export type PublishedDataActions =
  FailedPublishedDataAction
  | LoadPublishedDatas
  | AddPublishedData
  | UpsertPublishedData
  | AddPublishedDatas
  | UpsertPublishedDatas
  | UpdatePublishedData
  | UpdatePublishedDatas
  | DeletePublishedData
  | DeletePublishedDatas
  | ClearPublishedDatas
  | FetchPublishedData
  | ChangePagePub
  | FetchAllPublishedData
  | FetchCountPublishedData;
