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
  SubmitPolicyFailedAction
} from "../actions/policies.actions";
import { getQueryParams } from "../selectors/policies.selectors";
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  concatMap,
  withLatestFrom
} from "rxjs/operators";
import { Policy } from "state-management/models";

@Injectable()
export class PoliciesEffects {
  @Effect()
  submitPolicy$: Observable<Action> = this.actions$.pipe(
    ofType(SUBMIT_POLICY),
    map((action: SubmitPolicyAction) => action.policySubmission),
    concatMap(submission => {
      return this.policyApi
        .updateAll("id:%7B%22id%22%3A%20%225b7d31c496f3ea542d9f67be%22%7", "")
        //.updateAll( {id: submission.where}, submission.data)
        .pipe(
          mergeMap((data: any) => [
            new SubmitPolicyCompleteAction(data.submissionResponse),
            new FetchPoliciesAction()
          ])
        );
    }),
    catchError(err => of(new SubmitPolicyFailedAction(err)))
  );

  @Effect({ dispatch: false })
  private queryParams$ = this.store.pipe(select(getQueryParams));

  @Effect()
  private fetchPolicies$: Observable<Action> = this.actions$.pipe(
    ofType(FETCH_POLICIES),
    withLatestFrom(this.queryParams$),
    map(([action, params]) => params),
    mergeMap(({ limits }) =>
      this.policyApi.find(limits).pipe(
        map(policies => new FetchPoliciesCompleteAction(policies as Policy[])),
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
