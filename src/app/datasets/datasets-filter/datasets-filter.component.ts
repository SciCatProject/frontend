import 'rxjs/add/operator/take';
import 'rxjs/add/observable/combineLatest';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { createSelector, OutputSelector } from 'reselect';
import {
  DatepickerState,
  SelectionModes
} from 'shared/modules/datepicker/datepicker.store';
import TimeRange from 'shared/modules/datepicker/LocalizedDateTime/TimeRange';
import * as utils from 'shared/utils';
import * as dsa from 'state-management/actions/datasets.actions';
import * as dStore from 'state-management/state/datasets.store';
import * as selectors from 'state-management/selectors';
import { DatasetFilters } from 'state-management/models';
import { Observable } from 'rxjs/Observable';
import * as rison from 'rison';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MultiDayRange } from 'shared/modules/datepicker/LocalizedDateTime/timeRanges';
import { Dataset } from 'shared/sdk';


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

  datepickerSelector:
    OutputSelector<any, DatepickerState, (res: any) => DatepickerState>;
  dateSelectionMode = SelectionModes.range;

  dateSelections$: BehaviorSubject<TimeRange[]>;

  // @Input() datasets: Array<any> = [];
  facets: Array<any> = [];
  resultCount$;

  dateFacet = [];

  location: {};
  selectedLocs = [];
  locations = [];
  selectedLocation;
  selectedGroup;
  selectedKeywords;

  group: {};
  groups = [];
  selectedGroups = [];
  // filteredGroups = [];

  keywords = [];

  type = undefined;

  filterTemplate: DatasetFilters;
  filters: any = dStore.initialDatasetState.activeFilters;
  filterValues;

  subscriptions = [];

  constructor(private store: Store<any>, private route: ActivatedRoute,
    private router: Router) {
    this.locationInput = new FormControl();
    this.groupInput = new FormControl();
    this.typeInput = new FormControl();
    this.keywordInput = new FormControl();

  }

  filterLocations(loc: string) {
    return this.locations.filter(b => b._id && b._id.toLowerCase().indexOf(loc.toLowerCase()) === 0);
  }

  filterGroups(group: string) {
    return this.groups.filter(g => g._id && g._id.toLowerCase().indexOf(group.toLowerCase()) === 0);
  }

  filterKeywords(kw: string) {
    return this.keywords.filter(k => k._id && k._id.toString().toLowerCase().indexOf(kw.toString().toLowerCase()) === 0);
  }

  /**
   * Load locations and ownergroups on start up and
   * only use unique values
   */
  ngOnInit() {
    this.dateSelections$ = new BehaviorSubject<TimeRange[]>([]);
    const datasetsStoreSlicePath = ['root', 'datasets'];
    const datasetsSelector = createSelector((state: any): any => {
      return datasetsStoreSlicePath.reduce(
        (obj: any, sliceKey: any) => obj[sliceKey], state);
    }, (selectedDatasets: any): any => selectedDatasets);

    this.datepickerSelector =
      createSelector(datasetsSelector,
        (selectedDatasets: any): DatepickerState =>
          selectedDatasets['datepicker']);

    this.resultCount$ =
      this.store.select(selectors.datasets.getTotalSets);

    this.store.select(selectors.datasets.getActiveFilters).subscribe(filters => {
      if ('creationLocation' in filters && filters.creationLocation !== undefined) {
        this.selectedLocation = filters['creationLocation'].toString();
        this.locationInput.setValue(this.selectedLocation);
      }
      if ('ownerGroup' in filters && filters.ownerGroup !== undefined) {
        this.selectedGroup = filters['ownerGroup'].toString();
        this.groupInput.setValue(this.selectedGroup);
      }
      if ('keywords' in filters && filters.keywords !== undefined) {
        this.selectedKeywords = filters['keywords'].toString();
        this.keywordInput.setValue(this.selectedKeywords);
      }
    });

    this.subscriptions.push(
      this.store.select(selectors.datasets.getFilterValues)
        .subscribe(values => {
          this.filterValues = { ...values };
          if (this.filterValues) {
            if (this.locations.length === 0 && this.filterValues['creationLocation'] !== null) {
              this.locations = this.filterValues['creationLocation'] ? this.filterValues['creationLocation'].slice() : [];
            }
            if (this.groups.length === 0 &&
              this.filterValues['ownerGroup'] !== null && Array.isArray(this.filterValues['ownerGroup'])) {
              this.groups = this.filterValues['ownerGroup'] ? this.filterValues['ownerGroup'].slice() : [];
            }
            console.log(this.filterValues);
            if (this.keywords.length === 0 &&
              this.filterValues['keywords'] !== null && Array.isArray(this.filterValues['keywords'])) {
              this.filterValues['keywords'].map((k) => {
                if (k._id) {
                  k._id = k._id.toString();
                }
              });
              this.keywords = this.filterValues['keywords'] ? this.filterValues['keywords'].slice() : [];
            }

            if (this.filterValues.creationLocation) {
              this.filteredLocations = this.locationInput.valueChanges
                .pipe(startWith(''), map(loc => loc ? this.filterLocations(loc) : this.filterValues.creationLocation.slice()));
            }
            if (this.filterValues.ownerGroup) {
              this.filteredGroups = this.groupInput.valueChanges
                .pipe(startWith(''), map(group => group ? this.filterGroups(group) : this.filterValues.ownerGroup.slice()));
            }
            if (this.filterValues.keywords) {
              this.filteredKeywords = this.keywordInput.valueChanges
                .pipe(startWith(''), map(kw => kw ? this.filterKeywords(kw) : this.filterValues.keywords.slice()));
            }
          }
        }));
  }

  /**
   *
   * @param timeranges
   */
  updateDateRange(timeranges: TimeRange[]) {
    let startDate: Date = null;
    let endDate: Date = null;
    const selectedRange: TimeRange = timeranges[0];
    if (selectedRange) {
      startDate = selectedRange.datePair[0];
      endDate = selectedRange.datePair[1];
    }
    if (startDate !== null && endDate !== null) {
      this.filters.creationTime = {
        start: startDate,
        end: endDate
      };
      // this.store.dispatch(new dsa.UpdateFilterAction(this.filters));
      this.dateSelections$.next(timeranges);
    }
  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  /**
   * Handle clicking of available locations
   */
  locSelected(loc) {
    this.filters.creationLocation.push(loc['_id']);
    this.store.dispatch(new dsa.UpdateFilterAction(this.filters));
  }

  /**
   * Handle clicking of available groups
   */
  groupSelected(grp) {
    this.filters.ownerGroup.push(grp['_id']);
    this.store.dispatch(new dsa.UpdateFilterAction(this.filters));
  }

  keywordSelected(kw) {
    if (kw) {
      console.log(kw);
      this.filters.keywords.push(kw['_id'].split(','));
      this.store.dispatch(new dsa.UpdateFilterAction(this.filters));
    }
  }

  typeSelected(type) {
    this.filters.type = type;
    this.store.dispatch(new dsa.UpdateFilterAction(this.filters));
  }

  /**
   * Clear the filters and reset the user groups (when not a functional account)
   */
  clearFacets() {
    this.selectedGroups = [];
    this.locationInput.setValue('');
    this.groupInput.setValue('');
    this.keywordInput.setValue('');
    this.selectedGroup = '';
    this.filters = dStore.initialDatasetState.activeFilters;
    this.dateSelections$.next([]);
    this.store.select(state => state.root.user.currentUserGroups)
      .takeLast(1)
      .subscribe(groups => { this.filters.ownerGroup = groups; });
    this.filters.ownerGroup = [];
    this.filters.creationLocation = [];
    this.filters.keywords = [];
    this.filterValues = dStore.initialDatasetState.filterValues;
    this.filterValues.text = '';
    this.store.dispatch(new dsa.UpdateFilterAction(this.filters));
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
