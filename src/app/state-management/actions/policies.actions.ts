import { Action } from '@ngrx/store';
import { Policy } from 'shared/sdk/models';


export const LOAD = '[Policy] Load';
export const COUNT_COMPLETE = '[Policy] Complete';
export const SELECT_CURRENT = '[Policy] Current set selected';
export const TOTAL_UPDATE = '[Policy] Total Policies Update';

export const SELECT_POLICY = '[Policy] Select Policy';
export const DESELECT_POLICY = '[Policy] Deselect Policy';
export const CLEAR_SELECTION = '[Policy] Clear Selection';

export const FETCH_POLICIES = '[Policy] Fetch Policies';
export const FETCH_POLICIES_COMPLETE = '[Policy] Fetch Policies Complete';
export const FETCH_POLICIES_FAILED = '[Policy] Fetch Policies Failed';

export const SUBMIT_POLICY = '[Policy] Submit policy settings';
export const SUBMIT_POLICY_COMPLETE = '[Policy] Submit policy settings complete';
export const SUBMIT_POLICY_FAILED = '[Policy] Submit failed';


export class SubmitPolicyAction implements Action {
    readonly type = SUBMIT_POLICY;
    constructor(readonly policy: Policy) {}
}

export class SubmitPolicyCompleteAction implements Action {
    readonly type = SUBMIT_POLICY_COMPLETE;
    constructor(readonly submitComplete : true) {}
}

export class SubmitPolicyFailedAction implements Action {
    readonly type = SUBMIT_POLICY_FAILED;
    constructor(readonly error: Error) {}
}


export class SelectPolicyAction implements Action {
  readonly type = SELECT_POLICY;
  constructor(readonly policy: Policy) { }
}

export class DeselectPolicyAction implements Action {
  readonly type = DESELECT_POLICY;
  constructor(readonly policy: Policy) { }
}

export class ClearSelectionAction implements Action {
  readonly type = CLEAR_SELECTION;
}


export class FetchPoliciesAction implements Action {
  readonly type = FETCH_POLICIES;
}

export class FetchPoliciesCompleteAction implements Action {
  readonly type = FETCH_POLICIES_COMPLETE;
  constructor(readonly policies: Policy[]) { }
}

export class FetchPoliciesFailedAction implements Action {
  readonly type = FETCH_POLICIES_FAILED;
}


export type FetchPoliciesOutcomeAction =
  FetchPoliciesCompleteAction |
  FetchPoliciesFailedAction;

  export type SubmitPoliciesOutcomeAction =
    SubmitPolicyCompleteAction |
    SubmitPolicyFailedAction;


export type PoliciesActions =
  SelectPolicyAction | DeselectPolicyAction | FetchPoliciesAction |
  FetchPoliciesCompleteAction | FetchPoliciesFailedAction | FetchPoliciesOutcomeAction | ClearSelectionAction
  | SubmitPolicyAction | SubmitPolicyCompleteAction | SubmitPolicyFailedAction


  // New filtering actions
  ;
