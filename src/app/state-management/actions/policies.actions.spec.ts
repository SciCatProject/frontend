import { mockPolicy as policy } from "shared/MockStubs";
import * as fromActions from "./policies.actions";

describe("Policies Actions", () => {
  describe("fetchPoliciesAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchPoliciesAction();
      expect({ ...action }).toEqual({ type: "[Policy] Fetch Policies" });
    });
  });

  describe("fetchPoliciesCompleteAction", () => {
    it("should create an action", () => {
      const policies = [policy];
      const action = fromActions.fetchPoliciesCompleteAction({ policies });
      expect({ ...action }).toEqual({
        type: "[Policy] Fetch Policies Complete",
        policies,
      });
    });
  });

  describe("fetchPoliciesFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchPoliciesFailedAction();
      expect({ ...action }).toEqual({ type: "[Policy] Fetch Policies Failed" });
    });
  });

  describe("fetchCountAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCountAction();
      expect({ ...action }).toEqual({ type: "[Policy] Fetch Count" });
    });
  });

  describe("fetchCountCompleteAction", () => {
    it("should create an action", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      expect({ ...action }).toEqual({
        type: "[Policy] Fetch Count Complete",
        count,
      });
    });
  });

  describe("fetchCountFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCountFailedAction();
      expect({ ...action }).toEqual({ type: "[Policy] Fetch Count Failed" });
    });
  });

  describe("fetchEditablePoliciesAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchEditablePoliciesAction();
      expect({ ...action }).toEqual({
        type: "[Policy] Fetch Editable Policies",
      });
    });
  });

  describe("fetchEditablePoliciesCompleteAction", () => {
    it("should create an action", () => {
      const policies = [policy];
      const action = fromActions.fetchEditablePoliciesCompleteAction({
        policies,
      });
      expect({ ...action }).toEqual({
        type: "[Policy] Fetch Editable Policies Complete",
        policies,
      });
    });
  });

  describe("fetchEditablePoliciesFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchEditablePoliciesFailedAction();
      expect({ ...action }).toEqual({
        type: "[Policy] Fetch Editable Policies Failed",
      });
    });
  });

  describe("fetchEditableCountAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchEditableCountAction();
      expect({ ...action }).toEqual({
        type: "[Policy] Fetch Editable Policies Count",
      });
    });
  });

  describe("fetchEditableCountCompleteAction", () => {
    it("should create an action", () => {
      const count = 100;
      const action = fromActions.fetchEditableCountCompleteAction({ count });
      expect({ ...action }).toEqual({
        type: "[Policy] Fetch Editable Policies Count Complete",
        count,
      });
    });
  });

  describe("fetchEditableCountFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchEditableCountFailedAction();
      expect({ ...action }).toEqual({
        type: "[Policy] Fetch Editable Policies Count Failed",
      });
    });
  });

  describe("submitPolicyAction", () => {
    it("should create an action", () => {
      const ownerList = ["test"];
      const action = fromActions.submitPolicyAction({ ownerList, policy });
      expect({ ...action }).toEqual({
        type: "[Policy] Submit Policy",
        ownerList,
        policy,
      });
    });
  });

  describe("submitPolicyCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.submitPolicyCompleteAction({ policy });
      expect({ ...action }).toEqual({
        type: "[Policy] Submit Policy Complete",
        policy,
      });
    });
  });

  describe("submitPolicyFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.submitPolicyFailedAction();
      expect({ ...action }).toEqual({ type: "[Policy] Submit Policy Failed" });
    });
  });

  describe("selectPolicyAction", () => {
    it("should create an action", () => {
      const action = fromActions.selectPolicyAction({ policy });
      expect({ ...action }).toEqual({
        type: "[Policy] Select Policy",
        policy,
      });
    });
  });

  describe("deselectPolicyAction", () => {
    it("should create an action", () => {
      const action = fromActions.deselectPolicyAction({ policy });
      expect({ ...action }).toEqual({
        type: "[Policy] Deselect Policy",
        policy,
      });
    });
  });

  describe("selectAllPoliciesAction", () => {
    it("should create an action", () => {
      const action = fromActions.selectAllPoliciesAction();
      expect({ ...action }).toEqual({
        type: "[Policy] Select all",
      });
    });
  });

  describe("clearSelectionAction", () => {
    it("should create an action", () => {
      const action = fromActions.clearSelectionAction();
      expect({ ...action }).toEqual({
        type: "[Policy] Clear Selection",
      });
    });
  });

  describe("changePageAction", () => {
    it("should create an action", () => {
      const page = 1;
      const limit = 25;
      const action = fromActions.changePageAction({ page, limit });
      expect({ ...action }).toEqual({
        type: "[Policy] Change Page",
        page,
        limit,
      });
    });
  });

  describe("changeEditablePageAction", () => {
    it("should create an action", () => {
      const page = 1;
      const limit = 25;
      const action = fromActions.changeEditablePageAction({ page, limit });
      expect({ ...action }).toEqual({
        type: "[Policy] Change Editable Page",
        page,
        limit,
      });
    });
  });

  describe("sortByColumnAction", () => {
    it("should create an action", () => {
      const column = "test";
      const direction = "desc";
      const action = fromActions.sortByColumnAction({ column, direction });
      expect({ ...action }).toEqual({
        type: "[Policy] Sort By Column",
        column,
        direction,
      });
    });
  });

  describe("sortEditableByColumnAction", () => {
    it("should create an action", () => {
      const column = "test";
      const direction = "desc";
      const action = fromActions.sortEditableByColumnAction({
        column,
        direction,
      });
      expect({ ...action }).toEqual({
        type: "[Policy] Sort Editable By Column",
        column,
        direction,
      });
    });
  });

  describe("clearPoliciesStateAction", () => {
    it("should create an action", () => {
      const action = fromActions.clearPoliciesStateAction();

      expect({ ...action }).toEqual({ type: "[Policy] Clear State" });
    });
  });
});
