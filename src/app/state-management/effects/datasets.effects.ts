import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, select, Store } from "@ngrx/store";
import { DatasetApi } from "shared/sdk/services";
import * as DatasetActions from "state-management/actions/datasets.actions";
import { Dataset } from "state-management/models";
import {
  getDatasetsInBatch,
  getFullfacetsParams,
  getFullqueryParams,
  getRectangularRepresentation
} from "../selectors/datasets.selectors";
import {
  catchError,
  filter,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom
} from "rxjs/operators";
import { getCurrentUser } from "../selectors/users.selectors";
import { LOGOUT_COMPLETE } from "../actions/user.actions";

@Injectable()
export class DatasetEffects {
  @Effect()
  protected removeAttachment$: Observable<Action> = this.actions$.pipe(
    ofType(DatasetActions.DELETE_ATTACHMENT),
    map((action: DatasetActions.DeleteAttachment) => action),
    switchMap(action => {
      console.log("Dataset Effects: Deleting attachment", action.attachment_id);
      return this.datasetApi
        .destroyByIdAttachments(
          encodeURIComponent(action.dataset_id),
          action.attachment_id
        )
        .pipe(
          map(
            res =>
              new DatasetActions.DeleteAttachmentComplete(action.attachment_id)
          ),
          catchError(err => of(new DatasetActions.DeleteAttachmentFailed(err)))
        );
    })
  );

  @Effect()
  protected saveDataset$: Observable<Action> = this.actions$.pipe(
    ofType(DatasetActions.SAVE_DATASET),
    map((action: DatasetActions.SaveDatasetAction) => action.dataset),
    switchMap(dataset => {
      return this.datasetApi.upsert(dataset).pipe(
        map(res => new DatasetActions.SaveDatasetCompleteAction(dataset)),
        catchError(err => of(new DatasetActions.SaveDatasetFailedAction()))
      );
    })
  );

  @Effect()
  protected addAttachment$: Observable<Action> = this.actions$.pipe(
    ofType(DatasetActions.ADD_ATTACHMENT),
    map((action: DatasetActions.AddAttachment) => action.attachment),
    switchMap(attachment => {
      console.log(
        "Dataset Effects: Creating attachment for",
        attachment.datasetId
      );
      delete attachment.id;
      return this.datasetApi
        .createAttachments(encodeURIComponent(attachment.datasetId), attachment)
        .pipe(
          map(res => new DatasetActions.AddAttachmentComplete(res)),
          catchError(err => of(new DatasetActions.AddAttachmentFailed(err)))
        );
    })
  );

  @Effect()
  protected getDatablocks$: Observable<Action> = this.actions$.pipe(
    ofType(DatasetActions.DATABLOCKS),
    map((action: DatasetActions.DatablocksAction) => action.id),
    switchMap(id => {
      const blockFilter = {
        include: [
          { relation: "origdatablocks" },
          { relation: "datablocks" },
          { relation: "attachments" }
        ]
      };

      // TODO separate action for dataBlocks? or retrieve at once?

      return this.datasetApi.findById(encodeURIComponent(id), blockFilter).pipe(
        map(
          (dataset: Dataset) =>
            new DatasetActions.SearchIDCompleteAction(dataset)
        ),
        catchError(err => of(new DatasetActions.DatablocksFailedAction(err)))
      );
    })
  );
  @Effect({ dispatch: false })
  protected clearBatchOnLogout$ = this.actions$.pipe(
    ofType(LOGOUT_COMPLETE),
    tap(() => this.storeBatch([], null))
  );
  private fullqueryParams$ = this.store.pipe(select(getFullqueryParams));
  private fullfacetParams$ = this.store.pipe(select(getFullfacetsParams));
  private rectangularRepresentation$ = this.store.pipe(
    select(getRectangularRepresentation)
  );

  private datasetsInBatch$ = this.store.pipe(select(getDatasetsInBatch));
  private currentUser$ = this.store.pipe(select(getCurrentUser));
  @Effect({ dispatch: false })
  protected storeBatch$ = this.actions$.pipe(
    ofType(
      DatasetActions.ADD_TO_BATCH,
      DatasetActions.REMOVE_FROM_BATCH,
      DatasetActions.CLEAR_BATCH
    ),
    withLatestFrom(this.datasetsInBatch$, this.currentUser$),
    tap(([, batch, user]) => this.storeBatch(batch, user.id))
  );
  @Effect()
  protected prefillBatch$ = this.actions$.pipe(
    ofType(DatasetActions.PREFILL_BATCH),
    withLatestFrom(this.currentUser$),
    filter(([, user]) => user != null),
    map(([, user]) => this.retrieveBatch(user.id)),
    map(batch => new DatasetActions.PrefillBatchCompleteAction(batch))
  );
  @Effect()
  private fetchDatasets$: Observable<Action> = this.actions$.pipe(
    ofType(DatasetActions.FETCH_DATASETS),
    withLatestFrom(this.fullqueryParams$),
    map(([action, params]) => params),
    mergeMap(({ query, limits }) => {
      return this.datasetApi.fullquery(query, limits).pipe(
        map(
          datasets =>
            new DatasetActions.FetchDatasetsCompleteAction(
              datasets as Dataset[]
            )
        ),
        catchError(() => of(new DatasetActions.FetchDatasetsFailedAction()))
      );
    })
  );
  @Effect()
  private fetchFacetCounts$: Observable<Action> = this.actions$.pipe(
    ofType(DatasetActions.FETCH_FACET_COUNTS),
    withLatestFrom(this.fullfacetParams$),
    map(([action, params]) => params),
    mergeMap(({ fields, facets }) => {
      return this.datasetApi.fullfacet(fields, facets).pipe(
        map(res => {
          const { all, ...facetCounts } = res[0];
          const allCounts = all && all.length > 0 ? all[0].totalSets : 0;
          return new DatasetActions.FetchFacetCountsCompleteAction(
            facetCounts,
            allCounts
          );
        }),
        catchError(() => of(new DatasetActions.FetchFacetCountsFailedAction()))
      );
    })
  );

  @Effect()
  reduceDataset: Observable<object> = this.actions$.pipe(
    ofType<DatasetActions.ReduceDatasetAction>(DatasetActions.REDUCE_DATASET),
    mergeMap(action =>
      this.datasetApi.reduceDataset(action.dataset).pipe(
        map(result => new DatasetActions.ReduceDatasetCompleteAction(result)),
        catchError(() => of(new DatasetActions.ReduceDatasetFailedAction()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private datasetApi: DatasetApi
  ) {}

  private storeBatch(batch: Dataset[], userId: string): void {
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
