import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, concatLatestFrom } from "@ngrx/effects";
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
        this.proposalsService
          .proposalsControllerFullquery(JSON.stringify(limits), query)
          .pipe(
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
          map((res) => {
            const { all } = res[0];
            const allCounts = all && all.length > 0 ? all[0].totalSets : 0;

            return fromActions.fetchCountCompleteAction({ count: allCounts });
          }),
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
          .proposalsControllerCreateAttachment(theRest.proposalId, theRest)
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
          .proposalsControllerUpdate(proposalId, property)
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
          .proposalsControllerFindOneAttachmentAndRemove(
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
            .proposalsControllerFindByIdAccess(proposalId)
            .pipe(
              filter((permission) => permission.canAccess),
              switchMap(() =>
                this.proposalsService
                  .proposalsControllerFindById(proposalId)
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
