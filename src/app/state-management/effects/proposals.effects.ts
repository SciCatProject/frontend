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
import {
  loadingAction,
  loadingCompleteAction
} from "state-management/actions/user.actions";

@Injectable()
export class ProposalEffects {
  fullqueryParams$ = this.store.pipe(select(getFullqueryParams));
  datasetQueryParams$ = this.store.pipe(select(getDatasetsQueryParams));

  fetchProposals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.fetchProposalsAction,
        fromActions.changePageAction,
        fromActions.sortByColumnAction,
        fromActions.clearFacetsAction
      ),
      withLatestFrom(this.fullqueryParams$),
      map(([action, params]) => params),
      mergeMap(({ query, limits }) =>
        this.proposalApi.fullquery(query, limits).pipe(
          mergeMap(proposals => [
            fromActions.fetchProposalsCompleteAction({ proposals }),
            fromActions.fetchCountAction()
          ]),
          catchError(() => of(fromActions.fetchProposalsFailedAction()))
        )
      )
    )
  );

  fetchCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchCountAction),
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
      switchMap(({ proposalId }) =>
        this.proposalApi.findById(proposalId).pipe(
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
      switchMap(([{ proposalId }, { limits }]) =>
        this.datasetApi
          .find({
            where: { proposalId },
            skip: limits.skip,
            limit: limits.limit,
            order: limits.order
          })
          .pipe(
            mergeMap((datasets: Dataset[]) => [
              fromActions.fetchProposalDatasetsCompleteAction({ datasets }),
              fromActions.fetchProposalDatasetsCountAction({ proposalId })
            ]),
            catchError(() =>
              of(fromActions.fetchProposalDatasetsFailedAction())
            )
          )
      )
    )
  );

  fetchProposalDatasetsCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchProposalDatasetsCountAction),
      switchMap(({ proposalId }) =>
        this.datasetApi.find({ where: { proposalId } }).pipe(
          map(datasets =>
            fromActions.fetchProposalDatasetsCountCompleteAction({
              count: datasets.length
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
      switchMap(({ attachment }) => {
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
      switchMap(({ proposalId, attachmentId, caption }) => {
        const newCaption = { caption };
        return this.proposalApi
          .updateByIdAttachments(
            encodeURIComponent(proposalId),
            encodeURIComponent(attachmentId),
            newCaption
          )
          .pipe(
            map(attachment =>
              fromActions.updateAttachmentCaptionCompleteAction({
                attachment
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
      switchMap(({ proposalId, attachmentId }) =>
        this.proposalApi
          .destroyByIdAttachments(
            encodeURIComponent(proposalId),
            encodeURIComponent(attachmentId)
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

  loading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.fetchProposalsAction,
        fromActions.fetchCountAction,
        fromActions.fetchProposalAction,
        fromActions.fetchProposalDatasetsAction,
        fromActions.fetchProposalDatasetsCountAction,
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
        fromActions.fetchProposalsCompleteAction,
        fromActions.fetchProposalsFailedAction,
        fromActions.fetchCountCompleteAction,
        fromActions.fetchCountFailedAction,
        fromActions.fetchProposalCompleteAction,
        fromActions.fetchProposalFailedAction,
        fromActions.fetchProposalDatasetsCompleteAction,
        fromActions.fetchProposalDatasetsFailedAction,
        fromActions.fetchProposalDatasetsCountCompleteAction,
        fromActions.fetchProposalDatasetsCountFailedAction,
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

  constructor(
    private actions$: Actions,
    private datasetApi: DatasetApi,
    private proposalApi: ProposalApi,
    private store: Store<any>
  ) {}
}
