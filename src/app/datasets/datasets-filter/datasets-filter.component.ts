import { APP_CONFIG, AppConfig } from "app-config.module";
import { Component, Inject } from "@angular/core";
import { MatDatepickerInputEvent, MatDialog } from "@angular/material";

import { select, Store } from "@ngrx/store";
import {
  debounceTime,
  distinctUntilChanged,
  skipWhile,
  map
} from "rxjs/operators";

import { FacetCount } from "state-management/state/datasets.store";
import {
  getCreationTimeFilter,
  getGroupFacetCounts,
  getGroupFilter,
  getHasAppliedFilters,
  getKeywordFacetCounts,
  getKeywordsFilter,
  getLocationFacetCounts,
  getLocationFilter,
  getScientificConditions,
  getSearchTerms,
  getTypeFacetCounts,
  getTypeFilter,
  getKeywordsTerms
} from "state-management/selectors/datasets.selectors";

import {
  AddGroupFilterAction,
  AddKeywordFilterAction,
  AddLocationFilterAction,
  AddScientificConditionAction,
  AddTypeFilterAction,
  ClearFacetsAction,
  RemoveGroupFilterAction,
  RemoveKeywordFilterAction,
  RemoveLocationFilterAction,
  RemoveScientificConditionAction,
  RemoveTypeFilterAction,
  SetDateRangeFilterAction,
  SetSearchTermsAction,
  SetTextFilterAction
} from "state-management/actions/datasets.actions";
import { ScientificConditionDialogComponent } from "datasets/scientific-condition-dialog/scientific-condition-dialog.component";
import { combineLatest, BehaviorSubject, Observable } from "rxjs";

export type DateRange = {
  begin: Date;
  end: Date;
};

@Component({
  selector: "datasets-filter",
  templateUrl: "datasets-filter.component.html",
  styleUrls: ["datasets-filter.component.css"]
})
export class DatasetsFilterComponent {
  locationFacetCounts$ = this.store.pipe(select(getLocationFacetCounts));
  groupFacetCounts$ = this.store.pipe(select(getGroupFacetCounts));
  typeFacetCounts$ = this.store.pipe(select(getTypeFacetCounts));
  keywordFacetCounts$ = this.store.pipe(select(getKeywordFacetCounts));

  searchTerms$ = this.store.pipe(select(getSearchTerms));
  keywordsTerms$ = this.store.pipe(select(getKeywordsTerms));
  locationFilter$ = this.store.pipe(select(getLocationFilter));
  groupFilter$ = this.store.pipe(select(getGroupFilter));
  typeFilter$ = this.store.pipe(select(getTypeFilter));
  keywordsFilter$ = this.store.pipe(select(getKeywordsFilter));
  creationTimeFilter$ = this.store.pipe(select(getCreationTimeFilter));
  scientificConditions$ = this.store.pipe(select(getScientificConditions));

  locationInput$ = new BehaviorSubject<string>("");
  groupInput$ = new BehaviorSubject<string>("");
  typeInput$ = new BehaviorSubject<string>("");
  keywordsInput$ = new BehaviorSubject<string>("");

  createSuggestionObserver(
    facetCounts$: Observable<FacetCount[]>,
    input$: BehaviorSubject<string>,
    currentFilters$: Observable<string[]>
  ): Observable<FacetCount[]> {
    return combineLatest(facetCounts$, input$, currentFilters$).pipe(
      map(([counts, filterString, currentFilters]) => {
        if (!counts) {
          return [];
        }
        return counts.filter(
          count =>
            typeof count._id === "string" &&
            count._id.toLowerCase().includes(filterString.toLowerCase()) &&
            currentFilters.indexOf(count._id) < 0
        );
      })
    );
  }
  groupSuggestions$ = this.createSuggestionObserver(
    this.groupFacetCounts$,
    this.groupInput$,
    this.groupFilter$
  );

  locationSuggestions$ = this.createSuggestionObserver(
    this.locationFacetCounts$,
    this.locationInput$,
    this.locationFilter$
  );

  typeSuggestions$ = this.createSuggestionObserver(
    this.typeFacetCounts$,
    this.typeInput$,
    this.typeFilter$
  );

  keywordsSuggestions$ = this.createSuggestionObserver(
    this.keywordFacetCounts$,
    this.keywordsInput$,
    this.keywordsFilter$
  );

  hasAppliedFilters$ = this.store.pipe(select(getHasAppliedFilters));

  private searchTermSubscription = this.searchTerms$
    .pipe(
      skipWhile(terms => terms === ""),
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(terms => {
      this.store.dispatch(new SetTextFilterAction(terms));
    });

  private keywordSubscription = this.keywordsTerms$
    .pipe(
      skipWhile(terms => terms === ""),
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(terms => {
      this.store.dispatch(new AddKeywordFilterAction(terms));
    });

  constructor(
    public dialog: MatDialog,
    private store: Store<any>,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {}

  getFacetId(facetCount: FacetCount, fallback: string = null): string {
    const id = facetCount._id;
    return id ? String(id) : fallback;
  }

  getFacetCount(facetCount: FacetCount): number {
    return facetCount.count;
  }

  textSearchChanged(terms: string) {
    this.store.dispatch(new SetSearchTermsAction(terms));
  }

  locationSelected(location: string | null) {
    this.store.dispatch(new AddLocationFilterAction(location || ""));
    this.locationInput$.next("");
  }

  locationRemoved(location: string) {
    this.store.dispatch(new RemoveLocationFilterAction(location));
  }

  groupSelected(group: string) {
    this.store.dispatch(new AddGroupFilterAction(group));
    this.groupInput$.next("");
  }

  groupRemoved(group: string) {
    this.store.dispatch(new RemoveGroupFilterAction(group));
  }

  keywordSelected(keyword: string) {
    this.store.dispatch(new AddKeywordFilterAction(keyword));
    this.keywordsInput$.next("");
  }

  keywordRemoved(keyword: string) {
    this.store.dispatch(new RemoveKeywordFilterAction(keyword));
  }

  typeSelected(type: string) {
    this.store.dispatch(new AddTypeFilterAction(type));
    this.typeInput$.next("");
  }

  typeRemoved(type: string) {
    this.store.dispatch(new RemoveTypeFilterAction(type));
  }

  dateChanged(event: MatDatepickerInputEvent<DateRange>) {
    const { begin, end } = event.value;
    this.store.dispatch(
      new SetDateRangeFilterAction(begin.toISOString(), end.toISOString())
    );
  }

  clearFacets() {
    this.store.dispatch(new ClearFacetsAction());
  }

  showAddConditionDialog() {
    this.dialog
      .open(ScientificConditionDialogComponent)
      .afterClosed()
      .subscribe(({ data }) => {
        if (data != null) {
          this.store.dispatch(new AddScientificConditionAction(data));
        }
      });
  }

  removeCondition(index: number) {
    this.store.dispatch(new RemoveScientificConditionAction(index));
  }
}
