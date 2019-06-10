import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, select, Store } from "@ngrx/store";
import { PolicyApi } from "shared/sdk/services";
import { PoliciesService } from "policies/policies.service";
import {
  FETCH_POLICIES,
  FetchPoliciesAction,
  FetchPoliciesCompleteAction,
  FetchPoliciesFailedAction,
  SUBMIT_POLICY,
  SubmitPolicyAction,
  SubmitPolicyCompleteAction,
  SubmitPolicyFailedAction,
  CHANGE_PAGE,
  FetchCountPolicies,
  FailedPoliciesAction,
  FETCH_EDITABLE_POLICIES,
  FetchEditablePoliciesComplete,
  FetchEditablePolicies,
} from "../actions/policies.actions";
import { getQueryParams, getPolicies } from "../selectors/policies.selectors";
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom
} from "rxjs/operators";
import { Policy } from "state-management/models";
import * as userSelectors from "state-management/selectors/users.selectors";

@Injectable()
export class PoliciesEffects {
  @Effect()
  submitPolicy$: Observable<Action> = this.actions$.pipe(
    ofType(SUBMIT_POLICY),
    map((action: SubmitPolicyAction) => action),
    switchMap(action =>
      this.policiesService
        .updatePolicies(action.ownerList, action.policyAttributes)
        .pipe(
          mergeMap((data: any) => [
            new SubmitPolicyCompleteAction(data.submissionResponse),
            new FetchPoliciesAction()
          ]),
          catchError(err => of(new SubmitPolicyFailedAction(err)))
        )
    )
  );

  @Effect({ dispatch: false })
  private queryParams$ = this.store.pipe(select(getQueryParams));

  @Effect()
  private fetchPolicies$: Observable<Action> = this.actions$.pipe(
    ofType(FETCH_POLICIES, CHANGE_PAGE),
    withLatestFrom(this.queryParams$),
    map(([action, params]) => params),
    switchMap(({ limits }) =>
      this.policyApi.find(limits)
      .pipe(
        mergeMap(policies => [
          new FetchPoliciesCompleteAction(policies as Policy[]),
          new FetchEditablePolicies()
        ]),
        catchError(err => of(new FetchPoliciesFailedAction()))
      )
    )
  );

  @Effect()
  FetchCountPolicies$ = this.actions$.pipe(
    ofType(FETCH_POLICIES),
    switchMap(action => this.policyApi.count()
    .pipe(map(({ count }) => new FetchCountPolicies(count)),
    catchError(err => of(new FailedPoliciesAction(err)))))
  );

  @Effect({ dispatch: false })
  private userProfile$ = this.store.pipe(select(userSelectors.getProfile));

  @Effect({ dispatch: false })
  private policies$ = this.store.pipe(select(getPolicies));

  @Effect()
  FetchEditablePolicies$ = this.actions$.pipe(
    ofType(FETCH_EDITABLE_POLICIES),
    withLatestFrom(this.userProfile$),
    withLatestFrom(this.policies$),
    map(([[action, profile], allPolicies]) => {
      const editablePolicies = [];
      if (!profile) {
        return new FetchEditablePoliciesComplete(editablePolicies);
      }
      const email = profile.email;
      allPolicies.forEach(pol => {
        if (pol.manager.indexOf(email) !== -1) {
          editablePolicies.push(pol);
        }
      });
      return new FetchEditablePoliciesComplete(editablePolicies);
    }));




  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private policyApi: PolicyApi,
    private policiesService: PoliciesService
  ) {}
}
