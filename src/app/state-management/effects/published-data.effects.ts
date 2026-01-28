import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import {
  DatasetsV4Service,
  OutputDatasetObsoleteDto,
  PublishedData,
  PublishedDataV4Service,
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
          .publishedDataV4ControllerFindAllV4(JSON.stringify(params))
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
        this.publishedDataService.publishedDataV4ControllerCountV4().pipe(
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
        this.publishedDataService.publishedDataV4ControllerFindOneV4(id).pipe(
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
        this.publishedDataService.publishedDataV4ControllerGetConfigV4().pipe(
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

  savePublishedDataInLocalStorage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromActions.savePublishedDataInLocalStorage),
        tap(({ publishedData }) =>
          localStorage.setItem("editingPublishedDataDoi", publishedData.doi),
        ),
      );
    },
    { dispatch: false },
  );

  clearPublishedDataFromLocalStorage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromActions.clearPublishedDataFromLocalStorage),
        tap(() => localStorage.removeItem("editingPublishedDataDoi")),
      );
    },
    { dispatch: false },
  );

  savePublishedData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.savePublishedDataAction),
      switchMap(({ data }) =>
        this.publishedDataService.publishedDataV4ControllerCreateV4(data).pipe(
          mergeMap((publishedData) => [
            fromActions.savePublishedDataCompleteAction({ publishedData }),
            fromActions.savePublishedDataInLocalStorage({ publishedData }),
          ]),
          catchError(() => of(fromActions.savePublishedDataFailedAction())),
        ),
      ),
    );
  });

  createPublishedData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.createPublishedDataAction),
      switchMap(({ data }) =>
        this.publishedDataService.publishedDataV4ControllerCreateV4(data).pipe(
          mergeMap((publishedData) => [
            fromActions.createPublishedDataCompleteAction({
              publishedData,
            }),
            fromActions.fetchPublishedDataAction({ id: publishedData.doi }),
            datasetActions.clearBatchAction(),
            fromActions.clearPublishedDataFromLocalStorage(),
          ]),
          catchError(() => of(fromActions.createPublishedDataFailedAction())),
        ),
      ),
    );
  });

  publishPublishedData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.publishPublishedDataAction),
      switchMap(({ doi }) =>
        this.publishedDataService.publishedDataV4ControllerPublishV4(doi).pipe(
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

  createPublishedDataCompleteMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.createPublishedDataCompleteAction),
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

  createPublishedDataFailedMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.createPublishedDataFailedAction),
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
        this.publishedDataService.publishedDataV4ControllerRegisterV4(doi).pipe(
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

  amendPublishedData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.amendPublishedDataAction),
      switchMap(({ doi }) =>
        this.publishedDataService.publishedDataV4ControllerAmendV4(doi).pipe(
          mergeMap((publishedData: PublishedData) => [
            fromActions.amendPublishedDataCompleteAction({
              publishedData,
            }),
            fromActions.fetchPublishedDataAction({ id: doi }),
          ]),
          catchError((error) =>
            of(fromActions.amendPublishedDataFailedAction(error)),
          ),
        ),
      ),
    );
  });

  navigateToPublishedDatasets$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromActions.deletePublishedDataCompleteAction),
        tap(() => this.router.navigateByUrl("/publishedDatasets")),
      );
    },
    { dispatch: false },
  );

  deletePublishedData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.deletePublishedDataAction),
      switchMap(({ doi }) =>
        this.publishedDataService.publishedDataV4ControllerRemoveV4(doi).pipe(
          mergeMap(() => [
            fromActions.deletePublishedDataCompleteAction({ doi }),
          ]),
          catchError((error) =>
            of(fromActions.deletePublishedDataFailedAction(error)),
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
          .publishedDataV4ControllerUpdateV4(doi, data)
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
          .publishedDataV4ControllerResyncV4(doi, data)
          .pipe(
            mergeMap((publishedData) => [
              fromActions.resyncPublishedDataCompleteAction({
                publishedData,
                redirect,
              }),
              datasetActions.clearBatchAction(),
              fromActions.clearPublishedDataFromLocalStorage(),
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
        const messageContent = `Registration Failed. ${
          Array.isArray(errors.error)
            ? errors.error
                .map((e) => e.replaceAll("instance", "metadata"))
                .join(", ")
            : errors.error
        }`;

        const message = {
          type: MessageType.Error,
          content: messageContent,
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
        const messageContent = `Publishing Failed. ${
          Array.isArray(errors.error)
            ? errors.error
                .map((e) => e.replaceAll("instance", "metadata"))
                .join(", ")
            : errors.error
        }`;

        const message = {
          type: MessageType.Error,
          content: messageContent,
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
          .datasetsV4ControllerFindAllV4({ where: { pid: { $in: datasetPids } } })
          .pipe(
            mergeMap((datasets) => [
              datasetActions.clearBatchAction(),
              datasetActions.selectDatasetsAction({
                datasets: datasets as OutputDatasetObsoleteDto[],
              }),
              datasetActions.addToBatchAction(),
              fromActions.fetchRelatedDatasetsAndAddToBatchCompleteAction({
                publishedDataDoi,
              }),
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
        tap(({ publishedDataDoi }) => {
          localStorage.setItem("editingPublishedDataDoi", publishedDataDoi);
          localStorage.setItem("editingDatasetList", "true");
        }),
      );
    },
    { dispatch: false },
  );

  navigateToPublishedDataEditDatasetList$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromActions.fetchRelatedDatasetsAndAddToBatchCompleteAction),
        tap(({ publishedDataDoi }) =>
          this.router.navigateByUrl(
            `/publishedDatasets/${encodeURIComponent(publishedDataDoi)}/datasetList/edit`,
          ),
        ),
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
        fromActions.createPublishedDataAction,
        fromActions.savePublishedDataAction,
        fromActions.publishPublishedDataAction,
        fromActions.registerPublishedDataAction,
        fromActions.resyncPublishedDataAction,
        fromActions.updatePublishedDataAction,
        fromActions.amendPublishedDataAction,
        fromActions.deletePublishedDataAction,
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
        fromActions.createPublishedDataCompleteAction,
        fromActions.savePublishedDataCompleteAction,
        fromActions.createPublishedDataFailedAction,
        fromActions.savePublishedDataFailedAction,
        fromActions.publishPublishedDataCompleteAction,
        fromActions.publishPublishedDataFailedAction,
        fromActions.registerPublishedDataCompleteAction,
        fromActions.registerPublishedDataFailedAction,
        fromActions.resyncPublishedDataCompleteAction,
        fromActions.resyncPublishedDataFailedAction,
        fromActions.updatePublishedDataCompleteAction,
        fromActions.updatePublishedDataFailedAction,
        fromActions.fetchRelatedDatasetsAndAddToBatchCompleteAction,
        fromActions.fetchRelatedDatasetsAndAddToBatchFailedAction,
        fromActions.amendPublishedDataCompleteAction,
        fromActions.amendPublishedDataFailedAction,
        fromActions.deletePublishedDataCompleteAction,
        fromActions.deletePublishedDataFailedAction,
      ),
      switchMap(() => of(loadingCompleteAction())),
    );
  });

  constructor(
    private actions$: Actions,
    private publishedDataService: PublishedDataV4Service,
    private datasetsV4Service: DatasetsV4Service,
    private router: Router,
    private store: Store,
  ) {}
}
