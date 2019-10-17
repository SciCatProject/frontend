import { jobsReducer } from "./jobs.reducer";
import { JobInterface, Job } from "shared/sdk";
import { JobsState } from "state-management/state/jobs.store";
import * as fromActions from "../actions/jobs.actions";

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

  isLoading: false,
  submitError: undefined,

  filters: jobFilters
};

describe("jobsReducer", () => {
  describe("on fetchJobsAction", () => {
    it("should set isLoading to true", () => {
      const action = fromActions.fetchJobsAction();
      const state = jobsReducer(initialJobsState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on fetchJobsCompleteAction", () => {
    it("should set jobs and set isLoading to false", () => {
      const jobs = [job];
      const action = fromActions.fetchJobsCompleteAction({ jobs });
      const state = jobsReducer(initialJobsState, action);

      expect(state.jobs).toEqual(jobs);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchJobsFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchJobsFailedAction();
      const state = jobsReducer(initialJobsState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchCountAction", () => {
    it("should set isLoading to true", () => {
      const action = fromActions.fetchCountAction();
      const state = jobsReducer(initialJobsState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on fetchCountCompleteAction", () => {
    it("should set totalCount and set isLoading to false", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      const state = jobsReducer(initialJobsState, action);

      expect(state.totalCount).toEqual(count);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchCountFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchCountFailedAction();
      const state = jobsReducer(initialJobsState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchJobAction", () => {
    it("should set isLoading to true", () => {
      const jobId = job.id;
      const action = fromActions.fetchJobAction({ jobId });
      const state = jobsReducer(initialJobsState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on fetchJobCompleteAction", () => {
    it("should set currentJob and set isLoading to false", () => {
      const action = fromActions.fetchJobCompleteAction({ job });
      const state = jobsReducer(initialJobsState, action);

      expect(state.currentJob).toEqual(job);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchJobFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchJobFailedAction();
      const state = jobsReducer(initialJobsState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on submitJobAction", () => {
    it("should set isLoading to true", () => {
      const action = fromActions.submitJobAction({ job });
      const state = jobsReducer(initialJobsState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on submitJobCompleteAction", () => {
    it("should set submitError to undefined and set isLoading to false", () => {
      const action = fromActions.submitJobCompleteAction({ job });
      const state = jobsReducer(initialJobsState, action);

      expect(state.submitError).toBeUndefined();
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on submitJobFailedAction", () => {
    it("should set submitError and set isLoading to false", () => {
      const err = new Error();
      const action = fromActions.submitJobFailedAction({ err });
      const state = jobsReducer(initialJobsState, action);

      expect(state.submitError).toEqual(err);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on setJobViewModeAction", () => {
    it("should set mode filter and set skip filter to 0", () => {
      const mode = null;
      const action = fromActions.setJobViewModeAction({ mode });
      const state = jobsReducer(initialJobsState, action);

      expect(state.filters.mode).toEqual(mode);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on changePageAction", () => {
    it("should set skip and limit filters", () => {
      const page = 1;
      const limit = 25;
      const skip = page * limit;
      const action = fromActions.changePageAction({ page, limit });
      const state = jobsReducer(initialJobsState, action);

      expect(state.filters.skip).toEqual(skip);
      expect(state.filters.limit).toEqual(limit);
    });
  });

  describe("on sortByColumnAction", () => {
    it("should set sortField filter and set skip filter to 0", () => {
      const column = "test";
      const direction = "asc";
      const sortField = column + ":" + direction;
      const action = fromActions.sortByColumnAction({ column, direction });
      const state = jobsReducer(initialJobsState, action);

      expect(state.filters.sortField).toEqual(sortField);
      expect(state.filters.skip).toEqual(0);
    });
  });
});
