import { Job } from "shared/sdk/models";
import {
  SubmitAction,
  SUBMIT,
  SubmitCompleteAction,
  SUBMIT_COMPLETE,
  FailedAction,
  FAILED,
  RetrieveCompleteAction,
  RETRIEVE_COMPLETE,
  SearchIDAction,
  SEARCH_ID,
  SearchIDCompleteAction,
  SEARCH_ID_COMPLETE,
  SearchIDFailedAction,
  SEARCH_ID_FAILED,
  CurrentJobAction,
  SELECT_CURRENT,
  SortUpdateAction,
  SORT_UPDATE,
  GetCountCompleteAction,
  GET_COUNT_COMPLETE
} from "./jobs.actions";

describe("SubmitAction", () => {
  it("should create an action", () => {
    const job = new Job();
    const action = new SubmitAction(job);
    expect({ ...action }).toEqual({ type: SUBMIT, job });
  });
});

describe("SubmitCompleteAction", () => {
  it("should create an action", () => {
    const job = new Job();
    const action = new SubmitCompleteAction(job);
    expect({ ...action }).toEqual({ type: SUBMIT_COMPLETE, job });
  });
});

describe("FailedAction", () => {
  it("should create an action", () => {
    const error = new Error();
    const action = new FailedAction(error);
    expect({ ...action }).toEqual({ type: FAILED, error });
  });
});

describe("RetrieveCompleteAction", () => {
  it("should create an action", () => {
    const jobsets = [new Job()];
    const action = new RetrieveCompleteAction(jobsets);
    expect({ ...action }).toEqual({ type: RETRIEVE_COMPLETE, jobsets });
  });
});

describe("GetCountCompleteAction", () => {
  it("should create an action", () => {
    const totalJobNumber = 1;
    const action = new GetCountCompleteAction(totalJobNumber);
    expect({ ...action }).toEqual({ type: GET_COUNT_COMPLETE, totalJobNumber });
  });
});

describe("SearchIDAction", () => {
  it("should create an action", () => {
    const id = "expectedstring";
    const action = new SearchIDAction(id);
    expect({ ...action }).toEqual({ type: SEARCH_ID, id });
  });
});

describe("SearchIDCompleteAction", () => {
  it("should create an action", () => {
    const jobset = [{ id: 1 }];
    const action = new SearchIDCompleteAction(jobset);
    expect({ ...action }).toEqual({ type: SEARCH_ID_COMPLETE, jobset });
  });
});

describe("SearchIDFailedAction", () => {
  it("should create an action", () => {
    const error = new Error();
    const action = new SearchIDFailedAction(error);
    expect({ ...action }).toEqual({ type: SEARCH_ID_FAILED, error });
  });
});

describe("CurrentJobAction", () => {
  it("should create an action", () => {
    const job = new Job();
    const action = new CurrentJobAction(job);
    expect({ ...action }).toEqual({ type: SELECT_CURRENT, job });
  });
});

describe("SortUpdateAction", () => {
  it("should create an action", () => {
    const limit = 0;
    const skip = 0;
    const mode = null;
    const action = new SortUpdateAction(skip, limit, mode);
    expect({ ...action }).toEqual({ type: SORT_UPDATE, skip, limit, mode });
  });
});
