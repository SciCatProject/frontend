import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, switchMap, mergeMap, withLatestFrom } from "rxjs/operators";
import { ProposalsService } from "proposals/proposals.service";
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
  FetchCountOfProposals,
  FETCH_COUNT_PROPOSALS,
  FetchCountFailed,
  FetchCountOfProposalsSuccess,
  CHANGE_PAGE
} from "../actions/proposals.actions";

import { getFilters } from "state-management/selectors/proposals.selectors";
import { select, Store } from "@ngrx/store";
import { ProposalApi, Proposal } from "shared/sdk";

@Injectable()
export class ProposalsEffects {
  @Effect({ dispatch: false })
  private queryParams$ = this.store.pipe(select(getFilters));

  @Effect()
  getProposals$: Observable<FetchProposalsOutcomeAction> = this.actions$.pipe(
    ofType<FetchProposalsAction>(FETCH_PROPOSALS, CHANGE_PAGE),
    withLatestFrom(this.queryParams$),
    map(([action, params]) => params),
    switchMap(params =>
      this.proposalApi.find(params.limits).pipe(
        mergeMap((data: Proposal[]) => [ new FetchProposalsCompleteAction(data),
          new FetchCountOfProposals()]),
        catchError(() => of(new FetchProposalsFailedAction()))
      )
    )
  );

  /*@Effect()
  FetchFilteredPublishedData$ = this.actions$.pipe(
    ofType<FetchAllPublishedData>(PublishedDataActionTypes.FetchAllPublishedData, PublishedDataActionTypes.ChangePagePub),
    withLatestFrom(this.queryParams$),
    map(([action, params]) => params),
    mergeMap(({ limits }) => this.publishedDataApi.find(limits)
    .pipe(map((data: PublishedData[]) => new LoadPublishedDatas({ publishedDatas: data })),
    catchError(err => of(new FailedPublishedDataAction(err))))));
*/


 /* @Effect()
  UpsertWaitPublishedData$ = this.actions$.pipe(
    ofType<UpsertWaitPublishedData>(PublishedDataActionTypes.UpsertWaitPublishedData),
    switchMap(action => this.publishedDataApi.create(action.payload.publishedData)
    .pipe(mergeMap((data: PublishedData) => [ new AddPublishedData({ publishedData: data }),
    new RegisterPublishedData({doi: data.doi})]),
    catchError(err => of(new FailedPublishedDataAction(err)))))
  );*/

  @Effect()
  FetchCountOfProposals$ = this.actions$.pipe(
    ofType(FETCH_COUNT_PROPOSALS),
    switchMap(action =>
      this.proposalsService.count().pipe(
        map(({ count }) => new FetchCountOfProposalsSuccess(count)),
        catchError(err => of(new FetchCountFailed()))
      )
    )
  );

  @Effect()
  getProposal$: Observable<FetchProposalOutcomeAction> = this.actions$.pipe(
    ofType<FetchProposalAction>(FETCH_PROPOSAL),
    switchMap(action =>
      this.proposalsService.getProposal(action.proposalId).pipe(
        map(proposal => new FetchProposalCompleteAction(proposal)),
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
      this.proposalsService.getDatasetsForProposal(action.proposalId).pipe(
        map(datasets => new FetchDatasetsForProposalCompleteAction(datasets)),
        catchError(() => of(new FetchDatasetsForProposalFailedAction()))
      )
    )
  );

  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private proposalsService: ProposalsService,
    private proposalApi: ProposalApi
  ) {}
}
