import { CreateJobDto } from "@scicatproject/scicat-sdk-ts-angular";
import * as fromActions from "./jobs.actions";
import { mockJob as job } from "shared/MockStubs";

describe("Job Actions", () => {
  const jobs = [job];

  describe("fetchJobsAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchJobsAction();
      expect({ ...action }).toEqual({ type: "[Job] Fetch Jobs" });
    });
  });

  describe("fetchJobsCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchJobsCompleteAction({ jobs });
      expect({ ...action }).toEqual({
        type: "[Job] Fetch Jobs Complete",
        jobs,
      });
    });
  });

  describe("fetchJobsFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchJobsFailedAction();
      expect({ ...action }).toEqual({ type: "[Job] Fetch Jobs Failed" });
    });
  });

  describe("fetchCountCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCountAction();
      expect({ ...action }).toEqual({ type: "[Job] Fetch Count" });
    });
  });

  describe("fetchCountCompleteAction", () => {
    it("should create an action", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      expect({ ...action }).toEqual({
        type: "[Job] Fetch Count Complete",
        count,
      });
    });
  });

  describe("fetchCountFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCountFailedAction();
      expect({ ...action }).toEqual({ type: "[Job] Fetch Count Failed" });
    });
  });

  describe("fetchJobAction", () => {
    it("should create an action", () => {
      const jobId = "testId";
      const action = fromActions.fetchJobAction({ jobId });
      expect({ ...action }).toEqual({ type: "[Job] Fetch Job", jobId });
    });
  });

  describe("fetchJobCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchJobCompleteAction({ job });
      expect({ ...action }).toEqual({ type: "[Job] Fetch Job Complete", job });
    });
  });

  describe("fetchJobFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchJobFailedAction();
      expect({ ...action }).toEqual({ type: "[Job] Fetch Job Failed" });
    });
  });

  describe("submitJobAction", () => {
    it("should create an action", () => {
      const newJob = { ...job } as CreateJobDto;
      const action = fromActions.submitJobAction({ job: newJob });
      expect({ ...action }).toEqual({ type: "[Job] Submit Job", job: newJob });
    });
  });

  describe("submitJobCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.submitJobCompleteAction({ job });
      expect({ ...action }).toEqual({ type: "[Job] Submit Job Complete", job });
    });
  });

  describe("submitJobFailedAction", () => {
    it("should create an action", () => {
      const err = new Error();
      const action = fromActions.submitJobFailedAction({ err });
      expect({ ...action }).toEqual({ type: "[Job] Submit Job Failed", err });
    });
  });

  describe("setJobViewModeAction", () => {
    it("should create an action", () => {
      const mode = null;
      const action = fromActions.setJobViewModeAction({ mode });
      expect({ ...action }).toEqual({ type: "[Job] Set Mode Filter", mode });
    });
  });

  describe("setJobsLimitFilterAction", () => {
    it("should create an action", () => {
      const limit = 25;
      const action = fromActions.setJobsLimitFilterAction({ limit });
      expect({ ...action }).toEqual({ type: "[Job] Set Limit Filter", limit });
    });
  });

  describe("changePageAction", () => {
    it("should create an action", () => {
      const page = 1;
      const limit = 25;
      const action = fromActions.changePageAction({ page, limit });
      expect({ ...action }).toEqual({ type: "[Job] Change Page", page, limit });
    });
  });

  describe("sortByColumnAction", () => {
    it("should create an action", () => {
      const column = "test";
      const direction = "desc";
      const action = fromActions.sortByColumnAction({ column, direction });
      expect({ ...action }).toEqual({
        type: "[Job] Sort By Column",
        column,
        direction,
      });
    });
  });

  describe("clearJobsStateAction", () => {
    it("should create an action", () => {
      const action = fromActions.clearJobsStateAction();

      expect({ ...action }).toEqual({ type: "[Job] Clear State" });
    });
  });
});
