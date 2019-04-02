import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, select, Store } from "@ngrx/store";
import { PublishedDataApi } from "shared/sdk/services";

import {
  LoadPublishedDatas,
  AddPublishedData,
  FetchAllPublishedData,
  FetchPublishedData,
  PublishedDataActionTypes
} from "../actions/published-data.actions";

import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
  tap
} from "rxjs/operators";
import { PublishedData } from "shared/sdk/models";

@Injectable()
export class PublishedDataEffects {
  @Effect()
  AddPublishedData$ = this.actions$.pipe(
    ofType<FetchPublishedData>(PublishedDataActionTypes.FetchPublishedData),
    mergeMap(action => this.publishedDataApi.findById(action.payload.id)),
    map((data: PublishedData) => new AddPublishedData({ publishedData: data }))
  );

  @Effect()
  LoadPublishedDatas$ = this.actions$.pipe(
    ofType<FetchAllPublishedData>(
      PublishedDataActionTypes.FetchAllPublishedData
    ),
    mergeMap(action => this.publishedDataApi.find()),
    map(
      (data: PublishedData[]) =>
        new LoadPublishedDatas({ publishedDatas: data })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private publishedDataApi: PublishedDataApi
  ) {}
}
