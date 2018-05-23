import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Dataset } from 'shared/sdk/models';

import * as dsa from 'state-management/actions/datasets.actions';
import * as ds from 'state-management/selectors/datasets.selectors';
import * as selectors from 'state-management/selectors';

import { ParamsService } from 'params.service';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private searchText$: Observable<string>;
  private selectedDatasets$: Observable<Dataset[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<any>,
    private params: ParamsService,
  ) {
    this.selectedDatasets$ = this.store.pipe(select(ds.getSelectedDatasets));
  }

  /**
   * On loading of the dashboard, initiate a search
   * using the filters in the state
   *
   */
  ngOnInit() {
    this.searchText$ = this.store.select(ds.getSearchTerms);
  }

  /**
   * Handles free text search.
   * Need to determine best way to search mongo fields
   * @param {any} customTerm - free text search term
   * @memberof DashboardComponent
   */
  textSearch(terms) {
    this.store.dispatch(new dsa.SetSearchTermsAction(terms));
  }
}
