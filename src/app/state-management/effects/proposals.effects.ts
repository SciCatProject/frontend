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
  CHANGE_PAGE,
  SEARCH_PROPOSALS
} from "../actions/proposals.actions";

import { getFilters, getPropFilters } from "state-management/selectors/proposals.selectors";
import { select, Action, Store } from "@ngrx/store";
import { ProposalApi, Proposal } from "shared/sdk";

@Injectable()
export class ProposalsEffects {
  @Effect({ dispatch: false })
  private queryParams$ = this.store.pipe(select(getPropFilters));

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

  @Effect()
  private searchProposals$: Observable<Action> = this.actions$.pipe(
    ofType(SEARCH_PROPOSALS),
    withLatestFrom(this.queryParams$),
    map(([action, params]) => params),
    mergeMap(({ query, limits }) => {
      console.log("gm query", query);
      console.log("gm limits", limits);
      return this.proposalApi.fullquery(query, limits).pipe(
        map(
          proposals =>
            new FetchProposalsCompleteAction(
              proposals as Proposal[]
            )
        ),
        catchError(() => of(new FetchProposalsFailedAction()))
      );
    })
  );

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
