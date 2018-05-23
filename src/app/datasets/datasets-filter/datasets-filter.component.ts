import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeLast';
import 'rxjs/add/observable/combineLatest';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { createSelector, OutputSelector } from 'reselect';

import * as utils from 'shared/utils';
import * as dsa from 'state-management/actions/datasets.actions';
import * as dStore from 'state-management/state/datasets.store';
import * as selectors from 'state-management/selectors';
import { DatasetFilters } from 'state-management/models';
import { Observable } from 'rxjs/Observable';
import * as rison from 'rison';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Dataset } from 'shared/sdk';
import { MatDatepicker } from 'saturn-datepicker';

import { FacetCount } from 'state-management/state/datasets.store';
import { getLocationFacetCounts, getGroupFacetCounts, getTypeFacetCounts, getKeywordFacetCounts, getLocationFilter, getTypeFilter, getKeywordsFilter, getGroupFilter, getFilters } from 'state-management/selectors/datasets.selectors';

export interface MatDatePickerRangeValue<D> {
  start: D | null;
  end: D | null;
}

 // TODO: get rid of client side filtering

@Component({
  selector: 'datasets-filter',
  templateUrl: './datasets-filter.component.html',
  styleUrls: ['./datasets-filter.component.css']
})
export class DatasetsFilterComponent implements OnInit, OnDestroy {

  locationInput: FormControl;
  groupInput: FormControl;
  typeInput: FormControl;
  keywordInput: FormControl;

  filteredLocations: Observable<any[]>;
  filteredGroups: Observable<any[]>;
  filteredKeywords: Observable<any[]>;
  filteredTypes: Observable<any[]>;

  dateRange: MatDatePickerRangeValue<Date> = {start: null, end: null};


  // @Input() datasets: Array<any> = [];
  facets: Array<any> = [];

  locations = [];
  groups = [];
  keywords = [];
  types = [];

  filterTemplate: DatasetFilters;
  filters: any = dStore.initialDatasetState.filters;
  filterValues;

  subscriptions = [];

  filters$;

  private locationFacetCounts$: Observable<FacetCount[]>;
  private groupFacetCounts$: Observable<FacetCount[]>;
  private typeFacetCounts$: Observable<FacetCount[]>;
  private keywordFacetCounts$: Observable<FacetCount[]>;

  private locationFilter$: Observable<string[]>;
  private groupFilter$: Observable<string[]>;
  private typeFilter$: Observable<string>;
  private keywordsFilter$: Observable<string[]>;

  constructor(
    private store: Store<any>, 
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.locationInput = new FormControl();
    this.groupInput = new FormControl();
    this.typeInput = new FormControl();
    this.keywordInput = new FormControl();
  }

  /*
  filterLocations(loc: string) {
    return this.locations.filter(b => b._id && b._id.toLowerCase().indexOf(loc.toLowerCase()) === 0);
  }

  filterGroups(group: string) {
    return this.groups.filter(g => g._id && g._id.toLowerCase().indexOf(group.toLowerCase()) === 0);
  }

  filterKeywords(kw: string) {
    return this.keywords.filter(k => k._id && k._id.toString().toLowerCase().indexOf(kw.toString().toLowerCase()) === 0);
  }

  filterTypes(t: string) {
    console.log(t);
    return this.types.filter(k => k._id && k._id.toString().toLowerCase().indexOf(t.toString().toLowerCase()) === 0);
  }
  */

