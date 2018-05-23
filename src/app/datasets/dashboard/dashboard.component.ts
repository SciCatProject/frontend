import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription, Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators/debounceTime';

import { Store, select } from '@ngrx/store';

import * as rison from 'rison';

import { Dataset, DatasetFilters } from 'state-management/models';

import {
  SetSearchTermsAction,
  FetchFacetCountsAction,
  FetchDatasetsAction,
  SetTextFilterAction,
} from 'state-management/actions/datasets.actions';

import {
  getSelectedDatasets,
  getSearchTerms,
  getFilters
} from 'state-management/selectors/datasets.selectors';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnDestroy
{
  constructor(private store: Store<any>, private router: Router) {}

  private filters$ = this.store.pipe(select(getFilters));
  private selectedDatasets$ = this.store.pipe(select(getSelectedDatasets));
  private searchTerms$ = this.store.pipe(select(getSearchTerms));

  private filterSubscription = this.filters$.subscribe(filters => {
    this.store.dispatch(new FetchDatasetsAction());
    this.store.dispatch(new FetchFacetCountsAction());
    this.router.navigate(['/datasets'], {queryParams: {args: rison.encode(filters)}});
  });

  private searchTermSubscription = this.searchTerms$.pipe(debounceTime(500)).subscribe(terms => {
    this.store.dispatch(new SetTextFilterAction(terms));
  });

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    this.searchTermSubscription.unsubscribe();
  }

  textSearch(terms: string) {
    this.store.dispatch(new SetSearchTermsAction(terms));
  }
}
