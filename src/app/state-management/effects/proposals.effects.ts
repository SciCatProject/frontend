import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { map, mergeMap, take, catchError } from 'rxjs/operators';

import { ProposalsService } from 'proposals/proposals.service';

import {
	FetchProposalsOutcomeAction,
	FetchProposalsAction, FETCH_PROPOSALS,
	FetchProposalsCompleteAction, FETCH_PROPOSALS_COMPLETE,
	FetchProposalsFailedAction, FETCH_PROPOSALS_FAILED,
} from '../actions/proposals.actions';

import {
	LoginCompleteAction, LOGIN_COMPLETE
} from '../actions/user.actions';

import { Proposal } from '../models';

@Injectable()
export class ProposalsEffects {
	@Effect() getProposals$: Observable<FetchProposalsOutcomeAction> = this.actions$.pipe(
		ofType(FETCH_PROPOSALS),
		take(1),
		mergeMap(action => 
			this.proposalsService.getProposals().pipe(
				map(proposals => new FetchProposalsCompleteAction(proposals)),
				catchError(() => Observable.of(new FetchProposalsFailedAction()))
			)
		)
	);

	constructor(
		private actions$: Actions,
		private proposalsService: ProposalsService,
	) {}
}
