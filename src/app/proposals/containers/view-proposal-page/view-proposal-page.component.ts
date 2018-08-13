import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subscription ,  Observable } from 'rxjs';
import { map, filter, flatMap } from 'rxjs/operators';
import {
    SelectProposalAction,
    FetchProposalAction,
    FetchDatasetsForProposalAction
} from 'state-management/actions/proposals.actions';
import {
    getSelectedProposal,
    getSelectedProposalDatasets
} from 'state-management/selectors/proposals.selectors';
import { AppState } from 'state-management/state/app.store';
import { Dataset, Proposal } from 'state-management/models';

@Component({
    selector: 'view-proposal-page',
    template: `
        <proposal-detail
            *ngIf="proposal$ | async"
            [proposal]="proposal$ | async"
            [datasets]="datasets$ | async">
        </proposal-detail>
    `
})
export class ViewProposalPageComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    private proposalId$: Observable<string>;
    proposal$: Observable<Proposal>;
    private datasets$: Observable<Dataset[]>;

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.proposalId$ = this.route.params
            .pipe(
                map(params => params.id),
                filter(id => id != null)
            );

        this.subscription = this.proposalId$
            .pipe(
                flatMap(id => [
                    new FetchProposalAction(id),
                    new FetchDatasetsForProposalAction(id),
                    new SelectProposalAction(id)
                ])
            )
            .subscribe(this.store);

        this.proposal$ = this.store.pipe(select(getSelectedProposal));
        this.datasets$ = this.store.pipe(select(getSelectedProposalDatasets));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
};
