import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { AppState } from 'state-management/state/app.store';
import { SelectProposalAction } from 'state-management/actions/proposals.actions';
import { Proposal } from 'state-management/models';
import { getSelectedProposal } from 'state-management/selectors/proposals.selectors';

// import { Observable } from 'rxjs/Observable';
// 
// import { Proposal } from 'state-management/models';
// /*import { AppState } from 'state-management/state/app.store';
// import { ProposalState } from 'state-management/state/proposal.store';*/
// 
// @Component({
// 	selector: 'proposal-detail',
// 	templateUrl: 'proposal-detail.component.html',
// 	styleUrls: ['proposal-detail.component.css']
// })
// export class ViewProposalPageComponent {
// 	currentProposal
// 
// 	constructor(route: ActivatedRoute) {
// 		this.
// 	}
// };

@Component({
	selector: 'view-proposal-page',
	templateUrl: 'view-proposal-page.component.html',
	styleUrls: ['view-proposal-page.component.css']
})
export class ViewProposalPageComponent {
	subscription: Subscription;
	proposal$: Observable<Proposal>;

	constructor(store: Store<AppState>, route: ActivatedRoute) {
		this.subscription = route.params
		.pipe(map(params => new SelectProposalAction(params.id)))
		.subscribe(store);

		this.proposal$ = store.pipe(select(getSelectedProposal));
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
};
