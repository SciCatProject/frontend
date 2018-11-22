import * as fromJobSelectors from "./jobs.selectors";

import { JobsState} from "../state/jobs.store";
import * as fromPoliciesSelectors from "./policies.selectors";

const initialJobsState: JobsState = {
  currentJobs: [],
  jobSubmission: undefined,
  filters: {'skip': 0, 'limit': 50},
  totalJobNumber: 1000,
  ui: [],
  loading: false,
  error: undefined
};


describe("test Policies selectors", () => {
  it("should get total Count", () => {
    expect(fromJobSelectors.getLoading.projector(initialJobsState)).toEqual(false);
  });
});
