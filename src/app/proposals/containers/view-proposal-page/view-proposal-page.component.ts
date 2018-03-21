import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { AppState } from 'state-management/state/app.store';
import { GetProposalsAction, SelectProposalAction } from 'state-management/actions/proposals.actions';
import { Proposal } from 'state-management/models';
import { getSelectedProposal } from 'state-management/selectors/proposals.selectors';

@Component({
	selector: 'view-proposal-page',
	templateUrl: 'view-proposal-page.component.html',
	styleUrls: ['view-proposal-page.component.css']
})
export class ViewProposalPageComponent implements OnInit, OnDestroy {
	subscription: Subscription;
	proposal$: Observable<Proposal>;

	constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

	ngOnInit() {
		this.subscription = this.route.params
			.pipe(map(params => new SelectProposalAction(params.id)))
			.subscribe(this.store);

		this.proposal$ = this.store.pipe(select(getSelectedProposal));
		this.store.dispatch(new GetProposalsAction());
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
};
