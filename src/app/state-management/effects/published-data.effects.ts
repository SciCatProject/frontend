import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { PublishedDataApi, PublishedData } from "shared/sdk";
import { Store, select } from "@ngrx/store";
import { getQueryParams } from "state-management/selectors/published-data.selectors";
import * as fromActions from "state-management/actions/published-data.actions";
import {
  withLatestFrom,
  mergeMap,
  map,
  catchError,
  switchMap
} from "rxjs/operators";
import { of } from "rxjs";
import { MessageType } from "state-management/models";
import {
  showMessageAction,
  loadingAction,
  loadingCompleteAction
} from "state-management/actions/user.actions";

@Injectable()
export class PublishedDataEffects {
  private queryParams$ = this.store.pipe(select(getQueryParams));

  fetchAllPublishedData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.fetchAllPublishedDataAction,
        fromActions.sortByColumnAction,
        fromActions.changePageAction
      ),
      withLatestFrom(this.queryParams$),
      map(([action, params]) => params),
      mergeMap(params =>
        this.publishedDataApi.find(params).pipe(
          mergeMap((publishedData: PublishedData[]) => [
            fromActions.fetchAllPublishedDataCompleteAction({ publishedData }),
            fromActions.fetchCountAction()
          ]),
          catchError(() => of(fromActions.fetchAllPublishedDataFailedAction()))
        )
      )
    )
  );

  fetchCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchCountAction),
      switchMap(() =>
        this.publishedDataApi.count().pipe(
          map(({ count }) => fromActions.fetchCountCompleteAction({ count })),
          catchError(() => of(fromActions.fetchCountFailedAction()))
        )
      )
    )
  );

  fetchPublishedData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchPublishedDataAction),
      switchMap(({ id }) =>
        this.publishedDataApi.findById(encodeURIComponent(id)).pipe(
          map((publishedData: PublishedData) =>
            fromActions.fetchPublishedDataCompleteAction({ publishedData })
          ),
          catchError(() => of(fromActions.fetchPublishedDataFailedAction()))
        )
      )
    )
  );

  publishDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.publishDatasetAction),
      switchMap(({ data }) =>
        this.publishedDataApi.create(data).pipe(
          mergeMap((publishedData: PublishedData) => [
            fromActions.publishDatasetCompleteAction({ publishedData }),
            fromActions.fetchPublishedDataAction({ id: publishedData.doi }),
          ]),
          catchError(() => of(fromActions.publishDatasetFailedAction()))
        )
      )
    )
  );

  publishDatasetCompleteMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.publishDatasetCompleteAction),
      switchMap(() => {
        const message = {
          type: MessageType.Success,
          content: "Publication Successful",
          duration: 5000
        };
        return of(showMessageAction({ message }));
      })
    )
  );

  publishDatasetFailedMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.publishDatasetFailedAction),
      switchMap(() => {
        const message = {
          type: MessageType.Error,
          content: "Publication Failed",
          duration: 5000
        };
        return of(showMessageAction({ message }));
      })
    )
  );

  registerPublishedData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.registerPublishedDataAction),
      switchMap(({ doi }) =>
        this.publishedDataApi.register(encodeURIComponent(doi)).pipe(
          mergeMap((publishedData) => [
            fromActions.registerPublishedDataCompleteAction({ publishedData }),
            fromActions.fetchPublishedDataAction({ id: doi }),
          ]),
          catchError(() => of(fromActions.registerPublishedDataFailedAction()))
        )
      )
    )
  );

  registerPublishedDataFailedMessage$ = createEffect(() =>
  this.actions$.pipe(
    ofType(fromActions.registerPublishedDataFailedAction),
    switchMap(() => {
      const message = {
        type: MessageType.Error,
        content: "Registration Failed",
        duration: 5000
      };
      return of(showMessageAction({ message }));
    })
  )
);

  loading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.fetchAllPublishedDataAction,
        fromActions.fetchCountAction,
        fromActions.sortByColumnAction,
        fromActions.fetchPublishedDataAction,
        fromActions.publishDatasetAction,
        fromActions.registerPublishedDataAction
      ),
      switchMap(() => of(loadingAction()))
    )
  );

  loadingComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.fetchAllPublishedDataCompleteAction,
        fromActions.fetchAllPublishedDataFailedAction,
        fromActions.fetchCountCompleteAction,
        fromActions.fetchCountFailedAction,
        fromActions.fetchPublishedDataCompleteAction,
        fromActions.fetchPublishedDataFailedAction,
        fromActions.publishDatasetCompleteAction,
        fromActions.publishDatasetFailedAction,
        fromActions.registerPublishedDataCompleteAction,
        fromActions.registerPublishedDataFailedAction
      ),
      switchMap(() => of(loadingCompleteAction()))
    )
  );

  constructor(
    private actions$: Actions,
    private publishedDataApi: PublishedDataApi,
    private store: Store<PublishedData>
  ) {}
}
