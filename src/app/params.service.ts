import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import * as ua from 'state-management/actions/user.actions';
import * as rison from 'rison';
import * as selectors from 'state-management/selectors';
import { ActivatedRoute, Router } from '@angular/router';
@Injectable()
export class ParamsService {
  constructor(private store: Store<any>, private route: ActivatedRoute,
    private router: Router) {
      this.route.queryParams.subscribe(params => {
        const newParams = 'args' in params ? rison.decode(params['args']) : {};
        console.log('PARAMS', newParams);
      });
  

  }

}
