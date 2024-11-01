import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, concatLatestFrom } from "@ngrx/effects";
import {
  PublishedData,
  PublishedDataService,
} from "@scicatproject/scicat-sdk-ts";
import { Store } from "@ngrx/store";
import {
  selectCurrentPublishedData,
  selectQueryParams,
} from "state-management/selectors/published-data.selectors";
import * as fromActions from "state-management/actions/published-data.actions";
import {
  mergeMap,
  map,
  catchError,
  switchMap,
  exhaustMap,
  filter,
} from "rxjs/operators";
import { of } from "rxjs";
import { MessageType } from "state-management/models";
import {
  showMessageAction,
  loadingAction,
  loadingCompleteAction,
} from "state-management/actions/user.actions";
import { Router } from "@angular/router";

@Injectable()
export class PublishedDataEffects {
  private queryParams$ = this.store.select(selectQueryParams);

  fetchAllPublishedData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchAllPublishedDataAction,
        fromActions.sortByColumnAction,
        fromActions.changePageAction,
      ),
      concatLatestFrom(() => this.queryParams$),
      map(([action, params]) => params),
      mergeMap((params) =>
        this.publishedDataService
          // TODO: Check the types here on the backend as it is wrong generated
          .publishedDataControllerFindAll("", "", JSON.stringify(params))
          .pipe(
            mergeMap((publishedData) => [
              fromActions.fetchAllPublishedDataCompleteAction({
                publishedData,
              }),
              fromActions.fetchCountAction(),
            ]),
            catchError(() =>
              of(fromActions.fetchAllPublishedDataFailedAction()),
            ),
          ),
      ),
    );
  });

  fetchCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchCountAction),
      switchMap(() =>
        this.publishedDataService.publishedDataControllerCount().pipe(
          // TODO: The type on the backend should be improved as there is not ApiResponse type.
          map(({ count }: { count: number }) =>
            fromActions.fetchCountCompleteAction({ count }),
          ),
          catchError(() => of(fromActions.fetchCountFailedAction())),
        ),
      ),
    );
  });

  fetchPublishedData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchPublishedDataAction),
      switchMap(({ id }) =>
        this.publishedDataService
          .publishedDataControllerFindOne(encodeURIComponent(id))
          .pipe(
            map((publishedData: PublishedData) =>
              fromActions.fetchPublishedDataCompleteAction({ publishedData }),
            ),
            catchError(() => of(fromActions.fetchPublishedDataFailedAction())),
          ),
      ),
    );
  });

  navigateToResyncedPublishedData$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromActions.resyncPublishedDataCompleteAction),
        concatLatestFrom(() => this.store.select(selectCurrentPublishedData)),
        filter(([_, publishedData]) => !!publishedData),
        exhaustMap(([_, publishedData]) =>
          this.router.navigateByUrl(
            "/publishedDatasets/" + encodeURIComponent(publishedData!.doi),
          ),
        ),
      );
    },
    { dispatch: false },
  );

  publishDataset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.publishDatasetAction),
      switchMap(({ data }) =>
        this.publishedDataService.publishedDataControllerCreate(data).pipe(
          mergeMap((publishedData) => [
            fromActions.publishDatasetCompleteAction({ publishedData }),
            fromActions.fetchPublishedDataAction({ id: publishedData.doi }),
          ]),
          catchError(() => of(fromActions.publishDatasetFailedAction())),
        ),
      ),
    );
  });

  publishDatasetCompleteMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.publishDatasetCompleteAction),
      switchMap(() => {
        const message = {
          type: MessageType.Success,
          content: "Publication Successful",
          duration: 5000,
        };
        return of(showMessageAction({ message }));
      }),
    );
  });

  publishDatasetFailedMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.publishDatasetFailedAction),
      switchMap(() => {
        const message = {
          type: MessageType.Error,
          content: "Publication Failed",
          duration: 5000,
        };
        return of(showMessageAction({ message }));
      }),
    );
  });

  registerPublishedData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.registerPublishedDataAction),
      switchMap(({ doi }) =>
        this.publishedDataService
          .publishedDataControllerRegister(encodeURIComponent(doi))
          .pipe(
            mergeMap((publishedData: PublishedData) => [
              fromActions.registerPublishedDataCompleteAction({
                publishedData,
              }),
              fromActions.fetchPublishedDataAction({ id: doi }),
            ]),
            catchError(() =>
              of(fromActions.registerPublishedDataFailedAction()),
            ),
          ),
      ),
    );
  });

  resyncPublishedData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.resyncPublishedDataAction),
      switchMap(({ doi, data }) =>
        this.publishedDataService
          // @ts-expect-error TODO: Check the backend type as it needs to be fixed and the sdk should be re-generated
          .publishedDataControllerResync(encodeURIComponent(doi), data)
          .pipe(
            mergeMap((publishedData) => [
              fromActions.resyncPublishedDataCompleteAction(publishedData),
              fromActions.fetchPublishedDataAction({ id: doi }),
            ]),
            catchError(() => of(fromActions.resyncPublishedDataFailedAction())),
          ),
      ),
    );
  });

  registerPublishedDataFailedMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.registerPublishedDataFailedAction),
      switchMap(() => {
        const message = {
          type: MessageType.Error,
          content: "Registration Failed",
          duration: 5000,
        };
        return of(showMessageAction({ message }));
      }),
    );
  });

  loading$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchAllPublishedDataAction,
        fromActions.fetchCountAction,
        fromActions.sortByColumnAction,
        fromActions.fetchPublishedDataAction,
        fromActions.publishDatasetAction,
        fromActions.registerPublishedDataAction,
        fromActions.resyncPublishedDataCompleteAction,
      ),
      switchMap(() => of(loadingAction())),
    );
  });

  loadingComplete$ = createEffect(() => {
    return this.actions$.pipe(
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
        fromActions.registerPublishedDataFailedAction,
        fromActions.resyncPublishedDataCompleteAction,
      ),
      switchMap(() => of(loadingCompleteAction())),
    );
  });

  constructor(
    private actions$: Actions,
    private publishedDataService: PublishedDataService,
    private router: Router,
    private store: Store,
  ) {}
}
