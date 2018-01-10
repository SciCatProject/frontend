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
  selectedBeam;
  selectedGroup;

  group: {};
  groups = [];
  selectedGroups = [];
  // filteredGroups = [];

  filters: any = dStore.initialDatasetState.activeFilters;
  filterValues;

  subscriptions = [];

  constructor(private store: Store<any>, private route: ActivatedRoute,
    private router: Router) {
      this.beamlineInput = new FormControl();
      this.groupInput = new FormControl();

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
      const newParams = 'args' in params ? rison.decode(params['args']) : this.filters;
      delete newParams['mode'];
      this.filters = Object.assign({}, newParams);
      console.log(newParams);
      this.store.dispatch(new dsa.UpdateFilterAction(newParams));
    }));

    this.subscriptions.push(
      this.store.select(selectors.datasets.getActiveFilters)
        .subscribe(combined => {
          this.filters = Object.assign({}, combined);
          const group = combined['ownerGroup'];
          this.selectedGroup = group !== undefined ? group.toString() : undefined;
          // TODO autoselect locations and dates as well
        this.store.select(selectors.ui.getMode).take(1).subscribe(currentMode => {
           combined['mode'] = currentMode;
           console.log(combined);
            this.router.navigate(['/datasets'], { queryParams: {args: rison.encode(combined)} });
        });
        }));
    //   const newParams = 'args' in params ? rison.decode(params['args']) : {};
    //   delete newParams['mode'];
    //   const activeFilters$ = this.store.select(selectors.datasets.getActiveFilters);
    //   const mode$ = this.store.select(selectors.ui.getMode);
    //   Observable.combineLatest(activeFilters$, mode$).takeLast(1).subscribe(combined => {
    //     const filters = combined[0];
    //     const mode = combined[1];
    //     const f = utils.filter(filters, newParams);
    //     // this.location = f['creationLocation']
    //     //  ? { _id: filters['creationLocation'] }
    //     //  : '';
    //     const group = f['ownerGroup'];
    //     if (group && group && Array.isArray(group) &&
    //       group.length > 0) {
    //       this.selectedGroups = group.map(x => { return { _id: x }; });
    //     } else if (group && !Array.isArray(group)) {
    //       this.selectedGroups = [{ '_id': group }];
    //     } else {
    //       this.selectedGroups = [];
    //     }
    //     if (utils.compareObj(f, newParams)) {
    //       const encoded = rison.encode(newParams);
    //       console.log(encoded);
    //       this.router.navigate(
    //         ['/datasets'],
    //         { queryParams: {args: encoded}, replaceUrl: true });
    //     } else if (params['mode'] !== mode) {
    //       this.store.dispatch(new dsa.UpdateFilterAction(f));
    //     }
    //   });
    // }));
    // this.subscriptions.push(
    //   this.store.select(selectors.datasets.getActiveFilters)
    //     .subscribe(data => {
    //       const args = 'args' in this.route.snapshot.queryParams ? rison.decode(this.route.snapshot.queryParams['args']) : {};
    //       this.filters = Object.assign(args, data);
    //       console.log(this.filters);
    //       this.router.navigate(['/datasets'], { queryParams: {args: rison.encode(this.filters)} });
    //     }));
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
            if (this.filterValues.creationLocation) {
              this.filteredBeams = this.beamlineInput.valueChanges
            .pipe(startWith(''), map(beam => beam ? this.filterBeams(beam) : this.filterValues.creationLocation.slice()));
            }
            if (this.filterValues.ownerGroup) {
            this.filteredGroups = this.groupInput.valueChanges
              .pipe(startWith(''), map(group => group ? this.filterGroups(group) : this.filterValues.ownerGroup.slice()));
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
      this.store.dispatch(new dsa.UpdateFilterAction(this.filters));
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
    this.selectedGroups = [];
    this.beamlineInput.setValue('');
    this.groupInput.setValue('');
    this.selectedGroup = '';
    this.filters = dStore.initialDatasetState.activeFilters;
    this.dateSelections$.next([]);
    this.store.select(state => state.root.user.currentUserGroups)
        .takeLast(1)
        .subscribe(groups => { this.filters.ownerGroup = groups; });
    this.filters.ownerGroup = [];
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
