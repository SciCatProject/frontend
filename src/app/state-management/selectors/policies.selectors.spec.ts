
import * as fromPoliciesSelectors from "./policies.selectors";

import { PolicyState} from "../state/policies.store";

const initialPolicyState: PolicyState = {
  policies: [],
  selectedPolicies: [],
  currentPolicy: null,
  policySubmission: null,
  submissionResponse: null,
  totalCount: 0,
  submitComplete: false,

  policiesLoading: true,
  error: undefined,
  filters: {
    skip: 0,
    limit: 30,
    sortField: "ownerGroup:desc"
  }
};

describe("test select", () => {
  it("should get total Count", () => {
    expect(fromPoliciesSelectors.getTotalCount.projector(initialPolicyState)).toEqual(0);
  });
});