  /**
   * Load locations and ownergroups on start up and
   * only use unique values
   */
  ngOnInit() {
    this.filters$ = this.store.pipe(select(getFilters));

    this.locationFilter$ = this.store.pipe(select(getLocationFilter));
    this.typeFilter$ = this.store.pipe(select(getTypeFilter));
    this.keywordsFilter$ = this.store.pipe(select(getKeywordsFilter));
    this.groupFilter$ = this.store.pipe(select(getGroupFilter));

    this.locationFacetCounts$ = this.store.pipe(select(getLocationFacetCounts));
    this.groupFacetCounts$ = this.store.pipe(select(getGroupFacetCounts));
    this.typeFacetCounts$ = this.store.pipe(select(getTypeFacetCounts));
    this.keywordFacetCounts$ = this.store.pipe(select(getKeywordFacetCounts));

    /*
    this.store.select(selectors.datasets.getFilters).subscribe(filters => {
      if ('creationLocation' in filters && filters.creationLocation) {
        const l = filters['creationLocation'].toString();
        this.locationInput.setValue(l);
      }
      if ('ownerGroup' in filters && filters.ownerGroup) {
        const g = filters['ownerGroup'].toString();
        this.groupInput.setValue(g);
      }
      if ('keywords' in filters && filters.keywords) {
        const k = filters['keywords'].toString();
        this.keywordInput.setValue(k);
      }
      if ('type' in filters && filters.type) {
        const t = filters['type'].toString();
        this.typeInput.setValue(t);
      }
      if ('creationTime' in filters && filters.creationTime !== undefined) {
        this.dateRange = filters.creationTime;
      }
    });
    */

    /*
    this.subscriptions.push(
      this.store.select(selectors.datasets.getFilters)
        .subscribe(values => {
          this.filterValues = { ...values };
          if (this.filterValues) {
              this.locations = this.filterValues['creationLocation'] ? this.filterValues['creationLocation'].slice() : [];
              this.groups = this.filterValues['ownerGroup'] ? this.filterValues['ownerGroup'].slice() : [];
              this.keywords = this.filterValues['keywords'] ? this.filterValues['keywords'].slice() : [];
              this.types = this.filterValues['type'] ? this.filterValues['type'].slice() : [];
            }

            if (this.filterValues.creationLocation) {
              this.filteredLocations = this.locationInput.valueChanges
                .pipe(startWith(''), map(loc => loc ? this.filterLocations(loc) : this.locations.slice()));
            }
            if (this.filterValues.ownerGroup) {
              this.filteredGroups = this.groupInput.valueChanges
                .pipe(startWith(''), map(group => group ? this.filterGroups(group) : this.groups.slice()));
            }
            if (this.filterValues.keywords) {
              this.filteredKeywords = this.keywordInput.valueChanges
                .pipe(startWith(''), map(kw => kw ? this.filterKeywords(kw) : this.keywords.slice()));
            }
            if (this.filterValues.type) {
              this.filteredTypes = this.typeInput.valueChanges
                .pipe(startWith(''), map(t => t ? this.filterTypes(t) : this.types.slice()));
            }
        }));
    */
  }


  ngOnDestroy() {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  locationSelected(location: string | null) {
    this.store.dispatch(new dsa.AddLocationFilterAction(location || ''));
  }

  locationRemoved(location: string) {
    this.store.dispatch(new dsa.RemoveLocationFilterAction(location));
  }

  groupSelected(group: string) {
    this.store.dispatch(new dsa.AddGroupFilterAction(group));
  }

  groupRemoved(group: string) {
    this.store.dispatch(new dsa.RemoveGroupFilterAction(group));
  }

  keywordSelected(keyword: string) {
    this.store.dispatch(new dsa.AddKeywordFilterAction(keyword));
  }

  typeSelected(type: string) {
    this.store.dispatch(new dsa.SetTypeFilterAction(type));
  }

  dateChanged(event) {
    // TODO
    // this.store.dispatch(new dsa.UpdateFilterAction(this.filters));
  }

  /**
   * Clear the filters and reset the user groups (when not a functional account)
   */
  clearFacets() {
    this.store.dispatch(new dsa.ClearFacetsAction());
  }

  /**
   * Handle the dropdown click to show
   * a list of locations
   * @param {any} event
   * @memberof DatasetsFilterComponent
   */
  handleDropClick(event) {
    // TODO handle selected item
    console.log(event);
  }
}
