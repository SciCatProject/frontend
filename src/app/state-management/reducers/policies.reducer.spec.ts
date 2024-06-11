import * as fromActions from "state-management/actions/policies.actions";
import { policiesReducer } from "./policies.reducer";
import { Policy } from "shared/sdk";
import { initialPolicyState } from "state-management/state/policies.store";

describe("PoliciesReducer", () => {
  describe("on fetchPoliciesCompleteAction", () => {
    it("should set policies", () => {
      const policies = [new Policy()];
      const action = fromActions.fetchPoliciesCompleteAction({ policies });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.policies).toEqual(policies);
    });
  });

  describe("on fetchCountCompleteAction", () => {
    it("should set totalCount", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.totalCount).toEqual(count);
    });
  });

  describe("on fetchEditablePoliciesCompleteAction", () => {
    it("should set editablePolicies", () => {
      const policies = [new Policy()];
      const action = fromActions.fetchEditablePoliciesCompleteAction({
        policies,
      });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.editablePolicies).toEqual(policies);
    });
  });

  describe("on fetchEditableCountCompleteAction", () => {
    it("should set editableCount", () => {
      const count = 100;
      const action = fromActions.fetchEditableCountCompleteAction({ count });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.editableCount).toEqual(count);
    });
  });

  describe("on selectPolicyAction", () => {
    it("should set selectedPolicies", () => {
      const policy = new Policy();
      const action = fromActions.selectPolicyAction({ policy });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.selectedPolicies).toContain(policy);
    });

    it("should return same state if policy already selected", () => {
      const policy = new Policy();
      policy.id = "1";
      initialPolicyState.selectedPolicies = [policy];

      const action = fromActions.selectPolicyAction({ policy });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.selectedPolicies).toEqual([policy]);
    });

    it("should add different policies to selectedPolicies", () => {
      const firstPolicy = new Policy();
      firstPolicy.id = "1";
      const firstSelectAction = fromActions.selectPolicyAction({
        policy: firstPolicy,
      });
      const intermediateState = policiesReducer(
        initialPolicyState,
        firstSelectAction,
      );
      const secondPolicy = new Policy();
      secondPolicy.id = "2";
      const secondSelectAction = fromActions.selectPolicyAction({
        policy: secondPolicy,
      });
      const state = policiesReducer(intermediateState, secondSelectAction);

      expect(state.selectedPolicies).toContain(firstPolicy);
      expect(state.selectedPolicies).toContain(secondPolicy);
    });
  });

  describe("on deselectPolicyAction", () => {
    it("should remove policy from selectedPolicies", () => {
      const policy = new Policy();
      policy.id = "testId";
      initialPolicyState.selectedPolicies = [policy];

      const action = fromActions.deselectPolicyAction({ policy });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.selectedPolicies).toEqual([]);
    });
  });

  describe("on selectAllPoliciesAction", () => {
    it("should add all editable policies to selectedPolicies", () => {
      const policies = [new Policy()];
      initialPolicyState.editablePolicies = policies;
      const action = fromActions.selectAllPoliciesAction();
      const state = policiesReducer(initialPolicyState, action);

      expect(state.selectedPolicies).toEqual(policies);
    });
  });

  describe("on clearSelectionAction", () => {
    it("should set selectedPolicies to an empty array", () => {
      initialPolicyState.selectedPolicies = [new Policy()];

      const action = fromActions.clearSelectionAction();
      const state = policiesReducer(initialPolicyState, action);

      expect(state.selectedPolicies).toEqual([]);
    });
  });

  describe("on changePageAction", () => {
    it("should set skip and limit policies filters", () => {
      const page = 2;
      const limit = 25;
      const skip = page * limit;

      const action = fromActions.changePageAction({ page, limit });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.policiesFilters.limit).toEqual(limit);
      expect(state.policiesFilters.skip).toEqual(skip);
    });
  });

  describe("on changeEditablePageAction", () => {
    it("should set skip and limit editable filters", () => {
      const page = 2;
      const limit = 25;
      const skip = page * limit;

      const action = fromActions.changeEditablePageAction({ page, limit });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.editableFilters.limit).toEqual(limit);
      expect(state.editableFilters.skip).toEqual(skip);
    });
  });

  describe("on sortByColumnAction", () => {
    it("should set sortField policies filter and set skip to 0", () => {
      const column = "test";
      const direction = "desc";
      const sortField = column + ":" + direction;
      const action = fromActions.sortByColumnAction({ column, direction });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.policiesFilters.sortField).toEqual(sortField);
      expect(state.policiesFilters.skip).toEqual(0);
    });
  });

  describe("on sortEditableByColumnAction", () => {
    it("should set sortField editable filter and set skip to 0", () => {
      const column = "test";
      const direction = "desc";
      const sortField = column + ":" + direction;
      const action = fromActions.sortEditableByColumnAction({
        column,
        direction,
      });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.editableFilters.sortField).toEqual(sortField);
      expect(state.editableFilters.skip).toEqual(0);
    });
  });

  describe("on clearPoliciesStateAction", () => {
    it("should set policies state to initialPolicyState", () => {
      const action = fromActions.clearPoliciesStateAction();
      const state = policiesReducer(initialPolicyState, action);

      expect(state).toEqual(initialPolicyState);
    });
  });
});
