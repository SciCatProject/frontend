import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, concatLatestFrom } from "@ngrx/effects";
import { DatasetApi, ProposalApi, Proposal, Dataset } from "shared/sdk";
import { Action, Store } from "@ngrx/store";
import * as fromActions from "state-management/actions/proposals.actions";
import {
  selectFullqueryParams,
  selectDatasetsQueryParams,
} from "state-management/selectors/proposals.selectors";
import { map, mergeMap, catchError, switchMap, filter } from "rxjs/operators";
import { ObservableInput, of } from "rxjs";
import {
  loadingAction,
  loadingCompleteAction,
} from "state-management/actions/user.actions";

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
        this.proposalApi.fullquery(query, limits).pipe(
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
        this.proposalApi.fullquery(query).pipe(
          map((proposals) =>
            fromActions.fetchCountCompleteAction({ count: proposals.length }),
          ),
          catchError(() => of(fromActions.fetchCountFailedAction())),
        ),
      ),
    );
  });

  fetchProposal$ = this.createProposalFetchEffect(
    fromActions.fetchProposalAction.type,
    fromActions.fetchProposalCompleteAction,
    fromActions.fetchProposalFailedAction,
    fromActions.fetchProposalAccessFailedAction,
  );

  fetchParentProposal$ = this.createProposalFetchEffect(
    fromActions.fetchParentProposalAction.type,
    fromActions.fetchParentProposalCompleteAction,
    fromActions.fetchParentProposalFailedAction,
    fromActions.fetchParentProposalAccessFailedAction,
  );

  fetchProposalDatasets$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchProposalDatasetsAction),
      concatLatestFrom(() => this.datasetQueryParams$),
      switchMap(([{ proposalId }, { limits }]) =>
        this.datasetApi
          .find<Dataset>({
            where: { proposalId },
            skip: limits.skip,
            limit: limits.limit,
            order: limits.order,
          })
          .pipe(
            mergeMap((datasets: Dataset[]) => [
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
        this.datasetApi.find({ where: { proposalId } }).pipe(
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
        const { id, rawDatasetId, derivedDatasetId, sampleId, ...theRest } =
          attachment;
        return this.proposalApi
          .createAttachments(encodeURIComponent(theRest.proposalId), theRest)
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
        return this.proposalApi
          .updateByIdAttachments(
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

  updateProposalProperty$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updateProposalPropertyAction),
      switchMap(({ proposalId, property }) =>
        this.proposalApi
          .patchAttributes(encodeURIComponent(proposalId), property)
          .pipe(
            switchMap(() => [
              fromActions.updateProposalPropertyCompleteAction(),
              fromActions.fetchProposalAction({ proposalId }),
            ]),
            catchError(() =>
              of(fromActions.updateProposalPropertyFailedAction()),
            ),
          ),
      ),
    );
  });

  removeAttachment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.removeAttachmentAction),
      switchMap(({ proposalId, attachmentId }) =>
        this.proposalApi
          .destroyByIdAttachments(
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
        fromActions.fetchParentProposalAction,
        fromActions.fetchCountAction,
        fromActions.fetchProposalAction,
        fromActions.fetchProposalDatasetsAction,
        fromActions.fetchProposalDatasetsCountAction,
        fromActions.addAttachmentAction,
        fromActions.updateAttachmentCaptionAction,
        fromActions.updateProposalPropertyAction,
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
        fromActions.fetchParentProposalCompleteAction,
        fromActions.fetchParentProposalFailedAction,
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
        fromActions.updateProposalPropertyCompleteAction,
        fromActions.updateProposalPropertyFailedAction,
        fromActions.removeAttachmentCompleteAction,
        fromActions.removeAttachmentFailedAction,
      ),
      switchMap(() => of(loadingCompleteAction())),
    );
  });

  constructor(
    private actions$: Actions,
    private datasetApi: DatasetApi,
    private proposalApi: ProposalApi,
    private store: Store,
  ) {}

  private createProposalFetchEffect(
    triggerAction: string,
    completeAction: (props: { proposal: Proposal }) => Action,
    failedAction: () => Action,
    accessFailedAction: () => Action,
  ) {
    return createEffect(() => {
      return this.actions$.pipe(
        ofType(triggerAction),
        switchMap<Proposal, ObservableInput<Action>>(({ proposalId }) =>
          this.proposalApi.findByIdAccess(encodeURIComponent(proposalId)).pipe(
            filter(
              (permission: { canAccess: boolean }) => permission.canAccess,
            ),
            switchMap(() =>
              this.proposalApi
                .findById<Proposal>(encodeURIComponent(proposalId))
                .pipe(
                  map((proposal) => completeAction({ proposal })),
                  catchError(() => of(failedAction())),
                ),
            ),
            catchError(() => of(accessFailedAction())),
          ),
        ),
      );
    });
  }
}
