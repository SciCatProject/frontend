import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {DatasetService} from 'datasets/dataset.service';
import {RawDataset} from 'shared/sdk/models';
import * as dua from 'state-management/actions/dashboard-ui.actions';
import * as dsa from 'state-management/actions/datasets.actions';

@Component({
  selector : 'dashboard',
  templateUrl : './dashboard.component.html',
  styleUrls : [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  apiEndpoint: string;

  /**
   * Datasets retrieved from catalogue that match a user's search terms.
   *
   * @type {Array<RawDataset>}
   * @memberof DashboardComponent
   */
  datasets: Array<RawDataset> = [];
  // rows: any[] = [];
  searchText: string;

  constructor(private router: Router, private cds: DatasetService,
              private store: Store<any>) {
    this.datasets = [];
    this.store.select(state => state.root.datasets.activeFilters)
        .subscribe(
            values => { this.searchText = values.text ? values.text : ''; });
  }

  /**
   * On loading of the dashboard, initiate a search
   * using the filters in the state
   *
   */
  ngOnInit() {}

  /**
   * Handles free text search.
   * Need to determine best way to search mongo fields
   * @param {any} customTerm - free text search term@memberof DashboardComponent
   */
  textSearch(terms) {
    console.log(terms);
    this.store.select(state => state.root.datasets.activeFilters)
        .take(1)
        .subscribe(values => {
          values['text'] = terms;
          this.store.dispatch({type : dsa.FILTER_UPDATE, payload : values});
          this.store.dispatch({type: dsa.SEARCH, payload: values});
        });
  }

  onDatasetRedirect(event) {
    this.store.dispatch({type : dua.SAVE, payload : event.pl});
    this.router.navigateByUrl('/dataset/' + event.pid);
  }
}
