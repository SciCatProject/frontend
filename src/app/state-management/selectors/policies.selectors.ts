import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PolicyState } from "state-management/state/policies.store";

const getPolicyState = createFeatureSelector<PolicyState>("policies");

export const getPolicies = createSelector(
  getPolicyState,
  state => state.policies
);

export const getEditablePolicies = createSelector(
  getPolicyState,
  state => state.editablePolicies
);

export const getSelectedPolicies = createSelector(
  getPolicyState,
  state => state.selectedPolicies
);

export const getPoliciesCount = createSelector(
  getPolicyState,
  state => state.totalCount
);

export const getEditablePoliciesCount = createSelector(
  getPolicyState,
  state => state.editableCount
);

export const getFilters = createSelector(
  getPolicyState,
  state => state.policiesFilters
);

export const getEditableFilters = createSelector(
  getPolicyState,
  state => state.editableFilters
);

export const getPage = createSelector(
  getFilters,
  filters => {
    const { skip, limit } = filters;
    return skip / limit;
  }
);

export const getEditablePage = createSelector(
  getEditableFilters,
  filters => {
    const { skip, limit } = filters;
    return skip / limit;
  }
);

export const getPoliciesPerPage = createSelector(
  getFilters,
  filters => filters.limit
);

export const getEditablePoliciesPerPage = createSelector(
  getEditableFilters,
  filters => filters.limit
);

export const getQueryParams = createSelector(
  getFilters,
  filters => {
    const { skip, limit, sortField } = filters;
    return { order: sortField, skip, limit };
  }
);

export const getEditableQueryParams = createSelector(
  getEditableFilters,
  filters => {
    const { skip, limit, sortField } = filters;
    return { order: sortField, skip, limit };
  }
);
