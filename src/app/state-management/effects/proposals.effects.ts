import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { map, mergeMap, catchError } from 'rxjs/operators';

import { ProposalsService } from 'proposals/proposals.service';

import {
	GetProposalsOutcomeAction,
	GetProposalsAction, GET_PROPOSALS,
	GetProposalsCompleteAction, GET_PROPOSALS_COMPLETE,
	GetProposalsFailedAction, GET_PROPOSALS_FAILED,
} from '../actions/proposals.actions';

import {
	LoginCompleteAction, LOGIN_COMPLETE
} from '../actions/user.actions';

import { Proposal } from '../models';

@Injectable()
export class ProposalsEffects {
	@Effect() getProposals$: Observable<GetProposalsOutcomeAction> = this.actions$.pipe(
		ofType(GET_PROPOSALS),
		mergeMap(action => 
			this.proposalsService.getProposals().pipe(
				map(proposals => new GetProposalsCompleteAction(proposals)),
				catchError(() => Observable.of(new GetProposalsFailedAction()))
			)
		)
	);
/*
	@Effect() loginComplete$: Observable<ProposalsAction> = this.actions$.pipe(
		ofType(LOGIN_COMPLETE),
		map(action => new GetProposalsAction())
	)
*/
	constructor(
		private actions$: Actions,
		private proposalsService: ProposalsService,
	) {}
}