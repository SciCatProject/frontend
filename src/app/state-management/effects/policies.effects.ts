import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { PolicyApi } from "shared/sdk/services";
import { PoliciesService } from "policies/policies.service";
import {
  FETCH_POLICIES,
  FetchPoliciesCompleteAction,
  FetchPoliciesFailedAction,
  SUBMIT_POLICY,
  SubmitPolicyAction,
  SubmitPolicyCompleteAction,
  SubmitPolicyFailedAction
} from "../actions/policies.actions";
import { catchError, map, switchMap } from "rxjs/operators";

@Injectable()
export class PoliciesEffects {
  @Effect()
  submitPolicy$: Observable<Action> = this.actions$.pipe(
    ofType(SUBMIT_POLICY),
    map((action: SubmitPolicyAction) => action.policy),
    switchMap(policy => {
      return this.policyApi
        .patchAttributes(policy.id, policy)
        .pipe(
          map(submitComplete => new SubmitPolicyCompleteAction(submitComplete))
        );
    }),
    catchError(err => of(new SubmitPolicyFailedAction(err)))
  );

  /*  @Effect()
  fetchPolicies$: Observable<Action> = this.actions$
    .do((action) => console.log("Received!!!!!!! "))
    .filter((action) => action.type === PoliciesActions.FETCH_POLICIES)
*/
  @Effect()
  fetchPolicies$: Observable<Action> = this.actions$.pipe(
    ofType(FETCH_POLICIES),
    switchMap(action =>
      this.policiesService.getPolicies().pipe(
        map(policies => new FetchPoliciesCompleteAction(policies)),
        catchError(err => of(new FetchPoliciesFailedAction()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private policyApi: PolicyApi,
    private policiesService: PoliciesService
  ) {}
}
