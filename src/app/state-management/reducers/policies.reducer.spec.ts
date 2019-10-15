import * as fromActions from "state-management/actions/policies.actions";
import { policiesReducer } from "./policies.reducer";
import { Policy } from "shared/sdk";
import { PolicyState } from "state-management/state/policies.store";

const initialPolicyState: PolicyState = {
  policies: [],
  editablePolicies: [],
  selectedPolicies: [],

  totalCount: 0,
  editableCount: 0,

  isLoading: false,

  policiesFilters: {
    sortField: "test desc",
    skip: 0,
    limit: 25
  },

  editableFilters: {
    sortField: "test desc",
    skip: 0,
    limit: 25
  }
};

describe("PoliciesReducer", () => {
  describe("on fetchPoliciesAction", () => {
    it("should set isLoading to true", () => {
      const action = fromActions.fetchPoliciesAction();
      const state = policiesReducer(initialPolicyState, action);

      expect(state.isLoading).toBe(true);
    });
  });

  describe("on fetchPoliciesCompleteAction", () => {
    it("should set policies and set isLoading to false", () => {
      const policies = [new Policy()];
      const action = fromActions.fetchPoliciesCompleteAction({ policies });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.isLoading).toBe(false);
      expect(state.policies).toEqual(policies);
    });
  });

  describe("on fetchPoliciesFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchPoliciesFailedAction();
      const state = policiesReducer(initialPolicyState, action);

      expect(state.isLoading).toBe(false);
    });
  });

  describe("on fetchCountAction", () => {
    it("should set isLoading to true", () => {
      const action = fromActions.fetchCountAction();
      const state = policiesReducer(initialPolicyState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on fetchCountCompleteAction", () => {
    it("should set totalCount and set isLoading to false", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.totalCount).toEqual(count);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchCountFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchCountFailedAction();
      const state = policiesReducer(initialPolicyState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchEditablePoliciesAction", () => {
    it("should set isLoading to true", () => {
      const action = fromActions.fetchEditablePoliciesAction();
      const state = policiesReducer(initialPolicyState, action);

      expect(state.isLoading).toBe(true);
    });
  });

  describe("on fetchEditablePoliciesCompleteAction", () => {
    it("should set editablePolicies and set issLoading to false", () => {
      const policies = [new Policy()];
      const action = fromActions.fetchEditablePoliciesCompleteAction({
        policies
      });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.editablePolicies).toEqual(policies);
      expect(state.isLoading).toBe(false);
    });
  });

  describe("on fetchEditablePoliciesFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchEditablePoliciesFailedAction();
      const state = policiesReducer(initialPolicyState, action);

      expect(state.isLoading).toBe(false);
    });
  });

  describe("on fetchEditableCountAction", () => {
    it("should set isLoading to true", () => {
      const action = fromActions.fetchEditableCountAction();
      const state = policiesReducer(initialPolicyState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on fetchEditableCountCompleteAction", () => {
    it("should set editableCount and set isLoading to false", () => {
      const count = 100;
      const action = fromActions.fetchEditableCountCompleteAction({ count });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.editableCount).toEqual(count);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchEditableCountFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchEditableCountFailedAction();
      const state = policiesReducer(initialPolicyState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on submitPolicyAction", () => {
    it("should set isLoading to true", () => {
      const ownerList = ["test"];
      const policy = new Policy();
      const action = fromActions.submitPolicyAction({ ownerList, policy });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on submitPolicyCompleteAction", () => {
    it("should set isLoading to false", () => {
      const policy = new Policy();
      const action = fromActions.submitPolicyCompleteAction({ policy });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on submitPolicyFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.submitPolicyFailedAction();
      const state = policiesReducer(initialPolicyState, action);

      expect(state.isLoading).toEqual(false);
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
        policy: firstPolicy
      });
      const intermediateState = policiesReducer(
        initialPolicyState,
        firstSelectAction
      );
      const secondPolicy = new Policy();
      secondPolicy.id = "2";
      const secondSelectAction = fromActions.selectPolicyAction({
        policy: secondPolicy
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
      const sortField = column + " " + direction;
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
      const sortField = column + " " + direction;
      const action = fromActions.sortEditableByColumnAction({
        column,
        direction
      });
      const state = policiesReducer(initialPolicyState, action);

      expect(state.editableFilters.sortField).toEqual(sortField);
      expect(state.editableFilters.skip).toEqual(0);
    });
  });
});
