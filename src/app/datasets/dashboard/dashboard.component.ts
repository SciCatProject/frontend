import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { RawDataset } from 'shared/sdk/models';
import * as dsa from 'state-management/actions/datasets.actions';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
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

  searchText$;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<any>
  ) {
    this.datasets = [];
  }

  /**
   * On loading of the dashboard, initiate a search
   * using the filters in the state
   *
   */
  ngOnInit() {
    this.searchText$ = this.store.select(
      state => state.root.datasets.activeFilters.text
    );
  }

  /**
   * Handles free text search.
   * Need to determine best way to search mongo fields
   * @param {any} customTerm - free text search term@memberof DashboardComponent
   */
  textSearch(terms) {
    console.log(terms);
    this.store
      .select(state => state.root.datasets.activeFilters)
      .take(1)
      .subscribe(values => {
        const filters = Object.assign({}, values);
        filters['text'] = terms;
        this.store.dispatch({ type: dsa.FILTER_UPDATE, payload: filters });
      });
  }
}
