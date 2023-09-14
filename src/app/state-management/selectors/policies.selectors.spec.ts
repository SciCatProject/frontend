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
        fromSelectors.selectPolicies.projector(initialPolicyState),
      ).toEqual([]);
    });
  });

  describe("selectEditablePolicies", () => {
    it("should select editablePolicies", () => {
      expect(
        fromSelectors.selectEditablePolicies.projector(initialPolicyState),
      ).toEqual([]);
    });
  });

  describe("selectSelectedPolicies", () => {
    it("should select selectedPolicies", () => {
      expect(
        fromSelectors.selectSelectedPolicies.projector(initialPolicyState),
      ).toEqual([]);
    });
  });

  describe("selectPoliciesCount", () => {
    it("should select totalCount", () => {
      expect(
        fromSelectors.selectPoliciesCount.projector(initialPolicyState),
      ).toEqual(0);
    });
  });

  describe("selectEditablePoliciesCount", () => {
    it("should select editableCount", () => {
      expect(
        fromSelectors.selectEditablePoliciesCount.projector(initialPolicyState),
      ).toEqual(0);
    });
  });

  describe("selectFilters", () => {
    it("should select policiesFilters", () => {
      expect(fromSelectors.selectFilters.projector(initialPolicyState)).toEqual(
        policiesFilters,
      );
    });
  });

  describe("selectEditableFilters", () => {
    it("should select editableFilters", () => {
      expect(
        fromSelectors.selectEditableFilters.projector(initialPolicyState),
      ).toEqual(editableFilters);
    });
  });

  describe("selectPage", () => {
    it("should select page from policiesFilters", () => {
      const { skip, limit } = policiesFilters;
      const page = skip / limit;
      expect(
        fromSelectors.selectPage.projector(initialPolicyState.policiesFilters),
      ).toEqual(page);
    });
  });

  describe("selectEditablePage", () => {
    it("should select page from editableFilters", () => {
      const { skip, limit } = editableFilters;
      const page = skip / limit;
      expect(
        fromSelectors.selectEditablePage.projector(
          initialPolicyState.editableFilters,
        ),
      ).toEqual(page);
    });
  });

  describe("selectPoliciesPerPage", () => {
    it("should select limit from policiesFilters", () => {
      const { limit } = policiesFilters;
      expect(
        fromSelectors.selectPoliciesPerPage.projector(
          initialPolicyState.policiesFilters,
        ),
      ).toEqual(limit);
    });
  });

  describe("selectEditablePoliciesPerPage", () => {
    it("should select limit from editableFilters", () => {
      const { limit } = editableFilters;
      expect(
        fromSelectors.selectEditablePoliciesPerPage.projector(
          initialPolicyState.editableFilters,
        ),
      ).toEqual(limit);
    });
  });

  describe("selectPoliciesPagination", () => {
    it("should select policies pagination state", () => {
      expect(
        fromSelectors.selectPoliciesPagination.projector(
          fromSelectors.selectPoliciesPerPage.projector(
            initialPolicyState.policiesFilters,
          ),
          fromSelectors.selectPage.projector(
            initialPolicyState.policiesFilters,
          ),
          fromSelectors.selectPoliciesCount.projector(initialPolicyState),
        ),
      ).toEqual({ policiesPerPage: 25, currentPage: 0, policyCount: 0 });
    });
  });

  describe("selectEditablePoliciesPagination", () => {
    it("should select editable policies pagination state", () => {
      expect(
        fromSelectors.selectEditablePoliciesPagination.projector(
          fromSelectors.selectEditablePoliciesPerPage.projector(
            initialPolicyState.editableFilters,
          ),
          fromSelectors.selectEditablePage.projector(
            initialPolicyState.editableFilters,
          ),
          fromSelectors.selectEditablePoliciesCount.projector(
            initialPolicyState,
          ),
        ),
      ).toEqual({
        editablePoliciesPerPage: 25,
        currentEditablePage: 0,
        editableCount: 0,
      });
    });
  });

  describe("selectQueryParams", () => {
    it("should select query params from policiesFilters", () => {
      const { skip, limit, sortField } = policiesFilters;
      const params = { order: sortField, skip, limit };
      expect(
        fromSelectors.selectQueryParams.projector(
          initialPolicyState.policiesFilters,
        ),
      ).toEqual(params);
    });
  });

  describe("selectEditableQueryParams", () => {
    it("should select query params from editableFilters", () => {
      const { skip, limit, sortField } = editableFilters;
      const params = { order: sortField, skip, limit };
      expect(
        fromSelectors.selectEditableQueryParams.projector(
          initialPolicyState.editableFilters,
        ),
      ).toEqual(params);
    });
  });

  describe("selectPoliciesDashboardPageViewModel", () => {
    it("should select policies dashboard page view model state", () => {
      expect(
        fromSelectors.selectPoliciesDashboardPageViewModel.projector(
          fromSelectors.selectPolicies.projector(initialPolicyState),
          fromSelectors.selectPoliciesPagination.projector(
            fromSelectors.selectPoliciesPerPage.projector(
              initialPolicyState.policiesFilters,
            ),
            fromSelectors.selectPage.projector(
              initialPolicyState.policiesFilters,
            ),
            fromSelectors.selectPoliciesCount.projector(initialPolicyState),
          ),
          fromSelectors.selectFilters.projector(initialPolicyState),
          initialPolicyState.editablePolicies,
          fromSelectors.selectEditablePoliciesPagination.projector(
            fromSelectors.selectEditablePoliciesPerPage.projector(
              initialPolicyState.editableFilters,
            ),
            fromSelectors.selectEditablePage.projector(
              initialPolicyState.editableFilters,
            ),
            fromSelectors.selectEditablePoliciesCount.projector(
              initialPolicyState,
            ),
          ),
          fromSelectors.selectEditableFilters.projector(initialPolicyState),
          fromSelectors.selectSelectedPolicies.projector(initialPolicyState),
        ),
      ).toEqual({
        policies: [],
        policiesPerPage: 25,
        currentPage: 0,
        policyCount: 0,
        filters: policiesFilters,
        editablePolicies: [],
        editablePoliciesPerPage: 25,
        currentEditablePage: 0,
        editableCount: 0,
        editableFilters,
        selectedPolicies: [],
      });
    });
  });
});
