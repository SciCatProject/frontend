import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { Observable } from "rxjs";
import { of } from "rxjs";
import { map, mergeMap, catchError } from "rxjs/operators";
import { ProposalsService } from "proposals/proposals.service";
import {
  FetchProposalsOutcomeAction,
  FetchProposalsAction,
  FETCH_PROPOSALS,
  FetchProposalsCompleteAction,
  FetchProposalsFailedAction,
  FetchProposalOutcomeAction,
  FetchProposalAction,
  FETCH_PROPOSAL,
  FetchProposalCompleteAction,
  FetchProposalFailedAction,
  FetchDatasetsForProposalOutcomeAction,
  FetchDatasetsForProposalAction,
  FETCH_DATASETS_FOR_PROPOSAL,
  FetchDatasetsForProposalCompleteAction,
  FetchDatasetsForProposalFailedAction
} from "../actions/proposals.actions";

@Injectable()
export class ProposalsEffects {
  @Effect()
  getProposals$: Observable<FetchProposalsOutcomeAction> = this.actions$.pipe(
    ofType<FetchProposalsAction>(FETCH_PROPOSALS),
    mergeMap(action =>
      this.proposalsService.getProposals().pipe(
        map(proposals => new FetchProposalsCompleteAction(proposals)),
        catchError(() => of(new FetchProposalsFailedAction()))
      )
    )
  );

  @Effect()
  getProposal$: Observable<FetchProposalOutcomeAction> = this.actions$.pipe(
    ofType<FetchProposalAction>(FETCH_PROPOSAL),
    mergeMap(action =>
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
    mergeMap(action =>
      this.proposalsService.getDatasetsForProposal(action.proposalId).pipe(
        map(datasets => new FetchDatasetsForProposalCompleteAction(datasets)),
        catchError(() => of(new FetchDatasetsForProposalFailedAction()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private proposalsService: ProposalsService
  ) {}
}
