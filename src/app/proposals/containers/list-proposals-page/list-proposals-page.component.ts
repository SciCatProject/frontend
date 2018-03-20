import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from 'state-management/state/app.store';
import { ProposalsState } from 'state-management/state/proposals.store';

import { Proposal } from 'state-management/models';
import { getProposalList } from 'state-management/selectors/proposals.selectors';

@Component({
	selector: 'proposals-list',
	templateUrl: 'proposals-list.component.html',
	styleUrls: ['proposals-list.component.css']
})
export class ProposalsListComponent {
	proposals$: Observable<Proposal[]>;

	constructor(private store: Store<AppState>) {
		this.proposals$ = store.pipe(select(getProposalList));
	}
};