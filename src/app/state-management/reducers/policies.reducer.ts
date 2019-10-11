import { createReducer, on, Action } from "@ngrx/store";
import {
  initialPolicyState,
  PolicyState
} from "state-management/state/policies.store";
import * as fromActions from "state-management/actions/policies.actions";

const reducer = createReducer(
  initialPolicyState,
  on(fromActions.fetchPoliciesAction, state => ({ ...state, isLoading: true })),
  on(fromActions.fetchPoliciesCompleteAction, (state, { policies }) => ({
    ...state,
    policies,
    isLoading: false
  })),
  on(fromActions.fetchPoliciesFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fromActions.fetchCountCompleteAction, (state, { count }) => ({
    ...state,
    totalCount: count,
    isLoading: false
  })),
  on(fromActions.fetchCountFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fromActions.fetchEditablePoliciesAction, state => ({
    ...state,
    isLoading: true
  })),
  on(fromActions.fetchEditablePoliciesCompleteAction, (state, { policies }) => {
    const editableCount = policies.length;
    return {
      ...state,
      editablePolicies: policies,
      editableCount,
      isLoading: false
    };
  }),
  on(fromActions.fetchEditablePoliciesFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fromActions.submitPolicyAction, state => ({ ...state, isLoading: true })),
  on(fromActions.submitPolicyCompleteAction, state => ({
    ...state,
    isLoading: false
  })),
  on(fromActions.submitPolicyFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fromActions.selectPolicyAction, (state, { policy }) => {
    const alreadySelected = state.selectedPolicies.find(
      existing => existing.id === policy.id
    );
    if (alreadySelected) {
      return state;
    } else {
      const selectedPolicies = state.selectedPolicies.concat(policy);
      return { ...state, selectedPolicies };
    }
  }),
  on(fromActions.deselectPolicyAction, (state, { policy }) => {
    const selectedPolicies = state.selectedPolicies.filter(
      selectedPolicy => selectedPolicy.id !== policy.id
    );
    return { ...state, selectedPolicies };
  }),

  on(fromActions.selectAllPolicies, state => {
    const selectedPolicies = state.editablePolicies;
    return { ...state, selectedPolicies };
  }),
  on(fromActions.clearSelectionAction, state => ({
    ...state,
    selectedPolicies: []
  })),

  on(fromActions.changePageAction, (state, { page, limit }) => {
    const skip = page * limit;
    return { ...state, filters: { ...state.filters, skip, limit } };
  }),

  on(fromActions.sortByColumnAction, (state, { column, direction }) => {
    const sortField = column + (direction ? " " + direction : "");
    return { ...state, filters: { ...state.filters, sortField, skip: 0 } };
  })
);

export function policiesReducer(
  state: PolicyState | undefined,
  action: Action
) {
  if (action.type.indexOf("[Policy]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
}
