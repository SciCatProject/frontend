import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as ua from 'state-management/actions/user.actions';
import * as rison from 'rison';
import * as selectors from 'state-management/selectors';
import * as dsa from 'state-management/actions/datasets.actions';
import * as dStore from 'state-management/state/datasets.store';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/skip';

import { getViewMode } from 'state-management/selectors/datasets.selectors';

@Injectable()
export class ParamsService {
  constructor(private store: Store<any>, private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      try {
        if (window.location.pathname.indexOf('datasets') !== -1 || window.location.pathname === '/') {
          this.handleParams(params);
        }
      } catch (err) {
        // this.router.navigate(['/datasets']);
        // TODO handle malformed arguments
      }

    });

    // this.route.queryParams.take(1).subscribe(p => this.handleParams(p));

    this.store.select(selectors.datasets.getActiveFilters)
      .subscribe(filters => {
        if (filters) {
          this.store.pipe(select(getViewMode)).take(1).subscribe(currentMode => {
            filters['mode'] = currentMode;
            if (window.location.pathname.indexOf('datasets') !== -1) {
              this.router.navigate(['/datasets'], { queryParams: { args: rison.encode(filters) } });
            }
          });
        }
      });

    this.store.pipe(select(getViewMode))
      .subscribe(currentMode => {
        if (currentMode) {
          this.route.queryParams.take(1).subscribe(params => {
            const newParams = 'args' in params ? rison.decode(params['args']) : dStore.initialDatasetState.activeFilters;
            newParams['mode'] = currentMode;
            if (window.location.pathname.indexOf('datasets') !== -1) {
              this.router.navigate(['/datasets'], { queryParams: { args: rison.encode(newParams) } });
            }
          });
        }
      });

  }

  handleParams(params) {
    const newParams = 'args' in params ? rison.decode(params['args']) : dStore.initialDatasetState.activeFilters;
    const mode = newParams['mode'];
    delete newParams['mode'];
    // TODO could dispatch mode action here
    const filters = Object.assign({}, newParams);
    this.store.dispatch(new dsa.UpdateFilterAction(filters));
  }

}
