import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { PublishedDataApi } from "shared/sdk/services";
import { select, Store } from "@ngrx/store";


import {
  FailedPublishedDataAction,
  LoadPublishedDatas,
  FetchAllPublishedData,
  FetchCountPublishedData,
  FetchPublishedData,
  PublishedDataActionTypes,
  UpsertPublishedDatas,
  LoadCurrentPublishedData
} from "../actions/published-data.actions";

import {
  catchError,
  map,
  switchMap,
  mergeMap,
  withLatestFrom,
} from "rxjs/operators";
import { PublishedData } from "shared/sdk/models";
import { getFilters } from "state-management/selectors/published-data.selectors";

@Injectable()
export class PublishedDataEffects {

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
    switchMap(action => this.publishedDataApi.findById(encodeURIComponent(action.payload.id))
    .pipe(map((data: PublishedData) => new LoadCurrentPublishedData({ publishedData: data })),
    catchError(err => of(new FailedPublishedDataAction(err)))))
  );

  @Effect({ dispatch: false })
  private queryParams$ = this.store.pipe(select(getFilters));

  @Effect()
  FetchFilteredPublishedData$ = this.actions$.pipe(
    ofType<FetchAllPublishedData>(PublishedDataActionTypes.FetchAllPublishedData, PublishedDataActionTypes.ChangePagePub),
    withLatestFrom(this.queryParams$),
    map(([action, params]) => params),
    mergeMap(({ limits }) => this.publishedDataApi.find(limits)
    .pipe(map((data: PublishedData[]) => new LoadPublishedDatas({ publishedDatas: data })),
    catchError(err => of(new FailedPublishedDataAction(err))))));

    @Effect()
    FetchCountPublishedData$ = this.actions$.pipe(
      ofType<FetchAllPublishedData>(PublishedDataActionTypes.FetchAllPublishedData),
      switchMap(action => this.publishedDataApi.count()
      .pipe(map((count) => new FetchCountPublishedData(count)),
      catchError(err => of(new FailedPublishedDataAction(err)))))
    );

  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private publishedDataApi: PublishedDataApi
  ) {}
}
