import { createSelector, createFeatureSelector } from "@ngrx/store";
import { PolicyState } from "../state/policies.store";

export const getPolicyState = createFeatureSelector<PolicyState>("policies");

// const getPolicyState = createFeatureSelector<PolicyState>('policies');

export const getCurrentPolicy = createSelector(
  getPolicyState,
  state => state.currentPolicy
);

export const getPolicies = createSelector(
  getPolicyState,
  state => state.policies
);

export const getSelectedPolicies = createSelector(
  getPolicyState,
  state => state.selectedPolicies
);

export const isEmptySelection = createSelector(
  getSelectedPolicies,
  sets => sets.length === 0
);

export const getPoliciesPerPage = createSelector(
  getPolicyState,
  state => state
);

export const getPage = createSelector(getPolicyState, state => {
  const { skip, limit } = state.filters;
  return skip / limit;
});

export const getTotalCount = createSelector(
  getPolicyState,
  state => state.totalCount
);

export const getFilters = createSelector(
  getPolicyState,
  state => state.filters
);

/*export const getIsLoading = createSelector(
  getPolicyState,
  state => state.policiesLoading
);*/

export const getQueryParams = createSelector(getFilters, filter => {
  const { skip, limit, sortField } = filter;
  const limits = { skip, limit, order: sortField };
  return {
    limits
  };


});
