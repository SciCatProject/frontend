import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import {
  PublishedData,
  PublishedDataService,
} from "@scicatproject/scicat-sdk-ts-angular";
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
          .publishedDataControllerFindAllV3("", "", JSON.stringify(params))
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
        this.publishedDataService.publishedDataControllerCountV3().pipe(
          map(({ count }) => fromActions.fetchCountCompleteAction({ count })),
          catchError(() => of(fromActions.fetchCountFailedAction())),
        ),
      ),
    );
  });

  fetchPublishedData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchPublishedDataAction),
      switchMap(({ id }) =>
        this.publishedDataService.publishedDataControllerFindOneV3(id).pipe(
          map((publishedData: PublishedData) =>
            fromActions.fetchPublishedDataCompleteAction({
              publishedData,
            }),
          ),
          catchError(() => of(fromActions.fetchPublishedDataFailedAction())),
        ),
      ),
    );
  });

  fetchPublishedDataConfig$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchPublishedDataConfigAction),
      switchMap(() =>
        this.publishedDataService.publishedDataControllerGetConfigV3().pipe(
          map((publishedDataConfig) =>
            fromActions.fetchPublishedDataConfigCompleteAction({
              publishedDataConfig,
            }),
          ),
          catchError(() =>
            of(fromActions.fetchPublishedDataConfigFailedAction()),
          ),
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
            "/publishedDatasets/" + encodeURIComponent(publishedData.doi),
          ),
        ),
      );
    },
    { dispatch: false },
  );

  createDataPublication$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.createDataPublicationAction),
      switchMap(({ data }) =>
        this.publishedDataService.publishedDataControllerCreateV3(data).pipe(
          mergeMap((publishedData) => [
            fromActions.createDataPublicationCompleteAction({ publishedData }),
            fromActions.fetchPublishedDataAction({ id: publishedData.doi }),
          ]),
          catchError(() => of(fromActions.createDataPublicationFailedAction())),
        ),
      ),
    );
  });

  publishPublishedData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.publishPublishedDataAction),
      switchMap(({ doi }) =>
        this.publishedDataService.publishedDataControllerPublishV3(doi).pipe(
          mergeMap((publishedData) => [
            fromActions.publishPublishedDataCompleteAction({ publishedData }),
          ]),
          catchError(() => of(fromActions.publishPublishedDataFailedAction())),
        ),
      ),
    );
  });

  createDataPublicationCompleteMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.createDataPublicationCompleteAction),
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

  createDataPublicationFailedMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.createDataPublicationFailedAction),
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
        this.publishedDataService.publishedDataControllerRegisterV3(doi).pipe(
          mergeMap((publishedData: PublishedData) => [
            fromActions.registerPublishedDataCompleteAction({
              publishedData,
            }),
            fromActions.fetchPublishedDataAction({ id: doi }),
          ]),
          catchError((error) =>
            of(fromActions.registerPublishedDataFailedAction(error)),
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
          .publishedDataControllerResyncV3(doi, data)
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
      switchMap((errors) => {
        const message = {
          type: MessageType.Error,
          content: `Registration Failed. ${errors.error.map((e) => e.replaceAll("instance.", "metadata.")).join(", ")}`,
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
        fromActions.createDataPublicationAction,
        fromActions.publishPublishedDataAction,
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
        fromActions.createDataPublicationCompleteAction,
        fromActions.createDataPublicationFailedAction,
        fromActions.publishPublishedDataCompleteAction,
        fromActions.publishPublishedDataFailedAction,
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
