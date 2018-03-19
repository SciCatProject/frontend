import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from 'state-management/state/app.store';
import { ProposalState } from 'state-management/state/proposal.store';

import { Proposal } from 'state-management/models';

@Component({
	selector: 'proposals-list',
	templateUrl: './proposals-list.component.html',
	styleUrls: ['./proposals-list.component.css']
})
export class ProposalsListComponent {
	proposals$: Observable<Proposal[]>;

	constructor(private store: Store<AppState>) {
		/*this.proposals$ = store
			.select((appState: AppState) => appState.proposals)
			.select((proposalsState: ProposalsState) => proposalsState.list);*/

		const proposalsSelector = select((appState: AppState) => appState.proposals);
		const listSelector = select((propState: ProposalState) => propState.list);

		this.proposals$ = store.pipe(proposalsSelector, listSelector);
	}
};