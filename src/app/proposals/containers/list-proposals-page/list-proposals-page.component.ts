import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from 'state-management/state/app.store';
import { ProposalsState } from 'state-management/state/proposals.store';

import { Proposal } from 'state-management/models';
import { getProposalList } from 'state-management/selectors/proposals.selectors';

@Component({
	selector: 'list-proposals-page',
	templateUrl: 'list-proposals-page.component.html',
	styleUrls: ['list-proposals-page.component.css']
})
export class ListProposalsPageComponent {
	proposals$: Observable<Proposal[]>;

	constructor(private store: Store<AppState>) {
		this.proposals$ = store.pipe(select(getProposalList));
	}
};