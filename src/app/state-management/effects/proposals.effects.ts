import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/Observable/of';
import { map, mergeMap, catchError } from 'rxjs/operators';

import ProposalsService from 'proposals/proposals.service';

import {
	ProposalsAction,
	GetProposalsAction, GET_PROPOSALS,
	GetProposalsCompleteAction, GET_PROPOSALS_COMPLETE,
	GetProposalsFailedAction, GET_PROPOSALS_FAILED,
} from '../actions/proposals.actions';
import { Proposal } from '../models';

@Injectable()
export class ProposalsEffects {
	@Effect() getProposals$: Observable<ProposalsAction> = this.actions$.pipe(
		ofType(GET_PROPOSALS),
		mergeMap(action => 
			this.proposalsService.getProposals().pipe(
				map(proposals => new GetProposalsCompleteAction(proposals)),
				catchError(() => of(new GetProposalsFailedAction()))
			)
		)
	);

	constructor(
		private actions$: Actions,
		private proposalsService: ProposalsService,
	) {}
}