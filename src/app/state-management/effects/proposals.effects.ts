import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import {
  catchError,
  map,
  switchMap,
  mergeMap,
  withLatestFrom
} from "rxjs/operators";
import {
  FETCH_DATASETS_FOR_PROPOSAL,
  FETCH_PROPOSAL,
  FETCH_PROPOSALS,
  FetchDatasetsForProposalAction,
  FetchDatasetsForProposalCompleteAction,
  FetchDatasetsForProposalFailedAction,
  FetchDatasetsForProposalOutcomeAction,
  FetchProposalAction,
  FetchProposalCompleteAction,
  FetchProposalFailedAction,
  FetchProposalOutcomeAction,
  FetchProposalsAction,
  FetchProposalsCompleteAction,
  FetchProposalsFailedAction,
  FetchProposalsOutcomeAction,
  FETCH_COUNT_PROPOSALS,
  FetchCountFailed,
  FetchCountOfProposalsSuccess,
  CHANGE_PAGE,
  SEARCH_PROPOSALS,
  SORT_PROPOSALS_BY_COLUMN,
  AddProposalAttachmentOutcomeActions,
  AddAttachmentAction,
  ADD_ATTACHMENT,
  AddAttachmentCompleteAction,
  AddAttachmentFailedAction,
  DeleteProposalAttachmentOutcomeActions,
  DeleteAttachmentAction,
  DELETE_ATTACHMENT,
  DeleteAttachmentCompleteAction,
  DeleteAttachmentFailedAction,
  UPDATE_ATTACHMENT_CAPTION,
  UpdateAttachmentCaptionAction,
  UpdateAttachmentCaptionCompleteAction,
  UpdateAttachmentCaptionFailedAction
} from "../actions/proposals.actions";

import { getPropFilters } from "state-management/selectors/proposals.selectors";
import { select, Action, Store } from "@ngrx/store";
import { ProposalApi, Proposal, Dataset, DatasetApi } from "shared/sdk";

@Injectable()
export class ProposalsEffects {
  @Effect({ dispatch: false })
  private queryParams$ = this.store.pipe(select(getPropFilters));

  @Effect()
  getProposals$: Observable<FetchProposalsOutcomeAction> = this.actions$.pipe(
    ofType<FetchProposalsAction>(
      FETCH_PROPOSALS,
      CHANGE_PAGE,
      SORT_PROPOSALS_BY_COLUMN
    ),
    withLatestFrom(this.queryParams$),
    map(([action, params]) => params),
    mergeMap(({ query, limits }) => {
      return this.proposalApi.fullquery(query, limits).pipe(
        map(
          proposals => new FetchProposalsCompleteAction(proposals as Proposal[])
        ),
        catchError(() => of(new FetchProposalsFailedAction()))
      );
    })
  );

  @Effect()
  private searchProposals$: Observable<Action> = this.actions$.pipe(
    ofType(SEARCH_PROPOSALS),
    withLatestFrom(this.queryParams$),
    map(([action, params]) => params),
    mergeMap(({ query, limits }) => {
      return this.proposalApi.fullquery(query, limits).pipe(
        map(
          proposals => new FetchProposalsCompleteAction(proposals as Proposal[])
        ),
        catchError(() => of(new FetchProposalsFailedAction()))
      );
    })
  );

  @Effect()
  FetchCountOfProposals$ = this.actions$.pipe(
    ofType(FETCH_COUNT_PROPOSALS),
    switchMap(action =>
      this.proposalApi.count().pipe(
        map(({ count }) => new FetchCountOfProposalsSuccess(count)),
        catchError(err => of(new FetchCountFailed()))
      )
    )
  );

  @Effect()
  getProposal$: Observable<FetchProposalOutcomeAction> = this.actions$.pipe(
    ofType<FetchProposalAction>(FETCH_PROPOSAL),
    switchMap(action =>
      this.proposalApi
        .findOne({ where: { proposalId: action.proposalId } })
        .pipe(
          map(
            (proposal: Proposal) => new FetchProposalCompleteAction(proposal)
          ),
          catchError(() => of(new FetchProposalFailedAction()))
        )
    )
  );

  @Effect()
  getDatasetsForProposal$: Observable<
    FetchDatasetsForProposalOutcomeAction
  > = this.actions$.pipe(
    ofType<FetchDatasetsForProposalAction>(FETCH_DATASETS_FOR_PROPOSAL),
    switchMap(action =>
      this.datasetApi.find({ where: { proposalId: action.proposalId } }).pipe(
        map(
          (datasets: Dataset[]) =>
            new FetchDatasetsForProposalCompleteAction(datasets)
        ),
        catchError(() => of(new FetchDatasetsForProposalFailedAction()))
      )
    )
  );

  @Effect()
  protected addAttachment$: Observable<
    AddProposalAttachmentOutcomeActions
  > = this.actions$.pipe(
    ofType<AddAttachmentAction>(ADD_ATTACHMENT),
    map((action: AddAttachmentAction) => action.attachment),
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
          map(res => new AddAttachmentCompleteAction(res)),
          catchError(err => of(new AddAttachmentFailedAction(err)))
        );
    })
  );

  @Effect()
  protected removeAttachment$: Observable<
    DeleteProposalAttachmentOutcomeActions
  > = this.actions$.pipe(
    ofType<DeleteAttachmentAction>(DELETE_ATTACHMENT),
    map((action: DeleteAttachmentAction) => action),
    switchMap(action => {
      return this.proposalApi
        .destroyByIdAttachments(
          encodeURIComponent(action.proposalId),
          action.attachmentId
        )
        .pipe(
          map(res => new DeleteAttachmentCompleteAction(res)),
          catchError(err => of(new DeleteAttachmentFailedAction(err)))
        );
    })
  );

  @Effect()
  protected updateAttachmentCaption$: Observable<Action> = this.actions$.pipe(
    ofType(UPDATE_ATTACHMENT_CAPTION),
    map((action: UpdateAttachmentCaptionAction) => action),
    switchMap(action => {
      const newCaption = { caption: action.caption };
      return this.proposalApi
        .updateByIdAttachments(
          encodeURIComponent(action.proposalId),
          encodeURIComponent(action.attachmentId),
          newCaption
        )
        .pipe(
          map(res => new UpdateAttachmentCaptionCompleteAction(res)),
          catchError(err => of(new UpdateAttachmentCaptionFailedAction(err)))
        );
    })
  );

  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private proposalApi: ProposalApi,
    private datasetApi: DatasetApi
  ) {}
}
