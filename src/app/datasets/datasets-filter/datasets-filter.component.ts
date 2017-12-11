import 'rxjs/add/operator/take';
import 'rxjs/add/observable/combineLatest';


import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  datepickerSelector:
    OutputSelector<any, DatepickerState, (res: any) => DatepickerState>;
  dateSelectionMode = SelectionModes.range;

  dateSelections$: BehaviorSubject<TimeRange[]>;

  // @Input() datasets: Array<any> = [];
  facets: Array<any> = [];
  resultCount$;

  dateFacet = [];

  location: {};
  locations = [];
  filteredLocations = [];

  group: {};
  groups = [];
  selectedGroups = [];
  filteredGroups = [];

  filters = dStore.initialDatasetState.activeFilters;
  filterValues;

  subscriptions = [];

  constructor(private store: Store<any>, private route: ActivatedRoute,
    private router: Router) { }

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
        this.location = f['creationLocation']
          ? { _id: filters['creationLocation'] }
          : '';
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
   * Handles search queries for the creation
   * location dropdown, this links to a mongo filter query
   * @param {any} event
   * @memberof DatasetsFilterComponent
   */
  handleInputLocation(event) {
    this.filteredLocations = this.filterDatasets(event.query || '', 'creationLocation');
  }

  /**
   * Could be combined with above and handled based on event but
   * complicated to access source element through event
   * @param {any} event
   * @memberof DatasetsFilterComponent
   */
  handleInputOwner(event) {
    this.filteredGroups = this.filterDatasets(event.query, 'ownerGroup');
  }

  /**
   * Handles the event of the ngModel changing
   * Linked to both autocomplete values. Currently re runs the search when they
   * are cleared
   * @param {any} event
   * @memberof DatasetsFilterComponent
   */
  textValueChanged(event, key) {
    if (event && event.length === 0) {
      this.filters[key] = null;
    } else if (event && event.length >= 4) {
      if (key === 'groups') {
        this.filters[key] = [event];
      } else if (event) {
        this.filters[key] = event;
      }
    }
    // TODO handle text values changing
    // TODO debounce time needs to be here even though it is in the effects?
    // this.store.dispatch({type : dsa.FILTER_UPDATE, payload : this.filters});
  }
  /**
   * Creates a filtered array based
   * on provided search term that matches the given key
   * @param {any} query
   * @param {any} key
   * @returns
   * @memberof DatasetsFilterComponent
   */
  filterDatasets(query, key) {
    const filtered = [];
    const array = key === 'creationLocation' ? this.locations : this.groups;
    if (array) {
      for (let i = 0; i < array.length; i++) {
        const loc = typeof array[i] === 'object' && !('_id' in array[i])
          ? array[i]
          : array[i]['_id'];
        if (loc && loc.toLowerCase().indexOf(query.toLowerCase()) === 0 &&
          filtered.indexOf(loc) === -1) {
          filtered.push(array[i]);
        }
      }
    }
    return filtered;
  }

  /**
   * Handle clicking of available locations
   */
  locSelected() {
    this.filters.creationLocation = this.location['_id'];
    // this.store.dispatch(
    //     {type : dua.SAVE, payload : {beamlineText : this.location}});
    this.store.dispatch(new dsa.UpdateFilterAction(this.filters));
  }

  /**
   * Handle clicking of available groups (contains ANOTHER primeng hack to wait
   * for array to be cleared
   * since this is called before that happens)
   */
  groupSelected(event) {
    setTimeout(() => {
      this.filters.ownerGroup = this.selectedGroups.map(x => { return x['_id']; });
      this.store.dispatch(new dsa.UpdateFilterAction(this.filters));
    }, 400);
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
