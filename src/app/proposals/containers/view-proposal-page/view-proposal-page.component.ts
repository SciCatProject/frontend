import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { AppState } from 'state-management/state/app.store';
import { FetchProposalsAction, SelectProposalAction } from 'state-management/actions/proposals.actions';
import { Dataset, Proposal } from 'state-management/models';
import { getSelectedProposal, getSelectedProposalDatasets } from 'state-management/selectors/proposals.selectors';

@Component({
    selector: 'view-proposal-page',
    templateUrl: 'view-proposal-page.component.html',
    styleUrls: ['view-proposal-page.component.css']
})
export class ViewProposalPageComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    proposal$: Observable<Proposal>;
    datasets$: Observable<Dataset[]>;

    constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

    ngOnInit() {
        this.subscription = this.route.params
            .pipe(map(params => new SelectProposalAction(params.id)))
            .subscribe(this.store);

        this.proposal$ = this.store.pipe(select(getSelectedProposal));
        this.datasets$ = this.store.pipe(select(getSelectedProposalDatasets));

        this.store.dispatch(new FetchProposalsAction());
        
        // Here we need to make sure that datasets belonging to the
        // proposal in question are fetched.
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
};
