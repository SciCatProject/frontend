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
      ofType(fromActions.fetchDatasetsAction),
      withLatestFrom(this.fullqueryParams$),
      map(([action, params]) => params),
      mergeMap(({ query, limits }) => {
        return this.datasetApi.fullquery(query, limits).pipe(
          map(datasets =>
            fromActions.fetchDatasetsCompleteAction({ datasets })
          ),
          catchError(() => of(fromActions.fetchDatasetsFailedAction()))
        );
      })
    )
  );

  fetchFacetCounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchFacetCountsAction),
      withLatestFrom(this.fullfacetParams$),
      map(([action, params]) => params),
      mergeMap(({ fields, facets }) => {
        return this.datasetApi.fullfacet(fields, facets).pipe(
          map(res => {
            console.log("fetchFacetCounts$", res);
            const { all, ...facetCounts } = res[0];
            const allCounts = all && all.length > 0 ? all[0].totalSets : 0;
            return fromActions.fetchFacetCountsCompleteAction({
              facetCounts,
              allCounts
            });
          }),
          catchError(() => of(fromActions.fetchFacetCountsFailedAction()))
        );
      })
    )
  );

  fetchDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchDatasetAction),
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
          map((dataset: Dataset) =>
            fromActions.fetchDatasetCompleteAction({ dataset })
          ),
          catchError(() => of(fromActions.fetchDatasetFailedAction()))
        );
      })
    )
  );

  saveDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.saveDatasetAction),
      mergeMap(action =>
        this.datasetApi.updateScientificMetadata(action.dataset).pipe(
          map(dataset => fromActions.saveDatasetCompleteAction({ dataset })),
          catchError(() => of(fromActions.saveDatasetFailedAction()))
        )
      )
    )
  );

  addAttachment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.addAttachmentAction),
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
            map(res =>
              fromActions.addAttachmentCompleteAction({ attachment: res })
            ),
            catchError(() => of(fromActions.addAttachmentFailedAction()))
          );
      })
    )
  );

  updateAttchmentCaption$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.updateAttachmentCaptionAction),
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
      switchMap(action =>
        this.datasetApi
          .destroyByIdAttachments(
            encodeURIComponent(action.datasetId),
            encodeURIComponent(action.attachmentId)
          )
          .pipe(
            map(attachmentId =>
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
      mergeMap(action =>
        this.datasetApi.reduceDataset(action.dataset).pipe(
          map(result => fromActions.reduceDatasetCompleteAction({ result })),
          catchError(() => of(fromActions.reduceDatasetFailedAction()))
        )
      )
    )
  );

  protected prefillBatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.prefillBatchAction),
      withLatestFrom(this.currentUser$),
      filter(([, user]) => user != null),
      map(([, user]) => this.retrieveBatch(user.id)),
      map(batch => fromActions.prefillBatchCompleteAction({ batch }))
    )
  );

  protected storeBatch$ = createEffect(
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
