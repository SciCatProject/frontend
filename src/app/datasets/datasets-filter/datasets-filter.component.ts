import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {Tree, TreeNode} from 'primeng/primeng';
import * as dua from 'state-management/actions/dashboard-ui.actions';
import * as dsa from 'state-management/actions/datasets.actions';
import * as dUIStore from 'state-management/state/dashboard-ui.store';
import * as dStore from 'state-management/state/datasets.store';

@Component({
  selector : 'datasets-filter',
  templateUrl : './datasets-filter.component.html',
  styleUrls : [ './datasets-filter.component.css' ]
})
export class DatasetsFilterComponent implements OnInit {

  @ViewChild('datetree') dateTree: Tree;

  @Input() datasets: Array<any> = [];
  facets: Array<any> = [];
  months = [
    '', 'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  startDate: Date;
  endDate: Date;
  resultCount = 0;
  dates = [];

  dateFacet = [];

  location: {};
  locations = [];
  filteredLocations = [];

  group: {};
  groups = [];
  filteredGroups = [];

  filters;
  filterValues;

  constructor(private store: Store<any>) {
  }

  /**
   * Load locations and ownergroups on start up and
   * only use unique values
   */
  ngOnInit() {
    this.store.select(state => state.root.datasets.activeFilters)
        .subscribe(data => {
          this.filters = data;
          this.location =
              data.creationLocation ? {_id : data.creationLocation} : '';
          if (data.groups && data.groups.length > 0 && data.groups[0].indexOf('p') === 0) {
            this.group = {_id : data.groups[0]};
            }
          /*if(!this.dates) this.dates = [];*/
          // this.dates.push(this.filters.startDate);
          // this.dates.push(this.filters.endDate);
        });
    this.store.select(state => state.root.datasets.filterValues)
        .subscribe(values => {
          this.filterValues = values;
          if (this.filterValues) {
            if (this.filterValues['locations'] !== null) {
              this.locations = this.filterValues['locations'] ? this.filterValues['locations'] : [];
              this.resultCount = this.locations.reduce((sum, value) => sum + value['count'], 0);
            }
            if (this.filterValues['groups'] !== null) {
              this.groups = this.filterValues['groups'];
            }
            this.dateFacet = [];
            let dates = [];
            if (this.filterValues['years']) {
              dates = dates.concat(this.filterValues['years']);
              dates.forEach(date => {
                const year = date['_id']['year'];
                const month = date['_id']['month'];
                const yid = {'year' : year};
                const yindex = dates.findIndex(found => {
                  if (found._id.year === year && !('month' in found._id) &&
                      !('day' in found._id)) {
                    return found;
                  }
                });
                if (yindex !== -1) {
                  dates[yindex]['count'] += Number(date['count']);
                } else {
                  dates.push({'_id' : yid, 'count' : Number(date['count'])});
                  }
                const mid = {'year' : year, 'month' : month};
                const mindex = dates.findIndex(found => {
                  if (found._id.year === year && found._id.month === month &&
                      !('day' in found._id)) {
                    return found;
                  }
                });
                if (mindex !== -1) {
                  dates[mindex]['count'] += Number(date['count']);
                } else {
                  dates.push({'_id' : mid, 'count' : Number(date['count'])});
                }
              });
            }
          }
        });
  }

  /**
   * Callback used whenever a time checkbox has been selected or
   * deselected
   * @param event
   */
  onTimeSelect(event) {
    console.log(this.dates);
    this.filters.startDate = new Date(this.dates[0]);
    this.filters.endDate = this.dates[1] !== null ? new Date(this.dates[1]) : new Date(this.dates[0]);
    this.filters.endDate.setHours(23, 59, 59, 0);
    this.store.dispatch({type : dsa.FILTER_UPDATE, payload : this.filters});
    this.onSubmit();
  }

  /**
   * Handles search queries for the creation
   * location dropdown, this links to a mongo filter query
   * @param {any} event
   * @memberof DatasetsFilterComponent
   */
  handleInputLocation(event) {
    this.filteredLocations =
        this.filterDatasets(event.query, 'creationLocation');
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
    if (event.length === 0) {
      this.filters[key] = null;
    } else if (event.length >= 2) {
      if (key === 'groups') {
        this.filters[key] = [ event ];
      } else {
        this.filters[key] = event;
      }
    }
    // TODO handle text values changing
    // TODO debounce time needs to be here even though it is in the effects?
    this.store.dispatch({type : dsa.FILTER_UPDATE, payload : this.filters});
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
        const loc = typeof(array[i]) === 'object' && !('_id' in array[i])
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
    this.store.dispatch(
        {type : dua.SAVE, payload : {beamlineText : this.location}});
    this.store.dispatch({type : dsa.FILTER_UPDATE, payload : this.filters});
    this.onSubmit();
  }

  /**
   * Handle clicking of available groups
   */
  groupSelected() {
    this.filters.groups = [ this.group['_id'] ];
    this.store.dispatch({type : dsa.FILTER_UPDATE, payload : this.filters});
    this.onSubmit();
  }

  onSubmit() {
    this.store.select(state => state.root.datasets.activeFilters).take(1).subscribe(filters => {
      this.store.dispatch({ type: dsa.SEARCH, payload: filters });
    });
  }

  /**
   * Clear the filters and reset the user groups (when not a functional account)
   */
  clearFacets() {
    this.dates = [];
    this.location = '';
    this.group = '';
    this.filters = dStore.initialDatasetState.activeFilters;
    this.store.select(state => state.root.user.currentUserGroups)
        .take(1)
        .subscribe(groups => this.filters.groups = groups);
    console.log(this.filters);
    this.filterValues = dStore.initialDatasetState.filterValues;
    console.log(this.filterValues);
    this.filterValues.text = '';
    this.store.dispatch({type : dsa.FILTER_UPDATE, payload : this.filters});
    this.store.dispatch(
        {type : dsa.FILTER_VALUE_UPDATE, payload : this.filterValues});
    this.store.dispatch(
        {type : dua.SAVE, payload : dUIStore.initialDashboardUIState});
    this.store.dispatch({type: dsa.SEARCH, payload: this.filters});
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
