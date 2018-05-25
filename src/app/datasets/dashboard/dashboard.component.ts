import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { Subscription, Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import { Store, select } from '@ngrx/store';

import * as rison from 'rison';

import { Dataset, DatasetFilters } from 'state-management/models';

import {
  SetSearchTermsAction,
  FetchFacetCountsAction,
  FetchDatasetsAction,
  SetTextFilterAction,
  UpdateFilterAction,
  PrefillFiltersAction,
} from 'state-management/actions/datasets.actions';

import {
  getSelectedDatasets,
  getSearchTerms,
  getFilters,
  getTextFilter
} from 'state-management/selectors/datasets.selectors';

import { filter } from 'rxjs/operators/filter';
import { pluck } from 'rxjs/operators/pluck';
import { map } from 'rxjs/operators/map';
import { take } from 'rxjs/operators/take';
import { tap } from 'rxjs/operators/tap';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { debounceTime } from 'rxjs/operators/debounceTime';

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnDestroy
{
  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  private filters$ = this.store.pipe(select(getFilters));
  private selectedDatasets$ = this.store.pipe(select(getSelectedDatasets));
  private searchTerms$ = this.store.pipe(select(getSearchTerms));

  private writeRouteSubscription = this.filters$.subscribe(filters => {
    this.store.dispatch(new FetchDatasetsAction());
    this.store.dispatch(new FetchFacetCountsAction());
    this.router.navigate(['/datasets'], {queryParams: {args: rison.encode(filters)}});
  });

  private readRouteSubscription = this.route.queryParams.pipe(
    map(params => params.args as string),
    take(1),
    map(args => args ? rison.decode<DatasetFilters>(args) : {}),
    map(filters => new PrefillFiltersAction(filters)),
  ).subscribe(this.store);
  
  // Need to deal with `mode` as well

  private searchTermSubscription = this.searchTerms$.pipe(
    debounceTime(500),
    withLatestFrom(this.store.pipe(select(getTextFilter))),
    filter(([terms, filter]) => terms !== filter),
    map(([terms, filter]) => terms)
  ).subscribe(terms => {
    this.store.dispatch(new SetTextFilterAction(terms));
  });

  ngOnDestroy() {
    this.writeRouteSubscription.unsubscribe();
    this.readRouteSubscription.unsubscribe();
    this.searchTermSubscription.unsubscribe();
  }

  textSearch(terms: string) {
    this.store.dispatch(new SetSearchTermsAction(terms));
  }
}
