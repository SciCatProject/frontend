import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DatasetApi, Dataset, LoopBackFilter } from "shared/sdk";
import { Store } from "@ngrx/store";
import {
  selectFullqueryParams,
  selectFullfacetParams,
  selectDatasetsInBatch,
} from "state-management/selectors/datasets.selectors";
import * as fromActions from "state-management/actions/datasets.actions";
import {
  withLatestFrom,
  mergeMap,
  map,
  catchError,
  switchMap,
  tap,
  filter,
} from "rxjs/operators";
import { of } from "rxjs";
import { selectCurrentUser } from "state-management/selectors/user.selectors";
import {
  logoutCompleteAction,
  loadingAction,
  loadingCompleteAction,
  addCustomColumnsAction,
  updateUserSettingsAction,
} from "state-management/actions/user.actions";

@Injectable()
export class DatasetEffects {
  fullqueryParams$ = this.store.select(selectFullqueryParams);
  fullfacetParams$ = this.store.select(selectFullfacetParams);
  datasetsInBatch$ = this.store.select(selectDatasetsInBatch);
  currentUser$ = this.store.select(selectCurrentUser);

  fetchDatasets$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchDatasetsAction),
      withLatestFrom(this.fullqueryParams$),
      map(([action, params]) => params),
      mergeMap(({ query, limits }) =>
        this.datasetApi.fullquery(query, limits).pipe(
          map((datasets) =>
            fromActions.fetchDatasetsCompleteAction({ datasets })
          ),
          catchError(() => of(fromActions.fetchDatasetsFailedAction()))
        )
      )
    );
  });

  fetchFacetCounts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchFacetCountsAction),
      withLatestFrom(this.fullfacetParams$),
      map(([action, params]) => params),
      mergeMap(({ fields, facets }) =>
        this.datasetApi.fullfacet(fields, facets).pipe(
          map((res) => {
            const { all, ...facetCounts } = res[0];
            const allCounts = all && all.length > 0 ? all[0].totalSets : 0;
            return fromActions.fetchFacetCountsCompleteAction({
              facetCounts,
              allCounts,
            });
          }),
          catchError(() => of(fromActions.fetchFacetCountsFailedAction()))
        )
      )
    );
  });

  fetchMetadataKeys$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchMetadataKeysAction),
      withLatestFrom(this.fullqueryParams$),
      map(([action, params]) => params),
      mergeMap(({ query }) => {
        const parsedQuery = JSON.parse(query);
        parsedQuery.metadataKey = "";
        return this.datasetApi.metadataKeys(JSON.stringify(parsedQuery)).pipe(
          map((metadataKeys) =>
            fromActions.fetchMetadataKeysCompleteAction({ metadataKeys })
          ),
          catchError(() => of(fromActions.fetchMetadataKeysFailedAction()))
        );
      })
    );
  });

  updateUserDatasetsLimit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.changePageAction),
      map(({ limit }) =>
        updateUserSettingsAction({ property: { datasetCount: limit } })
      )
    );
  });

  updateMetadataKeys$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.addScientificConditionAction,
        fromActions.removeScientificConditionAction,
        fromActions.clearFacetsAction
      ),
      map(() => fromActions.fetchMetadataKeysAction())
    );
  });

  addMetadataColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchMetadataKeysCompleteAction),
      switchMap(({ metadataKeys }) =>
        of(addCustomColumnsAction({ names: metadataKeys }))
      )
    );
  });

  fetchDataset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchDatasetAction),
      switchMap(({ pid, filters }) => {
        const datasetFilter: LoopBackFilter = {
          where: { pid },
          include: [
            { relation: "origdatablocks" },
            { relation: "datablocks" },
            { relation: "attachments" },
          ],
        };

        if (filters) {
          Object.keys(filters).forEach((key) => {
            datasetFilter.where[key] = filters[key];
          });
        }

        return this.datasetApi.findOne<Dataset>(datasetFilter).pipe(
          map((dataset: Dataset) =>
            fromActions.fetchDatasetCompleteAction({ dataset })
          ),
          catchError(() => of(fromActions.fetchDatasetFailedAction()))
        );
      })
    );
  });

  addDataset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.addDatasetAction),
      mergeMap(({ dataset }) =>
        this.datasetApi.create(dataset).pipe(
          mergeMap((res) => [
            fromActions.addDatasetCompleteAction({ dataset: res }),
            fromActions.fetchDatasetsAction(),
            fromActions.fetchDatasetAction({ pid: res.pid }),
          ]),
          catchError(() => of(fromActions.addDatasetFailedAction()))
        )
      )
    );
  });

  updateProperty$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updatePropertyAction),
      switchMap(({ pid, property }) =>
        this.datasetApi
          .updateAttributes(encodeURIComponent(pid), property)
          .pipe(
            switchMap(() => [
              fromActions.updatePropertyCompleteAction(),
              fromActions.fetchDatasetAction({ pid }),
            ]),
            catchError(() => of(fromActions.updatePropertyFailedAction()))
          )
      )
    );
  });

  addAttachment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.addAttachmentAction),
      switchMap(({ attachment }) => {
        const {
          id,
          rawDatasetId,
          derivedDatasetId,
          proposalId,
          sampleId,
          ...theRest
        } = attachment;
        return this.datasetApi
          .createAttachments(encodeURIComponent(theRest.datasetId!), theRest)
          .pipe(
            map((res) =>
              fromActions.addAttachmentCompleteAction({ attachment: res })
            ),
            catchError(() => of(fromActions.addAttachmentFailedAction()))
          );
      })
    );
  });

  updateAttachmentCaption$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updateAttachmentCaptionAction),
      switchMap(({ datasetId, attachmentId, caption }) => {
        const data = { caption };
        return this.datasetApi
          .updateByIdAttachments(
            encodeURIComponent(datasetId),
            encodeURIComponent(attachmentId),
            data
          )
          .pipe(
            map((attachment) =>
              fromActions.updateAttachmentCaptionCompleteAction({ attachment })
            ),
            catchError(() =>
              of(fromActions.updateAttachmentCaptionFailedAction())
            )
          );
      })
    );
  });

  removeAttachment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.removeAttachmentAction),
      switchMap(({ datasetId, attachmentId }) =>
        this.datasetApi
          .destroyByIdAttachments(encodeURIComponent(datasetId), attachmentId)
          .pipe(
            map(() =>
              fromActions.removeAttachmentCompleteAction({ attachmentId })
            ),
            catchError(() => of(fromActions.removeAttachmentFailedAction()))
          )
      )
    );
  });

  reduceDataset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.reduceDatasetAction),
      mergeMap(({ dataset }) =>
        this.datasetApi.reduceDataset(dataset).pipe(
          map((result) => fromActions.reduceDatasetCompleteAction({ result })),
          catchError(() => of(fromActions.reduceDatasetFailedAction()))
        )
      )
    );
  });

  appendToArrayField$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.appendToDatasetArrayFieldAction),
      mergeMap(({ pid, fieldName, data }) =>
        this.datasetApi.appendToArrayField(pid, fieldName, data).pipe(
          map(() => fromActions.appendToDatasetArrayFieldCompleteAction()),
          catchError(() =>
            of(fromActions.appendToDatasetArrayFieldFailedAction())
          )
        )
      )
    );
  });

  loading$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchDatasetsAction,
        fromActions.fetchFacetCountsAction,
        fromActions.fetchMetadataKeysAction,
        fromActions.fetchDatasetAction,
        fromActions.addDatasetAction,
        fromActions.updatePropertyAction,
        fromActions.addAttachmentAction,
        fromActions.updateAttachmentCaptionAction,
        fromActions.removeAttachmentAction
      ),
      switchMap(() => of(loadingAction()))
    );
  });

  loadingComplete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchDatasetsCompleteAction,
        fromActions.fetchDatasetsFailedAction,
        fromActions.fetchFacetCountsCompleteAction,
        fromActions.fetchFacetCountsFailedAction,
        fromActions.fetchMetadataKeysCompleteAction,
        fromActions.fetchMetadataKeysFailedAction,
        fromActions.fetchDatasetCompleteAction,
        fromActions.fetchDatasetFailedAction,
        fromActions.addDatasetCompleteAction,
        fromActions.addDatasetFailedAction,
        fromActions.updatePropertyCompleteAction,
        fromActions.updatePropertyFailedAction,
        fromActions.addAttachmentCompleteAction,
        fromActions.addAttachmentFailedAction,
        fromActions.updateAttachmentCaptionCompleteAction,
        fromActions.updateAttachmentCaptionFailedAction,
        fromActions.removeAttachmentCompleteAction,
        fromActions.removeAttachmentFailedAction
      ),
      switchMap(() => of(loadingCompleteAction()))
    );
  });

  prefillBatch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.prefillBatchAction),
      withLatestFrom(this.currentUser$),
      filter(([, user]) => user != null),
      map(([, user]) => this.retrieveBatch(user?.id)),
      map((batch) => fromActions.prefillBatchCompleteAction({ batch }))
    );
  });

  storeBatch$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          fromActions.addToBatchAction,
          fromActions.removeFromBatchAction,
          fromActions.clearBatchAction
        ),
        withLatestFrom(this.datasetsInBatch$, this.currentUser$),
        tap(([, batch, user]) => this.storeBatch(batch, user?.id))
      );
    },
    { dispatch: false }
  );

  clearBatchOnLogout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(logoutCompleteAction),
        tap(() => this.storeBatch([], ""))
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private datasetApi: DatasetApi,
    private store: Store
  ) {}

  private storeBatch(batch: Dataset[], userId: string) {
    const json = JSON.stringify(batch);
    localStorage.setItem("batch", json);
    localStorage.setItem("batchUser", userId);
  }

  private retrieveBatch(ofUserId: string): Dataset[] {
    const json = localStorage.getItem("batch");
    const userId = localStorage.getItem("batchUser");

    if (json != null && userId === ofUserId) {
      return JSON.parse(json);
    } else {
      return [];
    }
  }
}
