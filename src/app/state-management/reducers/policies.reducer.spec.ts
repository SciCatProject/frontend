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
      const initialState = initialPolicyState;
      const policy = new Policy();
      const noopAction = new SubmitPolicyAction(["test"], policy);
      const newState = policiesReducer(undefined, noopAction);

      expect(newState).toEqual(initialState);
    });
  });

  describe("SUBMIT_POLICY_COMPLETE", () => {
    it("should set submissionResponse", () => {
      const initialState = initialPolicyState;
      const policy = new Policy();
      const submitPolicyCompleteAction = new SubmitPolicyCompleteAction(policy);
      const newState = policiesReducer(
        initialState,
        submitPolicyCompleteAction
      );

      expect(newState.submissionResponse).toEqual(policy);
    });
  });

  describe("SUBMIT_POLICY_FAILED", () => {
    it("should set policySubmission to null and error", () => {
      const initialState = initialPolicyState;
      const error = new Error();
      const submitPolicyFailedAction = new SubmitPolicyFailedAction(error);
      const newState = policiesReducer(initialState, submitPolicyFailedAction);

      expect(newState.policySubmission).toBeNull();
      expect(newState.error).toEqual(error);
    });
  });

  describe("FETCH_POLICIES", () => {
    it("should set policiesLoading to true", () => {
      const initialState = initialPolicyState;
      const fetchPoliciesAction = new FetchPoliciesAction();
      const newState = policiesReducer(initialState, fetchPoliciesAction);

      expect(newState.policiesLoading).toBe(true);
    });
  });

  describe("FETCH_POLICIES_COMPLETE", () => {
    it("should set policies and set policiesLoading to false", () => {
      const initialState = initialPolicyState;
      const policies = [new Policy()];
      const fetchPoliciesCompleteAction = new FetchPoliciesCompleteAction(
        policies
      );
      const newState = policiesReducer(
        initialState,
        fetchPoliciesCompleteAction
      );

      expect(newState.policiesLoading).toBe(false);
      expect(newState.policies).toEqual(policies);
    });
  });

  describe("FETCH_EDITABLE_POLICIES", () => {
    it("should set policiesLoading to true", () => {
      const initialState = initialPolicyState;
      const fetchEditablePoliciesAction = new FetchEditablePolicies();
      const newState = policiesReducer(
        initialState,
        fetchEditablePoliciesAction
      );

      expect(newState.policiesLoading).toBe(true);
    });
  });

  describe("FETCH_EDITABLE_POLICIES_COMPLETE", () => {
    it("should set editablePolicies and set policiesLoading to false", () => {
      const initialState = initialPolicyState;
      const policies = [new Policy()];
      const fetchEditablePoliciesCompleteAction = new FetchEditablePoliciesComplete(
        policies
      );
      const newState = policiesReducer(
        initialState,
        fetchEditablePoliciesCompleteAction
      );

      expect(newState.policiesLoading).toBe(false);
      expect(newState.editablePolicies).toEqual(policies);
    });
  });

  describe("FETCH_POLICIES_FAILED", () => {
    it("should set policiesLoading to false", () => {
      const initialState = initialPolicyState;
      const fetchPoliciesFailedAction = new FetchPoliciesFailedAction();
      const newState = policiesReducer(initialState, fetchPoliciesFailedAction);

      expect(newState.policiesLoading).toBe(false);
    });
  });

  describe("SELECT_POLICY", () => {
    it("should set selectedPolicies", () => {
      const initialState = initialPolicyState;
      const policy = new Policy();
      const selectPolicyAction = new SelectPolicyAction(policy);
      const newState = policiesReducer(initialState, selectPolicyAction);

      expect(newState.selectedPolicies).toEqual([policy]);
    });
  });

  describe("DESELECT_POLICY", () => {
    it("should remove policy from selectedPolicies", () => {
      const initialState = initialPolicyState;
      const policy = new Policy();
      const selectPolicyAction = new SelectPolicyAction(policy);
      const intermediateState = policiesReducer(
        initialState,
        selectPolicyAction
      );
      const deselectPolicyAction = new DeselectPolicyAction(policy);
      const newState = policiesReducer(intermediateState, deselectPolicyAction);

      expect(intermediateState.selectedPolicies).toEqual([policy]);
      expect(newState.selectedPolicies).toEqual(initialState.selectedPolicies);
    });
  });

  describe("CLEAR_SELECTION", () => {
    it("should set selectedPolicies to an empty array", () => {
      const initialState = initialPolicyState;
      const clearSelectionAction = new ClearSelectionAction();
      const newState = policiesReducer(initialState, clearSelectionAction);

      expect(newState.selectedPolicies).toEqual([]);
    });
  });

  describe("CHANGE_PAGE", () => {
    it("should set filters and set policiesLoading to true", () => {
      const initialState = initialPolicyState;
      const page = 2;
      const limit = 25;
      const changePageAction = new ChangePageAction(page, limit);
      const newState = policiesReducer(initialState, changePageAction);

      expect(newState.policiesLoading).toBe(true);
      expect(newState.filters.limit).toEqual(limit);
      expect(newState.filters.skip).toEqual(page * limit);
    });
  });

  describe("SORT_BY_COLUMN", () => {
    it("should set filters and set policiesLoading to true", () => {
      const initialState = initialPolicyState;
      const column = "manager";
      const direction = "desc";
      const sortByColumnsAction = new SortByColumnAction(column, direction);
      const newState = policiesReducer(initialState, sortByColumnsAction);

      expect(newState.policiesLoading).toBe(true);
      expect(newState.filters.sortField).toEqual(column + " " + direction);
      expect(newState.filters.skip).toEqual(0);
    });
  });

  describe("FETCH_COUNT_POLICIES", () => {
    it("should set totalCount", () => {
      const initialState = initialPolicyState;
      const count = 50;
      const fetchCountPolicies = new FetchCountPolicies(count);
      const newState = policiesReducer(initialState, fetchCountPolicies);

      expect(newState.totalCount).toEqual(count);
    });
  });
});
