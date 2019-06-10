import {
  CHANGE_PAGE,
  ChangePageAction,
  CLEAR_SELECTION,
  DESELECT_POLICY,
  DeselectPolicyAction,
  FETCH_POLICIES,
  FETCH_POLICIES_COMPLETE,
  FETCH_POLICIES_FAILED,
  FetchPoliciesCompleteAction,
  PoliciesActions,
  SELECT_POLICY,
  SelectPolicyAction,
  SORT_BY_COLUMN,
  SortByColumnAction,
  SUBMIT_POLICY_COMPLETE,
  SUBMIT_POLICY_FAILED,
  SubmitPolicyCompleteAction,
  SubmitPolicyFailedAction,
  FETCH_COUNT_POLICIES,
  FetchEditablePolicies,
  FETCH_EDITABLE_POLICIES_COMPLETE,
  FETCH_EDITABLE_POLICIES,
  FetchEditablePoliciesComplete
} from "state-management/actions/policies.actions";

import {
  initialPolicyState,
  PolicyState
} from "state-management/state/policies.store";

export function policiesReducer(
  state: PolicyState = initialPolicyState,
  action: PoliciesActions
): PolicyState {
  if (action.type.indexOf("[Policy]") !== -1) {
    console.log("Action came in! " + action.type);
  }

  switch (action.type) {
    case SUBMIT_POLICY_COMPLETE: {
      const submissionResponse = (action as SubmitPolicyCompleteAction)
        .submissionResponse;
      return { ...state, submissionResponse };
    }

    case SUBMIT_POLICY_FAILED: {
      const error = (action as SubmitPolicyFailedAction).error;
      return { ...state, error, policySubmission: null };
    }

    case FETCH_POLICIES: {
      return { ...state, policiesLoading: true };
    }

    case FETCH_POLICIES_COMPLETE: {
      const policies = (action as FetchPoliciesCompleteAction).policies;
      return { ...state, policies, policiesLoading: false };
    }

    case FETCH_EDITABLE_POLICIES: {
      return { ...state, policiesLoading: true };
    }

    case FETCH_EDITABLE_POLICIES_COMPLETE: {
      const editablePolicies = (action as FetchEditablePoliciesComplete).editablePolicies;
      return { ...state, editablePolicies, policiesLoading: false  };
    }

    case FETCH_POLICIES_FAILED: {
      return { ...state, policiesLoading: false };
    }

    case SELECT_POLICY: {
      const policy = (action as SelectPolicyAction).policy;
      const alreadySelected = state.selectedPolicies.find(
        existing => policy.id === existing.id
      );
      if (alreadySelected) {
        return state;
      } else {
        const selectedPolicies = state.selectedPolicies.concat(policy);
        return { ...state, selectedPolicies };
      }
    }

    case DESELECT_POLICY: {
      const policy = (action as DeselectPolicyAction).policy;
      const selectedPolicies = state.selectedPolicies.filter(
        selectedPolicy => selectedPolicy.id !== policy.id
      );
      return { ...state, selectedPolicies };
    }

    case CLEAR_SELECTION: {
      return { ...state, selectedPolicies: [] };
    }

    case CHANGE_PAGE: {
      const { page, limit } = action as ChangePageAction;
      const skip = page * limit;
       const filters = {...state.filters, skip, limit};
      return {
        ...state,
        policiesLoading: true,
        filters
      };
    }

    case SORT_BY_COLUMN: {
      const { column, direction } = action as SortByColumnAction;
      const sortField = column + (direction ? ":" + direction : "");
      const filters = { ...state.filters, sortField, skip: 0 };
      return { ...state, filters, policiesLoading: true };
    }

    case FETCH_COUNT_POLICIES: {
      const count = action.count;
      return {...state, totalCount: count};
    }

    default: {
      return state;
    }
  }
}
