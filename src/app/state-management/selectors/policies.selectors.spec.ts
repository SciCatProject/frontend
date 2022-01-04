import * as fromSelectors from "./policies.selectors";
import { PolicyState } from "../state/policies.store";
import { GenericFilters } from "state-management/models";

const policiesFilters: GenericFilters = {
  sortField: "test desc",
  skip: 0,
  limit: 25,
};

const editableFilters: GenericFilters = {
  sortField: "test desc",
  skip: 0,
  limit: 25,
};

const initialPolicyState: PolicyState = {
  policies: [],
  editablePolicies: [],
  selectedPolicies: [],

  totalCount: 0,
  editableCount: 0,

  policiesFilters,

  editableFilters,
};

describe("Policies Selectors", () => {
  describe("selectPolicies", () => {
    it("should select policies", () => {
      expect(
        fromSelectors.selectPolicies.projector(initialPolicyState)
      ).toEqual([]);
    });
  });

  describe("selectEditablePolicies", () => {
    it("should select editablePolicies", () => {
      expect(
        fromSelectors.selectEditablePolicies.projector(initialPolicyState)
      ).toEqual([]);
    });
  });

  describe("selectSelectedPolicies", () => {
    it("should select selectedPolicies", () => {
      expect(
        fromSelectors.selectSelectedPolicies.projector(initialPolicyState)
      ).toEqual([]);
    });
  });

  describe("selectPoliciesCount", () => {
    it("should select totalCount", () => {
      expect(
        fromSelectors.selectPoliciesCount.projector(initialPolicyState)
      ).toEqual(0);
    });
  });

  describe("selectEditablePoliciesCount", () => {
    it("should select editableCount", () => {
      expect(
        fromSelectors.selectEditablePoliciesCount.projector(initialPolicyState)
      ).toEqual(0);
    });
  });

  describe("selectFilters", () => {
    it("should select policiesFilters", () => {
      expect(fromSelectors.selectFilters.projector(initialPolicyState)).toEqual(
        policiesFilters
      );
    });
  });

  describe("selectEditableFilters", () => {
    it("should select editableFilters", () => {
      expect(
        fromSelectors.selectEditableFilters.projector(initialPolicyState)
      ).toEqual(editableFilters);
    });
  });

  describe("selectPage", () => {
    it("should select page from policiesFilters", () => {
      const { skip, limit } = policiesFilters;
      const page = skip / limit;
      expect(
        fromSelectors.selectPage.projector(initialPolicyState.policiesFilters)
      ).toEqual(page);
    });
  });

  describe("selectEditablePage", () => {
    it("should select page from editableFilters", () => {
      const { skip, limit } = editableFilters;
      const page = skip / limit;
      expect(
        fromSelectors.selectEditablePage.projector(
          initialPolicyState.editableFilters
        )
      ).toEqual(page);
    });
  });

  describe("selectPoliciesPerPage", () => {
    it("should select limit from policiesFilters", () => {
      const { limit } = policiesFilters;
      expect(
        fromSelectors.selectPoliciesPerPage.projector(
          initialPolicyState.policiesFilters
        )
      ).toEqual(limit);
    });
  });

  describe("selectEditablePoliciesPerPage", () => {
    it("should select limit from editableFilters", () => {
      const { limit } = editableFilters;
      expect(
        fromSelectors.selectEditablePoliciesPerPage.projector(
          initialPolicyState.editableFilters
        )
      ).toEqual(limit);
    });
  });

  describe("selectQueryParams", () => {
    it("should select query params from policiesFilters", () => {
      const { skip, limit, sortField } = policiesFilters;
      const params = { order: sortField, skip, limit };
      expect(
        fromSelectors.selectQueryParams.projector(
          initialPolicyState.policiesFilters
        )
      ).toEqual(params);
    });
  });

  describe("selectEditableQueryParams", () => {
    it("should select query params from editableFilters", () => {
      const { skip, limit, sortField } = editableFilters;
      const params = { order: sortField, skip, limit };
      expect(
        fromSelectors.selectEditableQueryParams.projector(
          initialPolicyState.editableFilters
        )
      ).toEqual(params);
    });
  });
});
