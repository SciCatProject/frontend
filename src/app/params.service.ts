import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import * as ua from 'state-management/actions/user.actions';
import * as rison from 'rison';
import * as selectors from 'state-management/selectors';
import * as dsa from 'state-management/actions/datasets.actions';
import * as dStore from 'state-management/state/datasets.store';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/skip';
@Injectable()
export class ParamsService {
  constructor(private store: Store<any>, private route: ActivatedRoute,
    private router: Router) {
      this.route.queryParams.subscribe(params => {
        try {
          console.log(window.location.pathname);
          if (window.location.pathname.indexOf('datasets') !== -1 || window.location.pathname === '/') {
            const newParams = 'args' in params ? rison.decode(params['args']) : dStore.initialDatasetState.activeFilters;
            const mode = newParams['mode'];
            delete newParams['mode'];
            // TODO could dispatch mode action here
            const filters = Object.assign({}, newParams);
            this.store.dispatch(new dsa.UpdateFilterAction(filters));
          }
        } catch (err) {
          // this.router.navigate(['/datasets']);
          // TODO handle malformed arguments
        }

      });

      this.store.select(selectors.datasets.getActiveFilters).skip(1)
        .subscribe(filters => {
        this.store.select(selectors.ui.getMode).take(1).subscribe(currentMode => {
          filters['mode'] = currentMode;
          if (window.location.pathname.indexOf('datasets') !== -1) {
            this.router.navigate(['/datasets'], { queryParams: { args: rison.encode(filters) } });
          }
        });
      });

      this.store.select(selectors.ui.getMode).skip(1)
        .subscribe(currentMode => {
        this.route.queryParams.take(1).subscribe(params => {
          const newParams = 'args' in params ? rison.decode(params['args']) : dStore.initialDatasetState.activeFilters;
          newParams['mode'] = currentMode;
          if (window.location.pathname.indexOf('datasets') !== -1) {
            this.router.navigate(['/datasets'], { queryParams: { args: rison.encode(newParams) } });
          }
        });
      });

  }

}
