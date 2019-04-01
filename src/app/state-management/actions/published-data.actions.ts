import { Action } from "@ngrx/store";
import { Update } from "@ngrx/entity";
import { PublishedData } from "state-management/models";

export enum PublishedDataActionTypes {
  RequestPublishedData = "[PublishedData] Request PublishedDatas",
  LoadPublishedDatas = "[PublishedData] Load PublishedDatas",
  AddPublishedData = "[PublishedData] Add PublishedData",
  UpsertPublishedData = "[PublishedData] Upsert PublishedData",
  AddPublishedDatas = "[PublishedData] Add PublishedDatas",
  UpsertPublishedDatas = "[PublishedData] Upsert PublishedDatas",
  UpdatePublishedData = "[PublishedData] Update PublishedData",
  UpdatePublishedDatas = "[PublishedData] Update PublishedDatas",
  DeletePublishedData = "[PublishedData] Delete PublishedData",
  DeletePublishedDatas = "[PublishedData] Delete PublishedDatas",
  ClearPublishedDatas = "[PublishedData] Clear PublishedDatas"
}

export class RequestPublishedData implements Action {
  readonly type = PublishedDataActionTypes.RequestPublishedData;

  constructor(public payload: { id: number }) {}
}

export class LoadPublishedDatas implements Action {
  readonly type = PublishedDataActionTypes.LoadPublishedDatas;

  constructor(public payload: { publishedDatas: PublishedData[] }) {}
}

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

export type PublishedDataActions =
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
  | RequestPublishedData;
