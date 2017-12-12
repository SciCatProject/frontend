import 'rxjs/add/operator/take';
import 'rxjs/add/observable/combineLatest';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AutoComplete, Tree } from 'primeng/primeng';
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
import { DatasetFilters } from 'datasets/datasets-filter/dataset-filters';
import { Observable } from 'rxjs/Observable';
import * as rison from 'rison';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MultiDayRange } from 'shared/modules/datepicker/LocalizedDateTime/timeRanges';


@Component({
  selector: 'datasets-filter',
  templateUrl: './datasets-filter.component.html',
  styleUrls: ['./datasets-filter.component.css']
})
export class DatasetsFilterComponent implements OnInit, OnDestroy {
  @ViewChild('datetree') dateTree: Tree;
  @ViewChild('loc') locField: AutoComplete;
  @ViewChild('grp') grpField: AutoComplete;

  beamlineInput: FormControl;
  groupInput: FormControl;
  filteredBeams: Observable<any[]>;
  filteredGroups: Observable<any[]>;

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
  filteredLocations = [];

  group: {};
  groups = [];
  selectedGroups = [];
  // filteredGroups = [];

  filters = dStore.initialDatasetState.activeFilters;
  filterValues;

  subscriptions = [];

  constructor(private store: Store<any>, private route: ActivatedRoute,
    private router: Router) {
      this.beamlineInput = new FormControl();
      this.groupInput = new FormControl();
      this.filteredBeams = this.beamlineInput.valueChanges
        .pipe(startWith(''), map(beam => beam ? this.filterBeams(beam) : this.filterValues.creationLocation.slice()));
      this.filteredGroups = this.groupInput.valueChanges
        .pipe(startWith(''), map(group => group ? this.filterGroups(group) : this.filterValues.ownerGroup.slice()));

    }

  filterBeams(beam: string) {
    return this.filterValues.creationLocation.filter(b => b._id.toLowerCase().indexOf(beam.toLowerCase()) === 0);
  }

  filterGroups(group: string) {
    return this.filterValues.ownerGroup.filter(g => g._id.toLowerCase().indexOf(group.toLowerCase()) === 0);
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

    this.subscriptions.push(this.route.queryParams.subscribe(params => {
      let decoded = {};
      if ('args' in params) {
        decoded = rison.decode(params['args']);
      }
      const newParams = Object.assign({}, decoded);
      delete newParams['mode'];
      const activeFilters$ = this.store.select(selectors.datasets.getActiveFilters);
      const mode$ = this.store.select(selectors.ui.getMode);
      Observable.combineLatest(activeFilters$, mode$).takeLast(1).subscribe(combined => {
        const filters = combined[0];
        const mode = combined[1];
        const f = utils.filter(filters, newParams);
        //this.location = f['creationLocation']
        //  ? { _id: filters['creationLocation'] }
        //  : '';
        const group = f['ownerGroup'];
        if (group && group && Array.isArray(group) &&
          group.length > 0) {
          this.selectedGroups = group.map(x => { return { _id: x }; });
        } else if (group && !Array.isArray(group)) {
          this.selectedGroups = [{ '_id': group }];
        } else {
          this.selectedGroups = [];
        }
        if (utils.compareObj(f, newParams)) {
          const encoded = rison.encode(newParams);
          this.router.navigate(
            ['/datasets'],
            { queryParams: {args: encoded}, replaceUrl: true });
        } else if (params['mode'] !== mode) {
          this.store.dispatch(new dsa.UpdateFilterAction(f));
        }
      });
    }));
    this.subscriptions.push(
      this.store.select(selectors.datasets.getActiveFilters)
        .subscribe(data => {
          // this.filters = Object.assign({}, data,
          // this.route.snapshot.queryParams);
          this.filters = Object.assign({}, data);
          console.log(data);
          this.store.select(state => state.root.dashboardUI.mode)
            .take(1)
            .subscribe(mode => {
              const p = Object.assign(this.filters, { 'mode': mode });
              const encoded = rison.encode(p);
              this.router.navigate(['/datasets'], { queryParams: {args: encoded} });
            });
        }));
    this.resultCount$ =
      this.store.select(selectors.datasets.getTotalSets);
    this.subscriptions.push(
      this.store.select(selectors.datasets.getFilterValues)
        .subscribe(values => {
          this.filterValues = Object.assign({}, values);
          if (this.filterValues) {
            if (this.filterValues['creationLocation'] !== null) {
              this.locations = this.filterValues['creationLocation']
                ? this.filterValues['creationLocation']
                : [];
            }

            if (this.groups.length === 0 &&
              this.filterValues['ownerGroup'] !== null) {
              this.groups = this.filterValues['ownerGroup'];
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
    this.filters.creationTime = {
      start: startDate,
      end: endDate
    };
    this.store.dispatch(new dsa.UpdateFilterAction(this.filters));
    this.dateSelections$.next(timeranges);
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
   * Handle clicking of available groups (contains ANOTHER primeng hack to wait
   * for array to be cleared
   * since this is called before that happens)
   */
  groupSelected(grp) {
    this.filters.ownerGroup.push(grp['_id']);
    this.store.dispatch(new dsa.UpdateFilterAction(this.filters));
  }

  /**
   * Clear the filters and reset the user groups (when not a functional account)
   */
  clearFacets() {
    this.location = undefined;
    this.group = undefined;

    // TODO clearing this does not visually clear (although it is removed from
    // the array)
    this.selectedGroups = [];
    this.locField.value = '';
    this.grpField.value = [];
    this.filters = dStore.initialDatasetState.activeFilters;
    this.dateSelections$.next([]);
    this.store.select(state => state.root.user.currentUserGroups)
        .takeLast(1)
        .subscribe(groups => { this.filters.ownerGroup = groups; });
    this.filterValues = dStore.initialDatasetState.filterValues;
    this.filterValues.text = '';
    this.store.dispatch(new dsa.UpdateFilterAction(this.filters));
    // this.store.dispatch({type : dsa.FILTER_VALUE_UPDATE, payload : this.filterValues});
    // this.store.dispatch({
    //   type: dua.SAVE,
    //   payload: dUIStore.initialDashboardUIState
    // });
    /* let m;
    this.store.select(state => state.root.dashboardUI.mode)
        .takeLast(1)
        .subscribe(mode => (m = mode));
    const currentParams = this.route.snapshot.queryParams;
    this.router.navigate([ '/datasets' ], {
      queryParams :
          Object.assign({}, currentParams, this.filters, {mode : m})
    }); */
    // TODO clear selected sets
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
