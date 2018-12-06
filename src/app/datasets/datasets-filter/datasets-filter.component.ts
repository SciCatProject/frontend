import { Component } from "@angular/core";
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
  getKeywordsTerms,
  getTypeFacetCounts,
  getTypeFilter
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
import { combineLatest, BehaviorSubject } from "rxjs";

type DateRange = {
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

  locationInpuKeyUp$ = new BehaviorSubject<string>("");
  groupInpuKeyUp$ = new BehaviorSubject<string>("");
  typeInpuKeyUp$ = new BehaviorSubject<string>("");
  keywordsInpuKeyUp$ = new BehaviorSubject<string>("");

  groupSuggestions$ = combineLatest(
    this.groupFacetCounts$,
    this.groupInpuKeyUp$,
    this.groupFilter$ 
  ).pipe(
    map(([counts, filterString, groupFilters]) => {
      if (!counts) return [];
      return counts.filter(
        count =>
          typeof count._id === "string" && count._id.toLowerCase().includes(filterString.toLowerCase()) && groupFilters.indexOf(count._id) < 0
      );
    })
  );

  locationSuggestions$ = combineLatest(
    this.locationFacetCounts$,
    this.locationInpuKeyUp$,
    this.locationFilter$
  ).pipe(
    map(([counts, filterString, locationFilters]) => {
      if (!counts) return [];
      return counts.filter(
        count =>
          typeof count._id === "string" && count._id.toLowerCase().includes(filterString.toLowerCase()) && locationFilters.indexOf(count._id) < 0
      );
    })
  );

  typeSuggestions$ = combineLatest(
    this.typeFacetCounts$,
    this.typeInpuKeyUp$,
    this.typeFilter$
  ).pipe(
    map(([counts, filterString, typeFilters]) => {
      if (!counts) return [];
      return counts.filter(
        count =>
          typeof count._id === "string" && count._id.toLowerCase().includes(filterString.toLowerCase()) && typeFilters.indexOf(count._id) < 0
      );
    })
  );
  
  keywordsSuggestions$ = combineLatest(
    this.keywordFacetCounts$,
    this.keywordsInpuKeyUp$,
    this.keywordsFilter$
  ).pipe(
    map(([counts, filterString, keywordFilters]) => {
      if (!counts) return [];
      return counts.filter(
        count =>
          typeof count._id === "string" && count._id.toLowerCase().includes(filterString.toLowerCase()) && keywordFilters.indexOf(count._id) < 0
      );
    })
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

  constructor(public dialog: MatDialog, private store: Store<any>) {}

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
    this.locationInpuKeyUp$.next("");
  }

  locationRemoved(location: string) {
    this.store.dispatch(new RemoveLocationFilterAction(location));
  }

  groupSelected(group: string) {
    this.store.dispatch(new AddGroupFilterAction(group));
    this.groupInpuKeyUp$.next("");
  }

  groupRemoved(group: string) {
    this.store.dispatch(new RemoveGroupFilterAction(group));
  }

  keywordSelected(keyword: string) {
    this.store.dispatch(new AddKeywordFilterAction(keyword));
    this.keywordsInpuKeyUp$.next("");
  }

  keywordRemoved(keyword: string) {
    this.store.dispatch(new RemoveKeywordFilterAction(keyword));
  }

  typeSelected(type: string) {
    this.store.dispatch(new AddTypeFilterAction(type));
    this.typeInpuKeyUp$.next("");
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
