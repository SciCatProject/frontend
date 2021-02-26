import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DatasetApi, Dataset } from "shared/sdk";
import { Store, select } from "@ngrx/store";
import {
  getFullqueryParams,
  getFullfacetParams,
  getDatasetsInBatch
} from "state-management/selectors/datasets.selectors";
import * as fromActions from "state-management/actions/datasets.actions";
import {
  withLatestFrom,
  mergeMap,
  map,
  catchError,
  switchMap,
  tap,
  filter
} from "rxjs/operators";
import { of } from "rxjs";
import { getCurrentUser } from "state-management/selectors/user.selectors";
import {
  logoutCompleteAction,
  loadingAction,
  loadingCompleteAction,
  addCustomColumnsAction,
  updateUserSettingsAction
} from "state-management/actions/user.actions";

@Injectable()
export class DatasetEffects {
  fullqueryParams$ = this.store.pipe(select(getFullqueryParams));
  fullfacetParams$ = this.store.pipe(select(getFullfacetParams));
  datasetsInBatch$ = this.store.pipe(select(getDatasetsInBatch));
  currentUser$ = this.store.pipe(select(getCurrentUser));

  fetchDatasets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchDatasetsAction),
      withLatestFrom(this.fullqueryParams$),
      map(([action, params]) => params),
      mergeMap(({ query, limits }) =>
        this.datasetApi.fullquery(query, limits).pipe(
          map(datasets =>
            fromActions.fetchDatasetsCompleteAction({ datasets })
          ),
          catchError(() => of(fromActions.fetchDatasetsFailedAction()))
        )
      )
    )
  );

  fetchFacetCounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchFacetCountsAction),
      withLatestFrom(this.fullfacetParams$),
      map(([action, params]) => params),
      mergeMap(({ fields, facets }) =>
        this.datasetApi.fullfacet(fields, facets).pipe(
          map(res => {
            const { all, ...facetCounts } = res[0];
            const allCounts = all && all.length > 0 ? all[0].totalSets : 0;
            return fromActions.fetchFacetCountsCompleteAction({
              facetCounts,
              allCounts
            });
          }),
          catchError(() => of(fromActions.fetchFacetCountsFailedAction()))
        )
      )
    )
  );

  fetchMetadataKeys$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchMetadataKeysAction),
      withLatestFrom(this.fullqueryParams$),
      map(([action, params]) => params),
      mergeMap(({ query }) => {
        const parsedQuery = JSON.parse(query);
        parsedQuery.metadataKey = "";
        return this.datasetApi.metadataKeys(JSON.stringify(parsedQuery)).pipe(
          map(metadataKeys =>
            fromActions.fetchMetadataKeysCompleteAction({ metadataKeys })
          ),
          catchError(() => of(fromActions.fetchMetadataKeysFailedAction()))
        );
      })
    )
  );

  updateUserDatasetsLimit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.changePageAction),
      map(({ limit }) =>
        updateUserSettingsAction({ property: { datasetCount: limit } })
      )
    )
  );

  updateMetadataKeys$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.addScientificConditionAction,
        fromActions.removeScientificConditionAction,
        fromActions.clearFacetsAction
      ),
      map(() => fromActions.fetchMetadataKeysAction())
    )
  );

  addMetadataColumns$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchMetadataKeysCompleteAction),
      switchMap(({ metadataKeys }) =>
        of(addCustomColumnsAction({ names: metadataKeys }))
      )
    )
  );

  fetchDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchDatasetAction),
      switchMap(({ pid, filters }) => {
        const datasetFilter = {
          where: {
            pid: pid
          },
          include: [
            { relation: "origdatablocks" },
            { relation: "datablocks" },
            { relation: "attachments" }
          ]
        };

        if (filters) {
          Object.keys(filters).forEach(key => {
            datasetFilter.where[key] = filters[key];
          });
        }

        return this.datasetApi.findOne(datasetFilter).pipe(
          map((dataset: Dataset) =>
            fromActions.fetchDatasetCompleteAction({ dataset })
          ),
          catchError(() => of(fromActions.fetchDatasetFailedAction()))
        );
      })
    )
  );

  addDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.addDatasetAction),
      mergeMap(({ dataset }) =>
        this.datasetApi.create(dataset).pipe(
          mergeMap(res => [
            fromActions.addDatasetCompleteAction({ dataset: res }),
            fromActions.fetchDatasetsAction(),
            fromActions.fetchDatasetAction({ pid: res.pid })
          ]),
          catchError(() => of(fromActions.addDatasetFailedAction()))
        )
      )
    )
  );

  updateProperty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.updatePropertyAction),
      switchMap(({ pid, property }) =>
        this.datasetApi
          .updateAttributes(encodeURIComponent(pid), property)
          .pipe(
            switchMap(() => [
              fromActions.updatePropertyCompleteAction(),
              fromActions.fetchDatasetAction({ pid })
            ]),
            catchError(() => of(fromActions.updatePropertyFailedAction()))
          )
      )
    )
  );

  addAttachment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.addAttachmentAction),
      switchMap(({ attachment }) => {
        delete attachment.id;
        delete attachment.rawDatasetId;
        delete attachment.derivedDatasetId;
        delete attachment.proposalId;
        delete attachment.sampleId;
        return this.datasetApi
          .createAttachments(
            encodeURIComponent(attachment.datasetId),
            attachment
          )
          .pipe(
            map(res =>
              fromActions.addAttachmentCompleteAction({ attachment: res })
            ),
            catchError(() => of(fromActions.addAttachmentFailedAction()))
          );
      })
    )
  );

  updateAttachmentCaption$ = createEffect(() =>
    this.actions$.pipe(
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
            map(attachment =>
              fromActions.updateAttachmentCaptionCompleteAction({ attachment })
            ),
            catchError(() =>
              of(fromActions.updateAttachmentCaptionFailedAction())
            )
          );
      })
    )
  );

  removeAttachment$ = createEffect(() =>
    this.actions$.pipe(
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
    )
  );

  reduceDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.reduceDatasetAction),
      mergeMap(({ dataset }) =>
        this.datasetApi.reduceDataset(dataset).pipe(
          map(result => fromActions.reduceDatasetCompleteAction({ result })),
          catchError(() => of(fromActions.reduceDatasetFailedAction()))
        )
      )
    )
  );

  loading$ = createEffect(() =>
    this.actions$.pipe(
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
    )
  );

  loadingComplete$ = createEffect(() =>
    this.actions$.pipe(
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
    )
  );

  prefillBatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.prefillBatchAction),
      withLatestFrom(this.currentUser$),
      filter(([, user]) => user != null),
      map(([, user]) => this.retrieveBatch(user.id)),
      map(batch => fromActions.prefillBatchCompleteAction({ batch }))
    )
  );

  storeBatch$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          fromActions.addToBatchAction,
          fromActions.removeFromBatchAction,
          fromActions.clearBatchAction
        ),
        withLatestFrom(this.datasetsInBatch$, this.currentUser$),
        tap(([, batch, user]) => this.storeBatch(batch, user.id))
      ),
    { dispatch: false }
  );

  clearBatchOnLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logoutCompleteAction),
        tap(() => this.storeBatch([], null))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private datasetApi: DatasetApi,
    private store: Store<any>
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
