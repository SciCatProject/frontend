import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { AppState } from 'state-management/state/app.store';
import { ProposalsState } from 'state-management/state/proposals.store';

import { Proposal } from 'state-management/models';
import { getProposalList } from 'state-management/selectors/proposals.selectors';
import { GetProposalsAction } from 'state-management/actions/proposals.actions';

@Component({
    selector: 'list-proposals-page',
    templateUrl: 'list-proposals-page.component.html',
    styleUrls: ['list-proposals-page.component.css']
})
export class ListProposalsPageComponent implements OnInit {
    proposals$: Observable<Proposal[]>;

    constructor(private store: Store<AppState>) {}

    ngOnInit() {
        this.proposals$ = this.store.pipe(select(getProposalList));
        this.store.dispatch(new GetProposalsAction());
    }
};