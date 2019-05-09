import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { PublishedDataApi } from "shared/sdk/services";


import {
  FailedPublishedDataAction,
  LoadPublishedDatas,
  AddPublishedData,
  FetchAllPublishedData,
  FetchPublishedData,
  PublishedDataActionTypes,
  UpsertPublishedDatas
} from "../actions/published-data.actions";

import {
  catchError,
  map,
  switchMap,
  mergeMap
} from "rxjs/operators";
import { PublishedData } from "shared/sdk/models";

@Injectable()
export class PublishedDataEffects {
  
  // this needs work, doesnt do both a create and a register
  @Effect()
  UpsertPublishedDatas$ = this.actions$.pipe(
    ofType<UpsertPublishedDatas>(PublishedDataActionTypes.UpsertPublishedDatas),
    switchMap(action => this.publishedDataApi.create(action.payload.publishedDatas)
    .pipe(mergeMap((data: PublishedData[]) => [ new UpsertPublishedDatas({ publishedDatas: data }),
      this.publishedDataApi.register(data[0].doi)]),
    catchError(err => of(new FailedPublishedDataAction(err)))))
  );

  // add referes to adding to the store, not mongo
  @Effect()
  AddPublishedData$ = this.actions$.pipe(
    ofType<FetchPublishedData>(PublishedDataActionTypes.FetchPublishedData),
    switchMap(action => this.publishedDataApi.findById(action.payload.id)
    .pipe(map((data: PublishedData) => new AddPublishedData({ publishedData: data })),
    catchError(err => of(new FailedPublishedDataAction(err)))))
  );

  @Effect()
  LoadPublishedDatas$ = this.actions$.pipe(
    ofType<FetchAllPublishedData>(PublishedDataActionTypes.FetchAllPublishedData),
    switchMap(action => this.publishedDataApi.find()
    .pipe(map((data: PublishedData[]) => new LoadPublishedDatas({ publishedDatas: data })),
    catchError(err => of(new FailedPublishedDataAction(err)))))
  );

  constructor(
    private actions$: Actions,
    private publishedDataApi: PublishedDataApi
  ) {}
}
