import {
  SubmitPolicyAction,
  SubmitPolicyCompleteAction,
  SubmitPolicyFailedAction,
  FetchPoliciesAction,
  FetchPoliciesCompleteAction,
  FetchEditablePolicies,
  FetchEditablePoliciesComplete,
  FetchPoliciesFailedAction,
  SelectPolicyAction,
  DeselectPolicyAction,
  ClearSelectionAction,
  ChangePageAction,
  SortByColumnAction,
  FetchCountPolicies
} from "state-management/actions/policies.actions";
import { policiesReducer } from "./policies.reducer";
import { Policy } from "shared/sdk";
import { initialPolicyState } from "state-management/state/policies.store";

describe("PoliciesReducer", () => {
  describe("default", () => {
    it("should return the initial state", () => {
      const policy = new Policy();
      const noopAction = new SubmitPolicyAction(["test"], policy);
      const state = policiesReducer(undefined, noopAction);

      expect(state).toEqual(initialPolicyState);
    });
  });

  describe("SUBMIT_POLICY_COMPLETE", () => {
    it("should set submissionResponse", () => {
      const policy = new Policy();
      const action = new SubmitPolicyCompleteAction(policy);
      const state = policiesReducer(initialPolicyState, action);

      expect(state.submissionResponse).toEqual(policy);
    });
  });

  describe("SUBMIT_POLICY_FAILED", () => {
    it("should set policySubmission to null and error", () => {
      const error = new Error();
      const action = new SubmitPolicyFailedAction(error);
      const state = policiesReducer(initialPolicyState, action);

      expect(state.policySubmission).toBeNull();
      expect(state.error).toEqual(error);
    });
  });

  describe("FETCH_POLICIES", () => {
    it("should set policiesLoading to true", () => {
      const action = new FetchPoliciesAction();
      const state = policiesReducer(initialPolicyState, action);

      expect(state.policiesLoading).toBe(true);
    });
  });

  describe("FETCH_POLICIES_COMPLETE", () => {
    it("should set policies and set policiesLoading to false", () => {
      const policies = [new Policy()];
      const action = new FetchPoliciesCompleteAction(policies);
      const state = policiesReducer(initialPolicyState, action);

      expect(state.policiesLoading).toBe(false);
      expect(state.policies).toEqual(policies);
    });
  });

  describe("FETCH_EDITABLE_POLICIES", () => {
    it("should set policiesLoading to true", () => {
      const action = new FetchEditablePolicies();
      const state = policiesReducer(initialPolicyState, action);

      expect(state.policiesLoading).toBe(true);
    });
  });

  describe("FETCH_EDITABLE_POLICIES_COMPLETE", () => {
    it("should set editablePolicies and set policiesLoading to false", () => {
      const policies = [new Policy()];
      const action = new FetchEditablePoliciesComplete(policies);
      const state = policiesReducer(initialPolicyState, action);

      expect(state.policiesLoading).toBe(false);
      expect(state.editablePolicies).toEqual(policies);
    });
  });

  describe("FETCH_POLICIES_FAILED", () => {
    it("should set policiesLoading to false", () => {
      const action = new FetchPoliciesFailedAction();
      const state = policiesReducer(initialPolicyState, action);

      expect(state.policiesLoading).toBe(false);
    });
  });

  describe("SELECT_POLICY", () => {
    it("should set selectedPolicies", () => {
      const policy = new Policy();
      const action = new SelectPolicyAction(policy);
      const state = policiesReducer(initialPolicyState, action);

      expect(state.selectedPolicies).toContain(policy);
    });

    it("should return same state if policy already selected", () => {
      const policy = new Policy();
      policy.id = "1";
      const action = new SelectPolicyAction(policy);
      const intermediateState = policiesReducer(initialPolicyState, action);
      const redoAction = new SelectPolicyAction(policy);
      const state = policiesReducer(intermediateState, redoAction);

      expect(state.selectedPolicies).toEqual([policy]);
    });

    it("should add different policies to selectedPolicies", () => {
      const firstPolicy = new Policy();
      firstPolicy.id = "1";
      const firstSelectAction = new SelectPolicyAction(firstPolicy);
      const intermediateState = policiesReducer(
        initialPolicyState,
        firstSelectAction
      );
      const secondPolicy = new Policy();
      secondPolicy.id = "2";
      const secondSelectAction = new SelectPolicyAction(secondPolicy);
      const state = policiesReducer(intermediateState, secondSelectAction);

      expect(state.selectedPolicies).toContain(firstPolicy);
      expect(state.selectedPolicies).toContain(secondPolicy);
    });
  });

  describe("DESELECT_POLICY", () => {
    it("should remove policy from selectedPolicies", () => {
      const policy = new Policy();
      const selectAction = new SelectPolicyAction(policy);
      const intermediateState = policiesReducer(
        initialPolicyState,
        selectAction
      );
      const deselectAction = new DeselectPolicyAction(policy);
      const state = policiesReducer(intermediateState, deselectAction);

      expect(intermediateState.selectedPolicies).toEqual([policy]);
      expect(state.selectedPolicies).toEqual(
        initialPolicyState.selectedPolicies
      );
    });
  });

  describe("CLEAR_SELECTION", () => {
    it("should set selectedPolicies to an empty array", () => {
      const action = new ClearSelectionAction();
      const state = policiesReducer(initialPolicyState, action);

      expect(state.selectedPolicies).toEqual([]);
    });
  });

  describe("CHANGE_PAGE", () => {
    it("should set filters and set policiesLoading to true", () => {
      const page = 2;
      const limit = 25;
      const action = new ChangePageAction(page, limit);
      const state = policiesReducer(initialPolicyState, action);

      expect(state.policiesLoading).toBe(true);
      expect(state.filters.limit).toEqual(limit);
      expect(state.filters.skip).toEqual(page * limit);
    });
  });

  describe("SORT_BY_COLUMN", () => {
    it("should set filters and set policiesLoading to true", () => {
      const column = "manager";
      const direction = "desc";
      const action = new SortByColumnAction(column, direction);
      const state = policiesReducer(initialPolicyState, action);

      expect(state.policiesLoading).toBe(true);
      expect(state.filters.sortField).toEqual(column + " " + direction);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("FETCH_COUNT_POLICIES", () => {
    it("should set totalCount", () => {
      const count = 50;
      const action = new FetchCountPolicies(count);
      const state = policiesReducer(initialPolicyState, action);

      expect(state.totalCount).toEqual(count);
    });
  });
});
