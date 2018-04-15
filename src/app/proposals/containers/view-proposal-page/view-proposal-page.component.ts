import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { map, flatMap } from 'rxjs/operators';

import { FetchProposalsAction, SelectProposalAction, FetchProposalAction } from 'state-management/actions/proposals.actions';
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
    private fetchProposalSub: Subscription;
    private fetchDatasetsSub: Subscription;
    private selectProposalSub: Subscription;

    private proposalId$: Observable<string>;
    private proposal$: Observable<Proposal>;
    private datasets$: Observable<Dataset[]>;

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.proposalId$ = this.route.params
            .pipe(map(params => params.id));

        this.fetchProposalSub = this.proposalId$
            .pipe(map(id => new FetchProposalAction(id)))
            .subscribe(this.store);

        this.fetchDatasetsSub = this.proposalId$
            .pipe(map(id => new FetchDatasetsForProposalAction(id)))
            .subscribe(this.store);

        this.selectProposalSub = this.proposalId$
            .pipe(map(id => new SelectProposalAction(id)))
            .subscribe(this.store);
            
        this.proposal$ = this.store.pipe(select(getSelectedProposal));
        this.datasets$ = this.store.pipe(select(getSelectedProposalDatasets));
    }

    ngOnDestroy() {
        this.fetchProposalSub.unsubscribe();
        this.fetchDatasetsSub.unsubscribe();
        this.selectProposalSub.unsubscribe();
    }
};
