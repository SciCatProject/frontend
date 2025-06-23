import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import {
  DatasetsV4Service,
  OutputDatasetObsoleteDto,
  PublishedData,
  PublishedDataService,
} from "@scicatproject/scicat-sdk-ts-angular";
import { Store } from "@ngrx/store";
import {
  selectCurrentPublishedData,
  selectQueryParams,
} from "state-management/selectors/published-data.selectors";
import * as fromActions from "state-management/actions/published-data.actions";
import * as datasetActions from "state-management/actions/datasets.actions";
import {
  mergeMap,
  map,
  catchError,
  switchMap,
  exhaustMap,
  filter,
  tap,
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
        filter(([{ redirect }, publishedData]) => !!publishedData && redirect),
        exhaustMap(([, publishedData]) =>
          this.router.navigateByUrl(
            "/publishedDatasets/" + encodeURIComponent(publishedData.doi),
          ),
        ),
      );
    },
    { dispatch: false },
  );

  saveDataPublicationInLocalStorage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromActions.saveDataPublicationInLocalStorage),
        tap(({ publishedData }) =>
          localStorage.setItem("editingPublishedDataDoi", publishedData.doi),
        ),
      );
    },
    { dispatch: false },
  );

  clearDataPublicationFromLocalStorage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromActions.clearDataPublicationFromLocalStorage),
        tap(() => localStorage.removeItem("editingPublishedDataDoi")),
      );
    },
    { dispatch: false },
  );

  saveDataPublication$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.saveDataPublicationAction),
      switchMap(({ data }) =>
        this.publishedDataService.publishedDataControllerCreateV3(data).pipe(
          mergeMap((publishedData) => [
            fromActions.saveDataPublicationCompleteAction({ publishedData }),
            fromActions.saveDataPublicationInLocalStorage({ publishedData }),
          ]),
          catchError(() => of(fromActions.saveDataPublicationFailedAction())),
        ),
      ),
    );
  });

  createDataPublication$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.createDataPublicationAction),
      switchMap(({ data }) =>
        this.publishedDataService.publishedDataControllerCreateV3(data).pipe(
          mergeMap((publishedData) => [
            fromActions.createDataPublicationCompleteAction({
              publishedData,
            }),
            fromActions.fetchPublishedDataAction({ id: publishedData.doi }),
            datasetActions.clearBatchAction(),
            fromActions.clearDataPublicationFromLocalStorage(),
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
          catchError((error) =>
            of(fromActions.publishPublishedDataFailedAction(error)),
          ),
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

  updatePublishedData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updatePublishedDataAction),
      switchMap(({ doi, data }) =>
        this.publishedDataService
          .publishedDataControllerUpdateV3(doi, data)
          .pipe(
            mergeMap((publishedData) => [
              fromActions.updatePublishedDataCompleteAction({ publishedData }),
            ]),
            catchError(() => of(fromActions.updatePublishedDataFailedAction())),
          ),
      ),
    );
  });

  resyncPublishedData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.resyncPublishedDataAction),
      switchMap(({ doi, data, redirect }) =>
        this.publishedDataService
          .publishedDataControllerResyncV3(doi, data)
          .pipe(
            mergeMap((publishedData) => [
              fromActions.resyncPublishedDataCompleteAction({
                publishedData,
                redirect,
              }),
              datasetActions.clearBatchAction(),
              fromActions.clearDataPublicationFromLocalStorage(),
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
          content: `Registration Failed. ${errors.error.map((e) => e.replaceAll("instance", "metadata")).join(", ")}`,
          duration: 5000,
        };
        return of(showMessageAction({ message }));
      }),
    );
  });

  publishPublishedDataFailedMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.publishPublishedDataFailedAction),
      switchMap((errors) => {
        const message = {
          type: MessageType.Error,
          content: `Publishing Failed. ${errors.error.map((e) => e.replaceAll("instance", "metadata")).join(", ")}`,
          duration: 5000,
        };
        return of(showMessageAction({ message }));
      }),
    );
  });

  fetchRelatedDatasetsAndAddToBatch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchRelatedDatasetsAndAddToBatchAction),
      switchMap(({ datasetPids, publishedDataDoi }) =>
        this.datasetsV4Service
          .datasetsV4ControllerFindAllV4({
            filter: { where: { pid: { $in: datasetPids } } },
          })
          .pipe(
            mergeMap((datasets) => [
              datasetActions.clearBatchAction(),
              datasetActions.selectDatasetsAction({
                datasets: datasets as OutputDatasetObsoleteDto[],
              }),
              datasetActions.addToBatchAction(),
              fromActions.fetchRelatedDatasetsAndAddToBatchCompleteAction(),
              fromActions.storeEditingPublishedDataDoiAction({
                publishedDataDoi,
              }),
            ]),
            catchError(() =>
              of(fromActions.fetchRelatedDatasetsAndAddToBatchFailedAction()),
            ),
          ),
      ),
    );
  });

  storeEditingPublishedDataDoi$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromActions.storeEditingPublishedDataDoiAction),
        tap(({ publishedDataDoi }) =>
          localStorage.setItem("editingPublishedDataDoi", publishedDataDoi),
        ),
      );
    },
    { dispatch: false },
  );

  navigateToBatch$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromActions.fetchRelatedDatasetsAndAddToBatchCompleteAction),
        tap(() => this.router.navigateByUrl("/datasets/batch")),
      );
    },
    { dispatch: false },
  );

  loading$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchAllPublishedDataAction,
        fromActions.fetchCountAction,
        fromActions.sortByColumnAction,
        fromActions.fetchPublishedDataAction,
        fromActions.createDataPublicationAction,
        fromActions.saveDataPublicationAction,
        fromActions.publishPublishedDataAction,
        fromActions.registerPublishedDataAction,
        fromActions.resyncPublishedDataAction,
        fromActions.updatePublishedDataAction,
        fromActions.fetchRelatedDatasetsAndAddToBatchAction,
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
        fromActions.saveDataPublicationCompleteAction,
        fromActions.createDataPublicationFailedAction,
        fromActions.saveDataPublicationFailedAction,
        fromActions.publishPublishedDataCompleteAction,
        fromActions.publishPublishedDataFailedAction,
        fromActions.registerPublishedDataCompleteAction,
        fromActions.registerPublishedDataFailedAction,
        fromActions.resyncPublishedDataCompleteAction,
        fromActions.updatePublishedDataCompleteAction,
        fromActions.fetchRelatedDatasetsAndAddToBatchCompleteAction,
        fromActions.fetchRelatedDatasetsAndAddToBatchFailedAction,
      ),
      switchMap(() => of(loadingCompleteAction())),
    );
  });

  constructor(
    private actions$: Actions,
    private publishedDataService: PublishedDataService,
    private datasetsV4Service: DatasetsV4Service,
    private router: Router,
    private store: Store,
  ) {}
}
