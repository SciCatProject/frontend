import { PolicyFilters, Policy } from "state-management/models";

export interface PolicyState {
  policies: Policy[];
  editablePolicies: Policy[];
  selectedPolicies: Policy[];

  totalCount: number;
  editableCount: number;

  policiesFilters: PolicyFilters;
  editableFilters: PolicyFilters;
}

export const initialPolicyState: PolicyState = {
  policies: [],
  editablePolicies: [],
  selectedPolicies: [],

  totalCount: 0,
  editableCount: 0,

  policiesFilters: {
    skip: 0,
    limit: 25,
    sortField: "ownerGroup:desc"
  },

  editableFilters: {
    skip: 0,
    limit: 25,
    sortField: "ownerGroup:desc"
  }
};
