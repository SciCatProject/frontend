import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { PolicyApi } from 'shared/sdk/services';
import { PoliciesService } from 'policies/policies.service';
import { Policy } from 'state-management/models';
import {
  FetchPoliciesOutcomeAction,
  FETCH_POLICIES, FetchPoliciesAction,
  FETCH_POLICIES_COMPLETE, FetchPoliciesCompleteAction,
  FETCH_POLICIES_FAILED, FetchPoliciesFailedAction,
  SUBMIT_POLICY, SubmitPolicyAction,
  SUBMIT_POLICY_COMPLETE, SubmitPolicyCompleteAction,
  SUBMIT_POLICY_FAILED, SubmitPolicyFailedAction
} from '../actions/policies.actions';
import { map, switchMap, tap, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';

@Injectable()
export class PoliciesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private policyApi: PolicyApi,
    private policiesService: PoliciesService
  ) { }

/*  @Effect()
  fetchPolicies$: Observable<Action> = this.actions$
    .do((action) => console.log("Received!!!!!!! "))
    .filter((action) => action.type === PoliciesActions.FETCH_POLICIES)
*/

@Effect()
submitPolicy$: Observable<Action> =
  this.actions$.pipe(
    ofType(SUBMIT_POLICY),
    map((action: SubmitPolicyAction) => action.policy),
    switchMap((policy) => {
      return this.policyApi.patchAttributes(policy.id, policy).pipe(
        map(res =>new SubmitPolicyCompleteAction(res))
      );
    }),
    catchError(err => of(new SubmitPolicyFailedAction(err))
    ));

   @Effect()
    fetchPolicies$: Observable<Action> =
      this.actions$.pipe(
        ofType(FETCH_POLICIES),
        switchMap((action) =>
          this.policiesService.getPolicies().pipe(
            map(policies => new FetchPoliciesCompleteAction(policies)),
            catchError(err => of(new FetchPoliciesFailedAction()))



          )
        )
      );
}
