import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import {
  DatasetsService,
  ProposalClass,
  ProposalsService,
} from "@scicatproject/scicat-sdk-ts-angular";
import { Action, Store } from "@ngrx/store";
import * as fromActions from "state-management/actions/proposals.actions";
import {
  selectFullqueryParams,
  selectDatasetsQueryParams,
  selectCurrentProposal,
  selectRelatedProposalsFilters,
} from "state-management/selectors/proposals.selectors";
import { map, mergeMap, catchError, switchMap, filter } from "rxjs/operators";
import { ObservableInput, of } from "rxjs";
import {
  loadingAction,
  loadingCompleteAction,
} from "state-management/actions/user.actions";

@Injectable()
export class ProposalEffects {
  currentProposal$ = this.store.select(selectCurrentProposal);
  relatedProposalFilters$ = this.store.select(selectRelatedProposalsFilters);
  fullqueryParams$ = this.store.select(selectFullqueryParams);
  datasetQueryParams$ = this.store.select(selectDatasetsQueryParams);

  fetchProposals$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchProposalsAction),
      switchMap(({ skip, limit, search, sortColumn, sortDirection }) => {
        const limitsParam = {
          skip: skip,
          limit: limit,
          order: undefined,
        };

        if (sortColumn && sortDirection) {
          limitsParam.order = `${sortColumn}:${sortDirection}`;
        }

        const queryParam = search || {};

        return this.proposalsService
          .proposalsControllerFullqueryV3(
            JSON.stringify(limitsParam),
            JSON.stringify(queryParam),
          )
          .pipe(
            mergeMap((proposals) => [
              fromActions.fetchProposalsCompleteAction({ proposals }),
            ]),
            catchError(() => of(fromActions.fetchProposalsFailedAction())),
          );
      }),
    );
  });

  fetchFacetCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchFacetCountsAction),
      switchMap(({ fields, facets }) => {
        return this.proposalsService
          .proposalsControllerFullfacetV3(
            JSON.stringify(facets),
            JSON.stringify(fields),
          )
          .pipe(
            map((res) => {
              const { all, ...facetCounts } = res[0];
              const allCounts = all && all.length > 0 ? all[0].totalSets : 0;
              return fromActions.fetchFacetCountsCompleteAction({
                facetCounts,
                allCounts,
              });
            }),
            catchError(() => of(fromActions.fetchFacetCountsFailedAction())),
          );
      }),
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
      mergeMap(({ skip, limit, sortColumn, sortDirection, proposalId }) => {
        return this.datasetsService
          .datasetsControllerFindAllV3(
            JSON.stringify({
              where: { proposalId },
              limits: {
                skip: skip,
                limit: limit,
                order: sortDirection
                  ? `${sortColumn}:${sortDirection}`
                  : undefined,
              },
            }),
          )
          .pipe(
            mergeMap((datasets) => [
              fromActions.fetchProposalDatasetsCompleteAction({
                datasets,
                limit,
                skip,
              }),
              fromActions.fetchProposalDatasetsCountAction({ proposalId }),
            ]),
            catchError(() =>
              of(fromActions.fetchProposalDatasetsFailedAction()),
            ),
          );
      }),
    );
  });

  fetchProposalDatasetsCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchProposalDatasetsCountAction),
      switchMap(({ proposalId }) =>
        this.datasetsService
          .datasetsControllerCountV3(JSON.stringify({ where: { proposalId } }))
          .pipe(
            map(({ count }) =>
              fromActions.fetchProposalDatasetsCountCompleteAction({
                count,
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
          .proposalsControllerCreateAttachmentV3(theRest.proposalId, theRest)
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
          .proposalsControllerFindOneAttachmentAndUpdateV3(
            proposalId,
            attachmentId,
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
        this.proposalsService
          .proposalsControllerUpdateV3(proposalId, property)
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
        this.proposalsService
          .proposalsControllerFindOneAttachmentAndRemoveV3(
            proposalId,
            attachmentId,
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

  fetchRelatedProposals$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchRelatedProposalsAction),
      concatLatestFrom(() => [this.currentProposal$]),
      switchMap(([{ limit, skip, sortColumn, sortDirection }, proposal]) => {
        const queryFilter = {
          limits: {
            skip,
            limit,
            order: sortDirection ? `${sortColumn}:${sortDirection}` : undefined,
          },
          where: {
            $or: [
              { proposalId: { $in: [proposal.parentProposalId] } },
              { parentProposalId: { $in: [proposal.proposalId] } },
            ],
          },
        };

        return this.proposalsService
          .proposalsControllerFindAllV3(JSON.stringify(queryFilter))
          .pipe(
            map((relatedProposals) => {
              const relatedProposalsWithRelations = relatedProposals.map(
                (p) => {
                  return {
                    ...p,
                    relation:
                      p.proposalId === proposal.parentProposalId
                        ? "parent"
                        : "child",
                  };
                },
              );

              return fromActions.fetchRelatedProposalsCompleteAction({
                relatedProposals: relatedProposalsWithRelations,
              });
            }),
            catchError(() =>
              of(fromActions.fetchRelatedProposalsFailedAction()),
            ),
          );
      }),
    );
  });

  fetchRelatedProposalsCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchRelatedProposalsAction),
      concatLatestFrom(() => [this.currentProposal$]),
      switchMap(([, proposal]) => {
        const queryFilter = {
          $or: [
            { proposalId: { $in: [proposal.parentProposalId] } },
            { parentProposalId: { $in: [proposal.proposalId] } },
          ],
        };

        return this.proposalsService
          .proposalsControllerCountV3({
            fields: JSON.stringify({}),
            filter: JSON.stringify(queryFilter),
          })
          .pipe(
            map(({ count }) =>
              fromActions.fetchRelatedProposalsCountCompleteAction({
                count,
              }),
            ),
            catchError(() =>
              of(fromActions.fetchRelatedProposalsCountFailedAction()),
            ),
          );
      }),
    );
  });

  loading$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchProposalsAction,
        fromActions.fetchParentProposalAction,
        fromActions.fetchFacetCountsAction,
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
        fromActions.fetchFacetCountsCompleteAction,
        fromActions.fetchFacetCountsFailedAction,
        fromActions.fetchProposalCompleteAction,
        fromActions.fetchProposalFailedAction,
        fromActions.fetchProposalAccessFailedAction,
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
        fromActions.fetchRelatedProposalsCompleteAction,
        fromActions.fetchRelatedProposalsFailedAction,
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

  private createProposalFetchEffect(
    triggerAction: string,
    completeAction: (props: { proposal: ProposalClass }) => Action,
    failedAction: () => Action,
    accessFailedAction: () => Action,
  ) {
    return createEffect(() => {
      return this.actions$.pipe(
        ofType(triggerAction),
        switchMap<ProposalClass, ObservableInput<Action>>(({ proposalId }) =>
          this.proposalsService
            .proposalsControllerFindByIdAccessV3(proposalId)
            .pipe(
              switchMap((permission) => {
                if (permission.canAccess) {
                  return this.proposalsService
                    .proposalsControllerFindByIdV3(proposalId)
                    .pipe(
                      map((proposal) => completeAction({ proposal })),
                      catchError(() => of(failedAction())),
                    );
                } else {
                  return of(accessFailedAction());
                }
              }),
              catchError(() => of(accessFailedAction())),
            ),
        ),
      );
    });
  }
}
