import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PolicyState } from "state-management/state/policies.store";

const selectPolicyState = createFeatureSelector<PolicyState>("policies");

export const selectPolicies = createSelector(
  selectPolicyState,
  (state) => state.policies,
);

export const selectEditablePolicies = createSelector(
  selectPolicyState,
  (state) => state.editablePolicies,
);

export const selectSelectedPolicies = createSelector(
  selectPolicyState,
  (state) => state.selectedPolicies,
);

export const selectPoliciesCount = createSelector(
  selectPolicyState,
  (state) => state.totalCount,
);

export const selectEditablePoliciesCount = createSelector(
  selectPolicyState,
  (state) => state.editableCount,
);

export const selectFilters = createSelector(
  selectPolicyState,
  (state) => state.policiesFilters,
);

export const selectEditableFilters = createSelector(
  selectPolicyState,
  (state) => state.editableFilters,
);

export const selectPage = createSelector(selectFilters, (filters) => {
  const { skip, limit } = filters;
  return skip / limit;
});

export const selectEditablePage = createSelector(
  selectEditableFilters,
  (filters) => {
    const { skip, limit } = filters;
    return skip / limit;
  },
);

export const selectPoliciesPerPage = createSelector(
  selectFilters,
  (filters) => filters.limit,
);

export const selectEditablePoliciesPerPage = createSelector(
  selectEditableFilters,
  (filters) => filters.limit,
);

export const selectPoliciesPagination = createSelector(
  selectPoliciesPerPage,
  selectPage,
  selectPoliciesCount,
  (policiesPerPage, currentPage, policyCount) => ({
    policiesPerPage,
    currentPage,
    policyCount,
  }),
);

export const selectEditablePoliciesPagination = createSelector(
  selectEditablePoliciesPerPage,
  selectEditablePage,
  selectEditablePoliciesCount,
  (editablePoliciesPerPage, currentEditablePage, editableCount) => ({
    editablePoliciesPerPage,
    currentEditablePage,
    editableCount,
  }),
);

export const selectQueryParams = createSelector(selectFilters, (filters) => {
  const { skip, limit, sortField } = filters;
  return { order: sortField, skip, limit };
});

export const selectEditableQueryParams = createSelector(
  selectEditableFilters,
  (filters) => {
    const { skip, limit, sortField } = filters;
    return { order: sortField, skip, limit };
  },
);

export const selectPoliciesDashboardPageViewModel = createSelector(
  selectPolicies,
  selectPoliciesPagination,
  selectFilters,
  selectEditablePolicies,
  selectEditablePoliciesPagination,
  selectEditableFilters,
  selectSelectedPolicies,
  (
    policies,
    policiesPagination,
    filters,
    editablePolicies,
    editablePoliciesPagination,
    editableFilters,
    selectedPolicies,
  ) => ({
    policies,
    policiesPerPage: policiesPagination.policiesPerPage,
    currentPage: policiesPagination.currentPage,
    policyCount: policiesPagination.policyCount,
    filters,
    editablePolicies,
    editablePoliciesPerPage: editablePoliciesPagination.editablePoliciesPerPage,
    currentEditablePage: editablePoliciesPagination.currentEditablePage,
    editableCount: editablePoliciesPagination.editableCount,
    editableFilters,
    selectedPolicies,
  }),
);
