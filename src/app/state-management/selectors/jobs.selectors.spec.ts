import * as fromSelectors from "./jobs.selectors";

import { JobsState } from "../state/jobs.store";
import { JobInterface, Job } from "shared/sdk";

const data: JobInterface = {
  id: "testId",
  emailJobInitiator: "test@email.com",
  type: "archive",
  datasetList: {}
};
const job = new Job(data);

const jobFilters = {
  mode: null,
  sortField: "creationTime:desc",
  skip: 0,
  limit: 50
};

const initialJobsState: JobsState = {
  jobs: [],
  currentJob: job,

  totalCount: 0,

  submitError: undefined,

  filters: jobFilters
};

describe("Job Selectors", () => {
  describe("getJobs", () => {
    it("should get jobs", () => {
      expect(fromSelectors.getJobs.projector(initialJobsState)).toEqual([]);
    });
  });

  describe("getCurrentJob", () => {
    it("should get the current job", () => {
      expect(fromSelectors.getCurrentJob.projector(initialJobsState)).toEqual(
        job
      );
    });
  });

  describe("getJobsCount", () => {
    it("should get the total jobs count", () => {
      expect(fromSelectors.getJobsCount.projector(initialJobsState)).toEqual(0);
    });
  });

  describe("getSubmitError", () => {
    it("should get submitError", () => {
      expect(
        fromSelectors.getSubmitError.projector(initialJobsState)
      ).toBeUndefined();
    });
  });

  describe("getFilters", () => {
    it("should get the filters", () => {
      expect(fromSelectors.getFilters.projector(initialJobsState)).toEqual(
        jobFilters
      );
    });
  });

  describe("getJobViewMode", () => {
    it("should get the mode from filters", () => {
      expect(
        fromSelectors.getJobViewMode.projector(initialJobsState.filters)
      ).toEqual(null);
    });
  });

  describe("getPage", () => {
    it("should get the current page from filters", () => {
      const { skip, limit } = jobFilters;
      const page = skip / limit;
      expect(fromSelectors.getPage.projector(initialJobsState.filters)).toEqual(
        page
      );
    });
  });

  describe("getJobsPerPage", () => {
    it("should get the limit from filters", () => {
      const { limit } = jobFilters;
      expect(
        fromSelectors.getJobsPerPage.projector(initialJobsState.filters)
      ).toEqual(limit);
    });
  });

  describe("getQueryParams", () => {
    it("should query params from filters", () => {
      const { mode, sortField, skip, limit } = jobFilters;
      let params;
      if (mode) {
        params = { where: mode, order: sortField, skip, limit };
      } else {
        params = { order: sortField, skip, limit };
      }
      expect(
        fromSelectors.getQueryParams.projector(initialJobsState.filters)
      ).toEqual(params);
    });
  });
});
