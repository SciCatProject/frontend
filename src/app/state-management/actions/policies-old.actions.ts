import { Action } from "@ngrx/store";
import { Policy } from "shared/sdk/models";

export const SELECT_POLICY = "[Policy] Select Policy";
export const DESELECT_POLICY = "[Policy] Deselect Policy";
export const CLEAR_SELECTION = "[Policy] Clear Selection";

export const FETCH_POLICIES = "[Policy] Fetch Policies";
export const FETCH_POLICIES_COMPLETE = "[Policy] Fetch Policies Complete";
export const FETCH_POLICIES_FAILED = "[Policy] Fetch Policies Failed";

export const SUBMIT_POLICY = "[Policy] Submit policy settings";
export const SUBMIT_POLICY_COMPLETE =
  "[Policy] Submit policy settings complete";
export const SUBMIT_POLICY_FAILED = "[Policy] Submit failed";

export const CHANGE_PAGE = "[Policy] Change Page";
export const SORT_BY_COLUMN = "[Policy] Sort by Column";

export const FETCH_COUNT_POLICIES = "[Policy] Fetch count";
export const FAILED_POLICIES = "[Policy] Failed policies action";
export const FETCH_EDITABLE_POLICIES = "[Policy] Fetch editable policies";
export const FETCH_EDITABLE_POLICIES_COMPLETE =
  "[Policy] Fetch editable policies complete";

export class SubmitPolicyAction implements Action {
  readonly type = SUBMIT_POLICY;
  constructor(
    readonly ownerList: string[],
    readonly policyAttributes: Policy
  ) {}
}

export class SubmitPolicyCompleteAction implements Action {
  readonly type = SUBMIT_POLICY_COMPLETE;
  constructor(readonly submissionResponse: Policy) {}
}

export class SubmitPolicyFailedAction implements Action {
  readonly type = SUBMIT_POLICY_FAILED;
  constructor(readonly error: Error) {}
}

export class SelectPolicyAction implements Action {
  readonly type = SELECT_POLICY;
  constructor(readonly policy: Policy) {}
}

export class DeselectPolicyAction implements Action {
  readonly type = DESELECT_POLICY;
  constructor(readonly policy: Policy) {}
}

export class ClearSelectionAction implements Action {
  readonly type = CLEAR_SELECTION;
}

export class FetchPoliciesAction implements Action {
  readonly type = FETCH_POLICIES;
}

export class FetchPoliciesCompleteAction implements Action {
  readonly type = FETCH_POLICIES_COMPLETE;
  constructor(readonly policies: Policy[]) {}
}

export class FetchPoliciesFailedAction implements Action {
  readonly type = FETCH_POLICIES_FAILED;
}

export class ChangePageAction implements Action {
  readonly type = CHANGE_PAGE;
  constructor(readonly page: number, readonly limit: number) {}
}

export class SortByColumnAction implements Action {
  readonly type = SORT_BY_COLUMN;
  constructor(readonly column: string, readonly direction: string) {}
}

export class FetchCountPolicies implements Action {
  readonly type = FETCH_COUNT_POLICIES;
  constructor(readonly count: number) {}
}

export class FailedPoliciesAction implements Action {
  readonly type = FAILED_POLICIES;
  constructor(err: string) {}
}

export class FetchEditablePolicies implements Action {
  readonly type = FETCH_EDITABLE_POLICIES;
  constructor() {}
}

export class FetchEditablePoliciesComplete implements Action {
  readonly type = FETCH_EDITABLE_POLICIES_COMPLETE;
  constructor(readonly editablePolicies: Policy[]) {}
}

/*export type FetchPoliciesOutcomeAction =
  | FetchPoliciesCompleteAction
  | FetchPoliciesFailedAction
  | FetchEditablePoliciesComplete;

export type SubmitPoliciesOutcomeAction =
  | SubmitPolicyCompleteAction
  | SubmitPolicyFailedAction;*/

export type PoliciesActions =
  | SelectPolicyAction
  | DeselectPolicyAction
  | FetchPoliciesAction
  | FetchPoliciesCompleteAction
  | FetchPoliciesFailedAction
  | ClearSelectionAction
  | SubmitPolicyAction
  | SubmitPolicyCompleteAction
  | SubmitPolicyFailedAction
  | ChangePageAction
  | SortByColumnAction
  | FetchCountPolicies
  | FailedPoliciesAction
  | FetchEditablePolicies
  | FetchEditablePoliciesComplete;

// New filtering actions
