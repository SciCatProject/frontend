import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DatasetApi, Dataset, RawDataset } from "shared/sdk";
import { Store, select } from "@ngrx/store";
import {
  getFullqueryParams,
  getFullfacetParams,
  getDatasetsInBatch
} from "state-management/selectors/datasets.selectors";
import {
  fetchDatasetsAction,
  fetchDatasetsCompleteAction,
  fetchDatasetsFailedAction,
  fetchFacetCountsAction,
  fetchFacetCountsCompleteAction,
  fetchFacetCountsFailedAction,
  fetchDatasetAction,
  fetchDatasetCompleteAction,
  fetchDatasetFailedAction,
  saveDatasetAction,
  saveDatasetCompleteAction,
  saveDatasetFailedAction,
  addAttachmentAction,
  addAttachmentCompleteAction,
  addAttachmentFailedAction,
  updateAttachmentCaptionAction,
  updateAttachmentCaptionCompleteAction,
  updateAttachmentCaptionFailedAction,
  removeAttachmentAction,
  removeAttachmentCompleteAction,
  removeAttachmentFailedAction,
  reduceDatasetAction,
  reduceDatasetCompleteAction,
  reduceDatasetFailedAction,
  prefillBatchAction,
  prefillBatchCompleteAction,
  removeFromBatchAction,
  clearBatchAction,
  addToBatchAction
} from "state-management/actions/datasets.actions";
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
import { getCurrentUser } from "state-management/selectors/users.selectors";
import { LOGOUT_COMPLETE } from "state-management/actions/user.actions";

@Injectable()
export class DatasetEffects {
  fullqueryParams$ = this.store.pipe(select(getFullqueryParams));
  fullfacetParams$ = this.store.pipe(select(getFullfacetParams));
  datasetsInBatch$ = this.store.pipe(select(getDatasetsInBatch));
  currentUser$ = this.store.pipe(select(getCurrentUser));

  fetchDatasets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchDatasetsAction),
      withLatestFrom(this.fullqueryParams$),
      map(([action, params]) => params),
      mergeMap(({ query, limits }) => {
        return this.datasetApi.fullquery(query, limits).pipe(
          map(datasets => fetchDatasetsCompleteAction({ datasets })),
          catchError(() => of(fetchDatasetsFailedAction()))
        );
      })
    )
  );

  fetchFacetCounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchFacetCountsAction),
      withLatestFrom(this.fullfacetParams$),
      map(([action, params]) => params),
      mergeMap(({ fields, facets }) => {
        return this.datasetApi.fullfacet(fields, facets).pipe(
          map(res => {
            console.log("fetchFacetCounts$", res);
            const { all, ...facetCounts } = res[0];
            const allCounts = all && all.length > 0 ? all[0].totalSets : 0;
            return fetchFacetCountsCompleteAction({ facetCounts, allCounts });
          }),
          catchError(() => of(fetchFacetCountsFailedAction()))
        );
      })
    )
  );

  fetchDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchDatasetAction),
      switchMap(action => {
        const datasetFilter = {
          where: {
            pid: action.pid
          },
          include: [
            { relation: "origdatablocks" },
            { relation: "datablocks" },
            { relation: "attachments" }
          ]
        };

        if (action.filter) {
          Object.keys(action.filter).forEach(key => {
            datasetFilter.where[key] = action.filter[key];
          });
        }

        return this.datasetApi.findOne(datasetFilter).pipe(
          map((dataset: Dataset) => fetchDatasetCompleteAction({ dataset })),
          catchError(() => of(fetchDatasetFailedAction()))
        );
      })
    )
  );

  saveDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveDatasetAction),
      mergeMap(action =>
        this.datasetApi.updateScientificMetadata(action.dataset).pipe(
          map(dataset => saveDatasetCompleteAction({ dataset })),
          catchError(() => of(saveDatasetFailedAction()))
        )
      )
    )
  );

  addAttachment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addAttachmentAction),
      map(action => action.attachment),
      switchMap(attachment => {
        delete attachment.id;
        delete attachment.rawDatasetId;
        delete attachment.derivedDatasetId;
        delete attachment.proposalId;
        delete attachment.sampleId;
        return this.datasetApi
          .createAttachments(encodeURI(attachment.datasetId), attachment)
          .pipe(
            map(res => addAttachmentCompleteAction({ attachment: res })),
            catchError(() => of(addAttachmentFailedAction()))
          );
      })
    )
  );

  updateAttchmentCaption$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateAttachmentCaptionAction),
      switchMap(action => {
        const newCaption = { caption: action.caption };
        return this.datasetApi
          .updateByIdAttachments(
            encodeURIComponent(action.datasetId),
            encodeURIComponent(action.attachmentId),
            newCaption
          )
          .pipe(
            map(attachment =>
              updateAttachmentCaptionCompleteAction({ attachment })
            ),
            catchError(() => of(updateAttachmentCaptionFailedAction()))
          );
      })
    )
  );

  removeAttachment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeAttachmentAction),
      switchMap(action =>
        this.datasetApi
          .destroyByIdAttachments(
            encodeURIComponent(action.datasetId),
            encodeURIComponent(action.attachmentId)
          )
          .pipe(
            map(attachmentId =>
              removeAttachmentCompleteAction({ attachmentId })
            ),
            catchError(() => of(removeAttachmentFailedAction()))
          )
      )
    )
  );

  reduceDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(reduceDatasetAction),
      mergeMap(action =>
        this.datasetApi.reduceDataset(action.dataset).pipe(
          map(result => reduceDatasetCompleteAction({ result })),
          catchError(() => of(reduceDatasetFailedAction()))
        )
      )
    )
  );

  protected prefillBatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(prefillBatchAction),
      withLatestFrom(this.currentUser$),
      filter(([, user]) => user != null),
      map(([, user]) => this.retrieveBatch(user.id)),
      map(batch => prefillBatchCompleteAction({ batch }))
    )
  );

  protected storeBatch$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addToBatchAction, removeFromBatchAction, clearBatchAction),
        withLatestFrom(this.datasetsInBatch$, this.currentUser$),
        tap(([, batch, user]) => this.storeBatch(batch, user.id))
      ),
    { dispatch: false }
  );

  protected clearBatchOnLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LOGOUT_COMPLETE),
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
