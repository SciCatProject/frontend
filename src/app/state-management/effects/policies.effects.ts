import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { PolicyApi, Policy } from "shared/sdk";
import { Store, select } from "@ngrx/store";
import {
  getQueryParams,
  getPolicies
} from "state-management/selectors/policies.selectors";
import * as fromActions from "state-management/actions/policies.actions";
import {
  switchMap,
  withLatestFrom,
  map,
  catchError,
  mergeMap
} from "rxjs/operators";
import { of } from "rxjs";
import { getProfile } from "state-management/selectors/users.selectors";

@Injectable()
export class PolicyEffects {
  private queryParams$ = this.store.pipe(select(getQueryParams));
  private policies$ = this.store.pipe(select(getPolicies));
  private userProfile$ = this.store.pipe(select(getProfile));

  fetchPolicies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.fetchPoliciesAction,
        fromActions.changePageAction,
        fromActions.sortByColumnAction
      ),
      withLatestFrom(this.queryParams$),
      map(([action, params]) => params),
      switchMap(params =>
        this.policyApi.find(params).pipe(
          mergeMap((policies: Policy[]) => [
            fromActions.fetchPoliciesCompleteAction({ policies }),
            fromActions.fetchEditablePoliciesAction()
          ]),
          catchError(() => of(fromActions.fetchPoliciesFailedAction()))
        )
      )
    )
  );

  fetchCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchPoliciesAction),
      switchMap(() =>
        this.policyApi.count().pipe(
          map(({ count }) => fromActions.fetchCountCompleteAction({ count })),
          catchError(() => of(fromActions.fetchCountFailedAction()))
        )
      )
    )
  );

  fetchEditablePolicies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchEditablePoliciesAction),
      withLatestFrom(this.userProfile$, this.policies$),
      map(([action, profile, allPolicies]) => {
        const editablePolicies = [];
        if (!profile) {
          return fromActions.fetchEditablePoliciesCompleteAction({
            policies: allPolicies
          });
        } else {
          const email = profile.email.toLowerCase();
          allPolicies.forEach(policy => {
            if (policy.manager.indexOf(email) !== -1) {
              editablePolicies.push(policy);
            }
          });
          return fromActions.fetchEditablePoliciesCompleteAction({
            policies: editablePolicies
          });
        }
      }),
      catchError(() => of(fromActions.fetchEditablePoliciesFailedAction()))
    )
  );

  submitPolicy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.submitPolicyAction),
      switchMap(({ ownerList, policy }) =>
        this.policyApi.updatewhere(ownerList.join(), policy).pipe(
          mergeMap(({ submissionResponse }) => [
            fromActions.submitPolicyCompleteAction({
              policy: submissionResponse
            }),
            fromActions.fetchPoliciesAction()
          ]),
          catchError(() => of(fromActions.submitPolicyFailedAction()))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private policyApi: PolicyApi,
    private store: Store<Policy>
  ) {}
}
