import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
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
  FetchProposalsOutcomeAction
} from "../actions/proposals.actions";

@Injectable()
export class ProposalsEffects {
  @Effect()
  getProposals$: Observable<FetchProposalsOutcomeAction> = this.actions$.pipe(
    ofType<FetchProposalsAction>(FETCH_PROPOSALS),
    switchMap(action =>
      this.proposalsService.getProposals().pipe(
        map(proposals => new FetchProposalsCompleteAction(proposals)),
        catchError(() => of(new FetchProposalsFailedAction()))
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
  getDatasetsForProposal$: Observable<FetchDatasetsForProposalOutcomeAction> = this.actions$.pipe(
    ofType<FetchDatasetsForProposalAction>(FETCH_DATASETS_FOR_PROPOSAL),
    switchMap(action =>
      this.proposalsService.getDatasetsForProposal(action.proposalId).pipe(
        map(datasets => new FetchDatasetsForProposalCompleteAction(datasets)),
        catchError(() => of(new FetchDatasetsForProposalFailedAction()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private proposalsService: ProposalsService
  ) {
  }
}
