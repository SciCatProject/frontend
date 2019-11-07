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
  setTextFilterAction,
  addKeywordFilterAction,
  setSearchTermsAction,
  addLocationFilterAction,
  removeLocationFilterAction,
  addGroupFilterAction,
  removeGroupFilterAction,
  removeKeywordFilterAction,
  addTypeFilterAction,
  removeTypeFilterAction,
  setDateRangeFilterAction,
  clearFacetsAction,
  addScientificConditionAction,
  removeScientificConditionAction
} from "state-management/actions/datasets.actions";
import { ScientificConditionDialogComponent } from "datasets/scientific-condition-dialog/scientific-condition-dialog.component";
import { combineLatest, BehaviorSubject, Observable } from "rxjs";

export interface DateRange {
  begin: Date;
  end: Date;
}

@Component({
  selector: "datasets-filter",
  templateUrl: "datasets-filter.component.html",
  styleUrls: ["datasets-filter.component.scss"]
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

  clearSearchBar = false;
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
      this.store.dispatch(setTextFilterAction({ text: terms }));
    });

  private keywordSubscription = this.keywordsTerms$
    .pipe(
      skipWhile(terms => terms === ""),
      debounceTime(500),
      distinctUntilChanged()
    )
    .subscribe(terms => {
      this.store.dispatch(addKeywordFilterAction({ keyword: terms }));
    });

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
    this.clearSearchBar = false;
    this.store.dispatch(setSearchTermsAction({ terms }));
  }

  locationSelected(location: string | null) {
    const loc = location || "";
    this.store.dispatch(addLocationFilterAction({ location: loc }));
    this.locationInput$.next("");
  }

  locationRemoved(location: string) {
    this.store.dispatch(removeLocationFilterAction({ location }));
  }

  groupSelected(group: string) {
    this.store.dispatch(addGroupFilterAction({ group }));
    this.groupInput$.next("");
  }

  groupRemoved(group: string) {
    this.store.dispatch(removeGroupFilterAction({ group }));
  }

  keywordSelected(keyword: string) {
    this.store.dispatch(addKeywordFilterAction({ keyword }));
    this.keywordsInput$.next("");
  }

  keywordRemoved(keyword: string) {
    this.store.dispatch(removeKeywordFilterAction({ keyword }));
  }

  typeSelected(type: string) {
    this.store.dispatch(addTypeFilterAction({ datasetType: type }));
    this.typeInput$.next("");
  }

  typeRemoved(type: string) {
    this.store.dispatch(removeTypeFilterAction({ datasetType: type }));
  }

  dateChanged(event: MatDatepickerInputEvent<DateRange>) {
    if (event.value) {
      const { begin, end } = event.value;
      this.store.dispatch(
        setDateRangeFilterAction({
          begin: begin.toISOString(),
          end: end.toISOString()
        })
      );
    } else {
      this.store.dispatch(setDateRangeFilterAction({ begin: null, end: null }));
    }
  }

  clearFacets() {
    this.clearSearchBar = true;
    this.store.dispatch(clearFacetsAction());
  }

  showAddConditionDialog() {
    this.dialog
      .open(ScientificConditionDialogComponent)
      .afterClosed()
      .subscribe(({ data }) => {
        if (data != null) {
          this.store.dispatch(
            addScientificConditionAction({ condition: data })
          );
        }
      });
  }

  removeCondition(index: number) {
    this.store.dispatch(removeScientificConditionAction({ index }));
  }
}
