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
          const newParams = 'args' in params ? rison.decode(params['args']) : dStore.initialDatasetState.activeFilters;
          const mode = newParams['mode'];
          delete newParams['mode'];
          const filters = Object.assign({}, newParams);
          this.store.dispatch(new dsa.UpdateFilterAction(filters));
        } catch (err) {
          this.router.navigate(['/datasets']);
        }

      });

      this.store.select(selectors.datasets.getActiveFilters).skip(1)
        .subscribe(filters => {
        this.store.select(selectors.ui.getMode).take(1).subscribe(currentMode => {
          filters['mode'] = currentMode;
          console.log(filters);
          this.router.navigate(['/datasets'], { queryParams: { args: rison.encode(filters) } });
        });
      });

      this.store.select(selectors.ui.getMode)
        .subscribe(currentMode => {
        this.route.queryParams.takeLast(1).subscribe(params => {
          const newParams = 'args' in params ? rison.decode(params['args']) : dStore.initialDatasetState.activeFilters;
          newParams['mode'] = currentMode;
          // this.router.navigate(['/datasets'], { queryParams: { args: rison.encode(newParams) } });
        });
      });

  }

}
