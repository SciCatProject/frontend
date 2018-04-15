import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { FetchProposalsAction, SelectProposalAction } from 'state-management/actions/proposals.actions';
import { FetchDatasetsForProposalAction } from 'state-management/actions/datasets.actions';

import { AppState } from 'state-management/state/app.store';
import { Dataset, Proposal } from 'state-management/models';
import { getSelectedProposal, getSelectedProposalDatasets } from 'state-management/selectors/proposals.selectors';

@Component({
    selector: 'view-proposal-page',
    templateUrl: 'view-proposal-page.component.html',
    styleUrls: ['view-proposal-page.component.css']
})
export class ViewProposalPageComponent implements OnInit, OnDestroy {
    fetchDatasetsSub: Subscription;
    selectProposalSub: Subscription;

    proposalId$: Observable<string>;
    proposal$: Observable<Proposal>;
    datasets$: Observable<Dataset[]>;

    constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

    ngOnInit() {
        this.proposalId$ = this.route.params
            .pipe(map(params => params.id));

        this.fetchDatasetsSub = this.proposalId$
            .pipe(map(id => new FetchDatasetsForProposalAction(id)))
            .subscribe(this.store);

        this.selectProposalSub = this.proposalId$
            .pipe(map(id => new SelectProposalAction(id)))
            .subscribe(this.store);
            
        this.proposal$ = this.store.pipe(select(getSelectedProposal));
        this.datasets$ = this.store.pipe(select(getSelectedProposalDatasets));

        this.store.dispatch(new FetchProposalsAction());
    }

    ngOnDestroy() {
        this.fetchDatasetsSub.unsubscribe();
        this.selectProposalSub.unsubscribe();
    }
};
