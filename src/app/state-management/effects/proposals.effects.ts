import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DatasetApi, ProposalApi, Proposal, Dataset } from "shared/sdk";
import { Store, select } from "@ngrx/store";
import * as fromActions from "state-management/actions/proposals.actions";
import {
  getFullqueryParams,
  getDatasetsQueryParams
} from "state-management/selectors/proposals.selectors";
import {
  withLatestFrom,
  map,
  mergeMap,
  catchError,
  switchMap
} from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class ProposalEffects {
  fullqueryParams$ = this.store.pipe(select(getFullqueryParams));
  datasetQueryParams$ = this.store.pipe(select(getDatasetsQueryParams));

  fetchProposals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.fetchProposalsAction,
        fromActions.changePageAction,
        fromActions.sortByColumnAction
      ),
      withLatestFrom(this.fullqueryParams$),
      map(([action, params]) => params),
      mergeMap(({ query, limits }) =>
        this.proposalApi.fullquery(query, limits).pipe(
          map(proposals =>
            fromActions.fetchProposalsCompleteAction({ proposals })
          ),
          catchError(() => of(fromActions.fetchProposalsFailedAction()))
        )
      )
    )
  );

  fetchCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchProposalsAction),
      withLatestFrom(this.fullqueryParams$),
      map(([action, params]) => params),
      switchMap(({ query }) =>
        this.proposalApi.fullquery(query).pipe(
          map(proposals =>
            fromActions.fetchCountCompleteAction({ count: proposals.length })
          ),
          catchError(() => of(fromActions.fetchCountFailedAction()))
        )
      )
    )
  );

  fetchProposal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchProposalAction),
      switchMap(action =>
        this.proposalApi.findById(action.proposalId).pipe(
          map((proposal: Proposal) =>
            fromActions.fetchProposalCompleteAction({ proposal })
          ),
          catchError(() => of(fromActions.fetchProposalFailedAction()))
        )
      )
    )
  );

  fetchProposalDatasets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchProposalDatasetsAction),
      withLatestFrom(this.datasetQueryParams$),
      switchMap(([action, { query, limits }]) =>
        this.datasetApi
          .find({
            where: { proposalId: action.proposalId },
            skip: limits.skip,
            limit: limits.limit,
            order: limits.order
          })
          .pipe(
            map((datasets: Dataset[]) =>
              fromActions.fetchProposalDatasetsCompleteAction({ datasets })
            ),
            catchError(() =>
              of(fromActions.fetchProposalDatasetsFailedAction())
            )
          )
      )
    )
  );

  fetchProposalDatasetsCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchProposalDatasetsAction),
      switchMap(({ proposalId }) =>
        this.datasetApi.count({ where: { proposalId } }).pipe(
          map(res =>
            fromActions.fetchProposalDatasetsCountCompleteAction({
              count: res.count
            })
          ),
          catchError(() =>
            of(fromActions.fetchProposalDatasetsCountFailedAction())
          )
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
        delete attachment.sampleId;
        return this.proposalApi
          .createAttachments(
            encodeURIComponent(attachment.proposalId),
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
      switchMap(action => {
        const newCaption = { caption: action.caption };
        return this.proposalApi
          .updateByIdAttachments(
            encodeURIComponent(action.proposalId),
            encodeURIComponent(action.attachmentId),
            newCaption
          )
          .pipe(
            map(res =>
              fromActions.updateAttachmentCaptionCompleteAction({
                attachment: res
              })
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
        this.proposalApi
          .destroyByIdAttachments(
            encodeURIComponent(action.proposalId),
            encodeURIComponent(action.attachmentId)
          )
          .pipe(
            map(res =>
              fromActions.removeAttachmentCompleteAction({ attachmentId: res })
            ),
            catchError(() => of(fromActions.removeAttachmentFailedAction()))
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private datasetApi: DatasetApi,
    private proposalApi: ProposalApi,
    private store: Store<any>
  ) {}
}
