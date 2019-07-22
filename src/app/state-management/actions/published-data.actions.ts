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
  FetchCountPublishedData = "[PublishedData] Fetch count",
  LoadCurrentPublishedData = "[PublishedData] Load Current Published Data",
  UpsertWaitPublishedData = "[PublishedData] Upsert Wait Published Data",
  RegisterPublishedData = "[PublishedData] Register Published Data",
  SuccessPublishedData = "[PublishedData] Success Published Data"
}

// because NGRX is a constant work in progress
export interface CustomAction extends Action {
  type: string;
  payload?: any;
  }

// universal error action
export class FailedPublishedDataAction implements CustomAction {
  readonly type = PublishedDataActionTypes.FailedPublishedDataAction;

  constructor(public payload: { err: string }) {}
}

// trigger effect that will get one record from db
export class FetchPublishedData implements CustomAction {
  readonly type = PublishedDataActionTypes.FetchPublishedData;
  constructor(public payload: { id: string }) {}
}

// trigger effect that will get all records from db
export class FetchAllPublishedData implements CustomAction {
  readonly type = PublishedDataActionTypes.FetchAllPublishedData;
  constructor() {}
}

// add multiple records to store
export class LoadPublishedDatas implements CustomAction {
  readonly type = PublishedDataActionTypes.LoadPublishedDatas;

  constructor(public payload: { publishedDatas: PublishedData[] }) {}
}

// add just one record to store
export class AddPublishedData implements CustomAction {
  readonly type = PublishedDataActionTypes.AddPublishedData;

  constructor(public payload: { publishedData: PublishedData }) {}
}

export class LoadCurrentPublishedData implements CustomAction {
  readonly type = PublishedDataActionTypes.LoadCurrentPublishedData;

  constructor(public payload: { publishedData: PublishedData }) {}
}

export class UpsertPublishedData implements CustomAction {
  readonly type = PublishedDataActionTypes.UpsertPublishedData;

  constructor(public payload: { publishedData: PublishedData }) {}
}

export class UpsertWaitPublishedData implements CustomAction {
  readonly type = PublishedDataActionTypes.UpsertWaitPublishedData;

  constructor(public payload: { publishedData: PublishedData }) {}
}

export class AddPublishedDatas implements Action {
  readonly type = PublishedDataActionTypes.AddPublishedDatas;

  constructor(public payload: { publishedDatas: PublishedData[] }) {}
}

export class UpsertPublishedDatas implements CustomAction {
  readonly type = PublishedDataActionTypes.UpsertPublishedDatas;
  constructor(public payload: { publishedDatas: PublishedData[] }) {}
}



export class UpdatePublishedData implements CustomAction {
  readonly type = PublishedDataActionTypes.UpdatePublishedData;

  constructor(public payload: { publishedData: Update<PublishedData> }) {}
}

export class UpdatePublishedDatas implements CustomAction {
  readonly type = PublishedDataActionTypes.UpdatePublishedDatas;

  constructor(public payload: { publishedDatas: Update<PublishedData>[] }) {}
}

export class DeletePublishedData implements CustomAction {
  readonly type = PublishedDataActionTypes.DeletePublishedData;

  constructor(public payload: { id: string }) {}
}

export class DeletePublishedDatas implements CustomAction {
  readonly type = PublishedDataActionTypes.DeletePublishedDatas;

  constructor(public payload: { ids: string[] }) {}
}

export class ClearPublishedDatas implements CustomAction {
  readonly type = PublishedDataActionTypes.ClearPublishedDatas;
}

export class ChangePagePub implements CustomAction {
  readonly type = PublishedDataActionTypes.ChangePagePub;
  constructor(public payload: { page: number, limit: number }) {}
}


export class FetchCountPublishedData implements CustomAction {
  readonly type = PublishedDataActionTypes.FetchCountPublishedData;
  constructor(public payload: { count: number }) {}
}

export class RegisterPublishedData implements CustomAction {
  readonly type = PublishedDataActionTypes.RegisterPublishedData;
  constructor(public payload: { doi: string }) {}
}

// i dont like this but i need an action that does nothing
export class SuccessPublishedData implements CustomAction {
  readonly type = PublishedDataActionTypes.SuccessPublishedData;
  constructor(public payload: { data: any }) {}
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
  | FetchCountPublishedData
  | LoadCurrentPublishedData
  | UpsertWaitPublishedData
  | RegisterPublishedData
  | SuccessPublishedData;
