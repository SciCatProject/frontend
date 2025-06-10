import * as fromSelectors from "./jobs.selectors";
import { OutputJobV3Dto } from "@scicatproject/scicat-sdk-ts-angular";
import { JobsState } from "../state/jobs.store";
import { createMock } from "shared/MockStubs";

const job = createMock<OutputJobV3Dto>({
  id: "",
  emailJobInitiator: "test@email.com",
  type: "archive",
  creationTime: "",
  executionTime: "",
  jobParams: {},
  jobStatusMessage: "",
  datasetList: [],
  jobResultObject: {},
});

const jobFilters = {
  mode: null,
  sortField: "creationTime:desc",
  skip: 0,
  limit: 50,
};

const initialJobsState: JobsState = {
  jobs: [],
  currentJob: job,

  totalCount: 0,

  submitError: undefined,

  filters: jobFilters,
};

describe("Job Selectors", () => {
  describe("selectJobs", () => {
    it("should select jobs", () => {
      expect(fromSelectors.selectJobs.projector(initialJobsState)).toEqual([]);
    });
  });

  describe("selectCurrentJob", () => {
    it("should select the current job", () => {
      expect(
        fromSelectors.selectCurrentJob.projector(initialJobsState),
      ).toEqual(job);
    });
  });

  describe("selectJobsCount", () => {
    it("should select the total jobs count", () => {
      expect(fromSelectors.selectJobsCount.projector(initialJobsState)).toEqual(
        0,
      );
    });
  });

  describe("selectSubmitError", () => {
    it("should select submitError", () => {
      expect(
        fromSelectors.selectSubmitError.projector(initialJobsState),
      ).toBeUndefined();
    });
  });

  describe("selectFilters", () => {
    it("should select the filters", () => {
      expect(fromSelectors.selectFilters.projector(initialJobsState)).toEqual(
        jobFilters,
      );
    });
  });

  describe("selectJobViewMode", () => {
    it("should select the mode from filters", () => {
      expect(
        fromSelectors.selectJobViewMode.projector(initialJobsState.filters),
      ).toEqual(null);
    });
  });

  describe("selectPage", () => {
    it("should select the current page from filters", () => {
      const { skip, limit } = jobFilters;
      const page = skip / limit;
      expect(
        fromSelectors.selectPage.projector(initialJobsState.filters),
      ).toEqual(page);
    });
  });

  describe("selectJobsPerPage", () => {
    it("should select the limit from filters", () => {
      const { limit } = jobFilters;
      expect(
        fromSelectors.selectJobsPerPage.projector(initialJobsState.filters),
      ).toEqual(limit);
    });
  });

  describe("selectQueryParams", () => {
    it("should query params from filters", () => {
      const { mode, sortField, skip, limit } = jobFilters;
      let params;
      if (mode) {
        params = { where: mode, order: sortField, skip, limit };
      } else {
        params = { order: sortField, skip, limit };
      }
      expect(
        fromSelectors.selectQueryParams.projector(initialJobsState.filters),
      ).toEqual(params);
    });
  });
});
