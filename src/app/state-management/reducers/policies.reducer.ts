import { createReducer, on, Action } from "@ngrx/store";
import {
  initialPolicyState,
  PolicyState,
} from "state-management/state/policies.store";
import * as fromActions from "state-management/actions/policies.actions";

const reducer = createReducer(
  initialPolicyState,
  on(
    fromActions.fetchPoliciesCompleteAction,
    (state, { policies }): PolicyState => ({
      ...state,
      policies,
    }),
  ),

  on(
    fromActions.fetchCountCompleteAction,
    (state, { count }): PolicyState => ({
      ...state,
      totalCount: count,
    }),
  ),

  on(
    fromActions.fetchEditablePoliciesCompleteAction,
    (state, { policies }): PolicyState => ({
      ...state,
      editablePolicies: policies,
    }),
  ),

  on(
    fromActions.fetchEditableCountCompleteAction,
    (state, { count }): PolicyState => ({
      ...state,
      editableCount: count,
    }),
  ),

  on(fromActions.selectPolicyAction, (state, { policy }): PolicyState => {
    const alreadySelected = state.selectedPolicies.find(
      (existing) => existing._id === policy._id,
    );
    if (alreadySelected) {
      return state;
    } else {
      const selectedPolicies = state.selectedPolicies.concat(policy);
      return { ...state, selectedPolicies };
    }
  }),
  on(fromActions.deselectPolicyAction, (state, { policy }): PolicyState => {
    const selectedPolicies = state.selectedPolicies.filter(
      (selectedPolicy) => selectedPolicy._id !== policy._id,
    );
    return { ...state, selectedPolicies };
  }),

  on(fromActions.selectAllPoliciesAction, (state): PolicyState => {
    const selectedPolicies = state.editablePolicies;
    return { ...state, selectedPolicies };
  }),
  on(
    fromActions.clearSelectionAction,
    (state): PolicyState => ({
      ...state,
      selectedPolicies: [],
    }),
  ),

  on(fromActions.changePageAction, (state, { page, limit }): PolicyState => {
    const skip = page * limit;
    const policiesFilters = { ...state.policiesFilters, skip, limit };
    return { ...state, policiesFilters };
  }),
  on(
    fromActions.changeEditablePageAction,
    (state, { page, limit }): PolicyState => {
      const skip = page * limit;
      const editableFilters = { ...state.editableFilters, skip, limit };
      return { ...state, editableFilters };
    },
  ),

  on(
    fromActions.sortByColumnAction,
    (state, { column, direction }): PolicyState => {
      const sortField = column + (direction ? ":" + direction : "");
      const policiesFilters = { ...state.policiesFilters, sortField, skip: 0 };
      return { ...state, policiesFilters };
    },
  ),
  on(
    fromActions.sortEditableByColumnAction,
    (state, { column, direction }): PolicyState => {
      const sortField = column + (direction ? ":" + direction : "");
      const editableFilters = { ...state.editableFilters, sortField, skip: 0 };
      return { ...state, editableFilters };
    },
  ),

  on(
    fromActions.clearPoliciesStateAction,
    (): PolicyState => ({ ...initialPolicyState }),
  ),
);

export const policiesReducer = (
  state: PolicyState | undefined,
  action: Action,
) => {
  if (action.type.indexOf("[Policy]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
};
