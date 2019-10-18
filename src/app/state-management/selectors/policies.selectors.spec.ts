import * as fromSelectors from "./policies.selectors";
import { PolicyState } from "../state/policies.store";
import { PolicyFilters } from "state-management/models";

const policiesFilters: PolicyFilters = {
  sortField: "test desc",
  skip: 0,
  limit: 25
};

const editableFilters: PolicyFilters = {
  sortField: "test desc",
  skip: 0,
  limit: 25
};

const initialPolicyState: PolicyState = {
  policies: [],
  editablePolicies: [],
  selectedPolicies: [],

  totalCount: 0,
  editableCount: 0,

  policiesFilters,

  editableFilters
};

describe("Policies Selectors", () => {
  describe("getPolicies", () => {
    it("should get policies", () => {
      expect(fromSelectors.getPolicies.projector(initialPolicyState)).toEqual(
        []
      );
    });
  });

  describe("getEditablePolicies", () => {
    it("should get editablePolicies", () => {
      expect(
        fromSelectors.getEditablePolicies.projector(initialPolicyState)
      ).toEqual([]);
    });
  });

  describe("getSelectedPolicies", () => {
    it("should get selectedPolicies", () => {
      expect(
        fromSelectors.getSelectedPolicies.projector(initialPolicyState)
      ).toEqual([]);
    });
  });

  describe("getPoliciesCount", () => {
    it("should get totalCount", () => {
      expect(
        fromSelectors.getPoliciesCount.projector(initialPolicyState)
      ).toEqual(0);
    });
  });

  describe("getEditablePoliciesCount", () => {
    it("should get editableCount", () => {
      expect(
        fromSelectors.getEditablePoliciesCount.projector(initialPolicyState)
      ).toEqual(0);
    });
  });

  describe("getFilters", () => {
    it("should get policiesFilters", () => {
      expect(fromSelectors.getFilters.projector(initialPolicyState)).toEqual(
        policiesFilters
      );
    });
  });

  describe("getEditableFilters", () => {
    it("should get editableFilters", () => {
      expect(
        fromSelectors.getEditableFilters.projector(initialPolicyState)
      ).toEqual(editableFilters);
    });
  });

  describe("getPage", () => {
    it("should get page from policiesFilters", () => {
      const { skip, limit } = policiesFilters;
      const page = skip / limit;
      expect(
        fromSelectors.getPage.projector(initialPolicyState.policiesFilters)
      ).toEqual(page);
    });
  });

  describe("getEditablePage", () => {
    it("should get page from editableFilters", () => {
      const { skip, limit } = editableFilters;
      const page = skip / limit;
      expect(
        fromSelectors.getEditablePage.projector(
          initialPolicyState.editableFilters
        )
      ).toEqual(page);
    });
  });

  describe("getPoliciesPerPage", () => {
    it("should get limit from policiesFilters", () => {
      const { limit } = policiesFilters;
      expect(
        fromSelectors.getPoliciesPerPage.projector(
          initialPolicyState.policiesFilters
        )
      ).toEqual(limit);
    });
  });

  describe("getEditablePoliciesPerPage", () => {
    it("should get limit from editableFilters", () => {
      const { limit } = editableFilters;
      expect(
        fromSelectors.getEditablePoliciesPerPage.projector(
          initialPolicyState.editableFilters
        )
      ).toEqual(limit);
    });
  });

  describe("getQueryParams", () => {
    it("should get query params from policiesFilters", () => {
      const { skip, limit, sortField } = policiesFilters;
      const params = { order: sortField, skip, limit };
      expect(
        fromSelectors.getQueryParams.projector(
          initialPolicyState.policiesFilters
        )
      ).toEqual(params);
    });
  });

  describe("getEditableQueryParams", () => {
    it("should get query params from editableFilters", () => {
      const { skip, limit, sortField } = editableFilters;
      const params = { order: sortField, skip, limit };
      expect(
        fromSelectors.getEditableQueryParams.projector(
          initialPolicyState.editableFilters
        )
      ).toEqual(params);
    });
  });
});
