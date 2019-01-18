import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { select, Store } from "@ngrx/store";

import * as rison from "rison";
import * as deepEqual from "deep-equal";

import { DatasetFilters } from "state-management/models";

import {
  FetchDatasetsAction,
  FetchFacetCountsAction,
  PrefillBatchAction,
  PrefillFiltersAction,
  SetSearchTermsAction,
  SetTextFilterAction
} from "state-management/actions/datasets.actions";

import {
  getFilters,
  getHasPrefilledFilters,
  getSearchTerms,
  getSelectedDatasets
} from "state-management/selectors/datasets.selectors";
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  skipWhile,
  take
} from "rxjs/operators";

@Component({
  selector: "dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.css"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedDatasets$ = this.store.pipe(select(getSelectedDatasets));
  private filters$ = this.store.pipe(select(getFilters));
  private searchTerms$ = this.store.pipe(select(getSearchTerms));
  private readyToFetch$ = this.store.pipe(
    select(getHasPrefilledFilters),
    filter(has => has)
  );
  private writeRouteSubscription = this.filters$
    .pipe(
      combineLatest(this.readyToFetch$),
      map(([filters, _]) => filters),
      distinctUntilChanged(deepEqual)
    )
    .subscribe(filters => {
      this.store.dispatch(new FetchDatasetsAction());
      this.store.dispatch(new FetchFacetCountsAction());
      this.router.navigate(["/datasets"], {
        queryParams: { args: rison.encode(filters) }
      });
    });
  private readRouteSubscription = this.route.queryParams
    .pipe(
      map(params => params.args as string),
      take(1),
      map(args => (args ? rison.decode<DatasetFilters>(args) : {}))
    )
    .subscribe(filters =>
      this.store.dispatch(new PrefillFiltersAction(filters))
    );
  private searchTermSubscription = this.searchTerms$
    .pipe(
      skipWhile(terms => terms === ""),
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(terms => {
      this.store.dispatch(new SetTextFilterAction(terms));
    });

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy() {
    this.writeRouteSubscription.unsubscribe();
    this.readRouteSubscription.unsubscribe();
    this.searchTermSubscription.unsubscribe();
  }

  ngOnInit() {
    this.store.dispatch(new PrefillBatchAction());
  }

  textSearch(terms: string) {
    this.store.dispatch(new SetSearchTermsAction(terms));
  }
}
