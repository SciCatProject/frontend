import { jobsReducer } from "./jobs.reducer";
import * as fromActions from "../actions/jobs.actions";
import { initialJobsState } from "state-management/state/jobs.store";
import { createMock } from "shared/MockStubs";

// TODO: job release back-ward compatibility issue
const job = createMock<any>({
  _id: "testId",
  id: "testId",
  emailJobInitiator: "test@email.com",
  type: "archive",
  datasetList: [],
  creationTime: "",
  executionTime: "",
  jobParams: {},
  jobResultObject: {},
  jobStatusMessage: "",
  ownerGroup: "",
});

describe("jobsReducer", () => {
  describe("on fetchJobsCompleteAction", () => {
    it("should set jobs", () => {
      const jobs = [job];
      const action = fromActions.fetchJobsCompleteAction({ jobs });
      const state = jobsReducer(initialJobsState, action);

      expect(state.jobs).toEqual(jobs);
    });
  });

  describe("on fetchCountCompleteAction", () => {
    it("should set totalCount", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      const state = jobsReducer(initialJobsState, action);

      expect(state.totalCount).toEqual(count);
    });
  });

  describe("on fetchJobCompleteAction", () => {
    it("should set currentJob", () => {
      const action = fromActions.fetchJobCompleteAction({ job });
      const state = jobsReducer(initialJobsState, action);

      expect(state.currentJob).toEqual(job);
    });
  });

  describe("on submitJobCompleteAction", () => {
    it("should set submitError to undefined", () => {
      const action = fromActions.submitJobCompleteAction({ job });
      const state = jobsReducer(initialJobsState, action);

      expect(state.submitError).toBeUndefined();
    });
  });

  describe("on submitJobFailedAction", () => {
    it("should set submitError", () => {
      const err = new Error();
      const action = fromActions.submitJobFailedAction({ err });
      const state = jobsReducer(initialJobsState, action);

      expect(state.submitError).toEqual(err);
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

  describe("on setJobsLimitFilterAction", () => {
    it("should set limit filter and set skip to 0", () => {
      const limit = 10;
      const action = fromActions.setJobsLimitFilterAction({ limit });
      const state = jobsReducer(initialJobsState, action);

      expect(state.filters.limit).toEqual(limit);
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

  describe("on clearJobsStateAction", () => {
    it("should set job state to initialJobsState", () => {
      const action = fromActions.clearJobsStateAction();
      const state = jobsReducer(initialJobsState, action);

      expect(state).toEqual(initialJobsState);
    });
  });
});
