import * as fromJobSelectors from "./jobs.selectors";

import { JobsState } from "../state/jobs.store";

const initialJobsState: JobsState = {
  currentJobs: [],
  jobSubmission: undefined,
  filters: { skip: 0, limit: 50 },
  totalJobNumber: 1000,
  ui: [],
  loading: false,
  error: undefined
};

describe("test Jobs selectors", () => {
  it("should get Loading", () => {
    expect(fromJobSelectors.getLoading.projector(initialJobsState)).toEqual(
      false
    );
  });


  it("should get filters", () => {
    expect(fromJobSelectors.getFilters.projector(initialJobsState)).toEqual(
      { skip: 0, limit: 50 }
    );
  });
});
