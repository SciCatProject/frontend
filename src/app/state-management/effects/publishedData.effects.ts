import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, select, Store } from "@ngrx/store";
import { PublishedDataApi } from "shared/sdk/services";

import {LoadPublishedDatas, AddPublishedData, RequestPublishedData, PublishedDataActionTypes} from "../actions/published-data.actions";

import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom
} from "rxjs/operators";
import { PublishedData } from "state-management/models";

@Injectable()
export class PublishedDataEffects {

  @Effect()
  LoadPublishedDatas$ = this.actions$
    .pipe(
      ofType<RequestPublishedData>(PublishedDataActionTypes.RequestPublishedData),
      mergeMap(action => this.publishedDataApi.findById(action.payload.id)),
      map(PublishedData => new AddPublishedData({PublishedData}))
    );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private publishedDataApi: PublishedDataApi,
  ) {}
}
