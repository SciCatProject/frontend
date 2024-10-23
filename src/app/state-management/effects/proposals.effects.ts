import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, concatLatestFrom } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import * as fromActions from "state-management/actions/proposals.actions";
import {
  selectFullqueryParams,
  selectDatasetsQueryParams,
} from "state-management/selectors/proposals.selectors";
import { map, mergeMap, catchError, switchMap, filter } from "rxjs/operators";
import { of } from "rxjs";
import {
  loadingAction,
  loadingCompleteAction,
} from "state-management/actions/user.actions";
import { DatasetsService, ProposalsService } from "shared/sdk";

@Injectable()
export class ProposalEffects {
  fullqueryParams$ = this.store.select(selectFullqueryParams);
  datasetQueryParams$ = this.store.select(selectDatasetsQueryParams);

  fetchProposals$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchProposalsAction,
        fromActions.changePageAction,
        fromActions.sortByColumnAction,
        fromActions.clearFacetsAction,
      ),
      concatLatestFrom(() => this.fullqueryParams$),
      map(([action, params]) => params),
      mergeMap(({ query, limits }) =>
        // @ts-expect-error FIXME: Fix this one as the backend types are not correct
        this.proposalsService.proposalsControllerFullquery(query, limits).pipe(
          mergeMap((proposals) => [
            fromActions.fetchProposalsCompleteAction({ proposals }),
            fromActions.fetchCountAction(),
          ]),
          catchError(() => of(fromActions.fetchProposalsFailedAction())),
        ),
      ),
    );
  });

  fetchCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchCountAction),
      concatLatestFrom(() => this.fullqueryParams$),
      map(([action, params]) => params),
      switchMap(({ query }) =>
        this.proposalsService.proposalsControllerFullfacet(query).pipe(
          map((proposals) =>
            fromActions.fetchCountCompleteAction({ count: proposals.length }),
          ),
          catchError(() => of(fromActions.fetchCountFailedAction())),
        ),
      ),
    );
  });

  fetchProposal$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchProposalAction),
      switchMap(({ proposalId }) => {
        return (
          this.proposalsService
            .proposalsControllerFindByIdAccess(proposalId)
            // TODO: Check the backend type because it is incorrect. It says that the ApiResponse is Boolean but it actually returns {canAccess: boolean}
            .pipe(
              filter(
                (permission) =>
                  (permission as unknown as { canAccess: boolean }).canAccess,
              ),
              switchMap(() =>
                this.proposalsService
                  .proposalsControllerFindById(encodeURIComponent(proposalId))
                  .pipe(
                    map((proposal) =>
                      fromActions.fetchProposalCompleteAction({ proposal }),
                    ),
                    catchError(() =>
                      of(fromActions.fetchProposalFailedAction()),
                    ),
                  ),
              ),
              catchError(() =>
                of(fromActions.fetchProposalAccessFailedAction()),
              ),
            )
        );
      }),
    );
  });

  fetchProposalDatasets$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchProposalDatasetsAction),
      concatLatestFrom(() => this.datasetQueryParams$),
      switchMap(([{ proposalId }, { limits }]) =>
        this.datasetsService
          .datasetsControllerFindAll(
            JSON.stringify({
              where: { proposalId },
              skip: limits.skip,
              limit: limits.limit,
              order: limits.order,
            }),
          )
          .pipe(
            mergeMap((datasets) => [
              fromActions.fetchProposalDatasetsCompleteAction({ datasets }),
              fromActions.fetchProposalDatasetsCountAction({ proposalId }),
            ]),
            catchError(() =>
              of(fromActions.fetchProposalDatasetsFailedAction()),
            ),
          ),
      ),
    );
  });

  fetchProposalDatasetsCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchProposalDatasetsCountAction),
      switchMap(({ proposalId }) =>
        this.datasetsService
          .datasetsControllerFindAll(JSON.stringify({ where: { proposalId } }))
          .pipe(
            map((datasets) =>
              fromActions.fetchProposalDatasetsCountCompleteAction({
                count: datasets.length,
              }),
            ),
            catchError(() =>
              of(fromActions.fetchProposalDatasetsCountFailedAction()),
            ),
          ),
      ),
    );
  });

  addAttachment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.addAttachmentAction),
      switchMap(({ attachment }) => {
        const { id, sampleId, ...theRest } = attachment;
        return this.proposalsService
          .proposalsControllerCreateAttachment(
            encodeURIComponent(theRest.proposalId),
            theRest,
          )
          .pipe(
            map((res) =>
              fromActions.addAttachmentCompleteAction({ attachment: res }),
            ),
            catchError(() => of(fromActions.addAttachmentFailedAction())),
          );
      }),
    );
  });

  updateAttachmentCaption$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updateAttachmentCaptionAction),
      switchMap(({ proposalId, attachmentId, caption }) => {
        const newCaption = { caption };
        return this.proposalsService
          .proposalsControllerFindOneAttachmentAndUpdate(
            encodeURIComponent(proposalId),
            encodeURIComponent(attachmentId),
            newCaption,
          )
          .pipe(
            map((attachment) =>
              fromActions.updateAttachmentCaptionCompleteAction({
                attachment,
              }),
            ),
            catchError(() =>
              of(fromActions.updateAttachmentCaptionFailedAction()),
            ),
          );
      }),
    );
  });

  removeAttachment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.removeAttachmentAction),
      switchMap(({ proposalId, attachmentId }) =>
        this.proposalsService
          .proposalsControllerFindOneAttachmentAndRemove(
            encodeURIComponent(proposalId),
            encodeURIComponent(attachmentId),
          )
          .pipe(
            map((res) =>
              fromActions.removeAttachmentCompleteAction({ attachmentId: res }),
            ),
            catchError(() => of(fromActions.removeAttachmentFailedAction())),
          ),
      ),
    );
  });

  loading$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchProposalsAction,
        fromActions.fetchCountAction,
        fromActions.fetchProposalAction,
        fromActions.fetchProposalDatasetsAction,
        fromActions.fetchProposalDatasetsCountAction,
        fromActions.addAttachmentAction,
        fromActions.updateAttachmentCaptionAction,
        fromActions.removeAttachmentAction,
      ),
      switchMap(() => of(loadingAction())),
    );
  });

  loadingComplete$ = createEffect(() => {
    return this.actions$.pipe(
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
        fromActions.removeAttachmentFailedAction,
      ),
      switchMap(() => of(loadingCompleteAction())),
    );
  });

  constructor(
    private actions$: Actions,
    private datasetsService: DatasetsService,
    private proposalsService: ProposalsService,
    private store: Store,
  ) {}
}
