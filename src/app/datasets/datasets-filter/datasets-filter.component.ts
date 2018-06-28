import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { SatDatepicker } from 'saturn-datepicker';

import { FacetCount } from 'state-management/state/datasets.store';
import {
  getLocationFacetCounts,
  getGroupFacetCounts,
  getTypeFacetCounts,
  getKeywordFacetCounts,
  getLocationFilter,
  getTypeFilter,
  getKeywordsFilter,
  getGroupFilter,
  getCreationTimeFilter,
} from 'state-management/selectors/datasets.selectors';

import {
  AddLocationFilterAction,
  RemoveLocationFilterAction,
  AddGroupFilterAction,
  RemoveGroupFilterAction,
  AddKeywordFilterAction,
  RemoveKeywordFilterAction,
  AddTypeFilterAction,
  RemoveTypeFilterAction,
  ClearFacetsAction,
  SetDateRangeFilterAction
} from 'state-management/actions/datasets.actions';
import { MatDatepickerInputEvent } from '@angular/material';

type DateRange = {
  begin: Date;
  end: Date;
};

@Component({
  selector: 'datasets-filter',
  templateUrl: 'datasets-filter.component.html',
  styleUrls: ['datasets-filter.component.css']
})
export class DatasetsFilterComponent {
  private locationFacetCounts$ = this.store.pipe(select(getLocationFacetCounts));
  private groupFacetCounts$ = this.store.pipe(select(getGroupFacetCounts));
  private typeFacetCounts$ = this.store.pipe(select(getTypeFacetCounts));
  private keywordFacetCounts$ = this.store.pipe(select(getKeywordFacetCounts));

  private locationFilter$ = this.store.pipe(select(getLocationFilter));
  private groupFilter$ = this.store.pipe(select(getGroupFilter));
  private typeFilter$ = this.store.pipe(select(getTypeFilter));
  private keywordsFilter$ = this.store.pipe(select(getKeywordsFilter));
  
  private creationTimeFilter$ = this.store.pipe(select(getCreationTimeFilter));

  constructor(private store: Store<any>) {}

  getFacetId(facetCount: FacetCount, fallback: string = null): string {
    const id = facetCount._id;
    return id ? String(id) : fallback;
  }

  getFacetCount(facetCount: FacetCount): number {
    return facetCount.count;
  }

  locationSelected(location: string | null) {
    this.store.dispatch(new AddLocationFilterAction(location || ''));
  }

  locationRemoved(location: string) {
    this.store.dispatch(new RemoveLocationFilterAction(location));
  }

  groupSelected(group: string) {
    this.store.dispatch(new AddGroupFilterAction(group));
  }

  groupRemoved(group: string) {
    this.store.dispatch(new RemoveGroupFilterAction(group));
  }

  keywordSelected(keyword: string) {
    this.store.dispatch(new AddKeywordFilterAction(keyword));
  }

  keywordRemoved(keyword: string) {
    this.store.dispatch(new RemoveKeywordFilterAction(keyword));
  }

  typeSelected(type: string) {
    this.store.dispatch(new AddTypeFilterAction(type));
  }

  typeRemoved(type: string) {
    this.store.dispatch(new RemoveTypeFilterAction(type));
  }

  dateChanged(event: MatDatepickerInputEvent<DateRange>) {
    const {begin, end} = event.value;
    this.store.dispatch(new SetDateRangeFilterAction(begin.toISOString(), end.toISOString()));
  }

  clearFacets() {
    this.store.dispatch(new ClearFacetsAction());
  }
}
