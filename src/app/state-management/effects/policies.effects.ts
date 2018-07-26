import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { PolicyApi } from 'shared/sdk/services';
import { PoliciesService } from 'archive-settings/policies.service';
import { Policy } from 'state-management/models';
import {
  FetchPoliciesOutcomeAction,
  FETCH_POLICIES, FetchPoliciesAction,
  FETCH_POLICIES_COMPLETE, FetchPoliciesCompleteAction,
  FETCH_POLICIES_FAILED, FetchPoliciesFailedAction
} from '../actions/policies.actions';
import { map, switchMap, tap, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class PoliciesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<Policy>,
    private policyApi: PolicyApi,
    private policiesService: PoliciesService
  ) { }

  @Effect()
  fetchPolicies$: Observable<Action> =
    this.actions$.pipe(
      ofType(FETCH_POLICIES),
      switchMap((action) =>
        this.policiesService.getPolicies().pipe(
          map(policies => new FetchPoliciesCompleteAction(policies)),
          catchError(err => Observable.of(new FetchPoliciesFailedAction()))



        )
      )
    );
}
