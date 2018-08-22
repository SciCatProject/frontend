import { Action } from '@ngrx/store';
import {
  SELECT_CURRENT,
  SELECT_POLICY,
  SelectPolicyAction,
  DeselectPolicyAction,
  DESELECT_POLICY,
  CLEAR_SELECTION,

  FETCH_POLICIES_COMPLETE,
  FETCH_POLICIES,
  FetchPoliciesCompleteAction,
  FETCH_POLICIES_FAILED,
  PoliciesActions,

  SUBMIT_POLICY, SubmitPolicyAction,
  SUBMIT_POLICY_COMPLETE, SubmitPolicyCompleteAction,
  SUBMIT_POLICY_FAILED, SubmitPolicyFailedAction,
} from 'state-management/actions/policies.actions';

import { PolicyState, initialPolicyState } from 'state-management/state/policies.store';

export function policiesReducer(
  state: PolicyState = initialPolicyState,
  action: PoliciesActions
): PolicyState {
  if (action.type.indexOf('[Policy]') !== -1) {
    console.log('Action came in! ' + action.type);
  }

  switch (action.type) {

    case SUBMIT_POLICY_COMPLETE: {
      const submissionResponse = (action as SubmitPolicyCompleteAction).submissionResponse;
      return { ...state, submissionResponse};
    }

    case SUBMIT_POLICY_FAILED: {
      const error = (action as SubmitPolicyFailedAction).error;
      return { ...state, error, policySubmission : null };
    }

    case FETCH_POLICIES: {
      return { ...state, policiesLoading: true };
    }

    case FETCH_POLICIES_COMPLETE: {
      const policies = (action as FetchPoliciesCompleteAction).policies;
      return { ...state, policies, policiesLoading: false };
    }


    case FETCH_POLICIES_FAILED: {
      return { ...state, policiesLoading: false };
    }

    case SELECT_POLICY: {
      const policy = (action as SelectPolicyAction).policy;
      const alreadySelected = state.selectedPolicies.find(existing => policy.id === existing.id);
      if (alreadySelected) {
        return state;
      } else {
        const selectedPolicies = state.selectedPolicies.concat(policy);
        return { ...state, selectedPolicies };
      }
    }

    case DESELECT_POLICY: {
      const policy = (action as DeselectPolicyAction).policy;
      const selectedPolicies = state.selectedPolicies.filter(selectedPolicy => selectedPolicy.id !== policy.id);
      return { ...state, selectedPolicies };
    }

    case CLEAR_SELECTION: {
      return { ...state, selectedPolicies: [] };
    }

    default: {
      return state;
    }
  }
}
