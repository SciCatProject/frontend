import { Logbook, LogbookFilters } from "../models";
import {
  ActionTypes,
  FetchLogbooksAction,
  FetchLogbooksCompleteAction,
  FetchLogbooksFailedAction,
  FetchLogbookAction,
  FetchLogbookCompleteAction,
  FetchLogbookFailedAction,
  FetchFilteredEntriesAction,
  FetchFilteredEntriesCompleteAction,
  FetchFilteredEntriesFailedAction,
  UpdateFilterAction,
  UpdateFilterCompleteAction,
  UpdateFilterFailedAction
} from "./logbooks.actions";

describe("FetchLogbooksAction", () => {
  it("should create an action", () => {
    const action = new FetchLogbooksAction();
    expect({ ...action }).toEqual({ type: ActionTypes.FETCH_LOGBOOKS });
  });
});

describe("FetchLogbooksCompleteAction", () => {
  it("should create an action", () => {
    const logbooks = [new Logbook()];
    const action = new FetchLogbooksCompleteAction(logbooks);
    expect({ ...action }).toEqual({
      type: ActionTypes.FETCH_LOGBOOKS_COMPLETE,
      logbooks
    });
  });
});

describe("FetchLogbooksFailedAction", () => {
  it("should create an action", () => {
    const action = new FetchLogbooksFailedAction();
    expect({ ...action }).toEqual({ type: ActionTypes.FETCH_LOGBOOKS_FAILED });
  });
});

describe("FetchLogbookAction", () => {
  it("should create an action", () => {
    const name = "ERIC";
    const action = new FetchLogbookAction(name);
    expect({ ...action }).toEqual({ type: ActionTypes.FETCH_LOGBOOK, name });
  });
});

describe("FetchLogbookCompleteAction", () => {
  it("should create an action", () => {
    const logbook = new Logbook();
    const action = new FetchLogbookCompleteAction(logbook);
    expect({ ...action }).toEqual({
      type: ActionTypes.FETCH_LOGBOOK_COMPLETE,
      logbook
    });
  });
});

describe("FetchLogbookFailedAction", () => {
  it("should create an action", () => {
    const action = new FetchLogbookFailedAction();
    expect({ ...action }).toEqual({ type: ActionTypes.FETCH_LOGBOOK_FAILED });
  });
});

describe("FetchFilteredEntriesAction", () => {
  it("should create an action", () => {
    const name = "ERIC";
    const filter = {
      textSearch: "Hello",
      showBotMessages: true,
      showUserMessages: true,
      showImages: true
    };
    const action = new FetchFilteredEntriesAction(name, filter);
    expect({ ...action }).toEqual({
      type: ActionTypes.FETCH_FILTERED_ENTRIES,
      name,
      filter
    });
  });
});

describe("FetchFilteredEntriesCompleteAction", () => {
  it("should create an action", () => {
    const logbook = new Logbook();
    const action = new FetchFilteredEntriesCompleteAction(logbook);
    expect({ ...action }).toEqual({
      type: ActionTypes.FETCH_FILTERED_ENTRIES_COMPLETE,
      logbook
    });
  });
});

describe("FetchFilteredEntriesFailedAction", () => {
  it("should create an action", () => {
    const action = new FetchFilteredEntriesFailedAction();
    expect({ ...action }).toEqual({
      type: ActionTypes.FETCH_FILTERED_ENTRIES_FAILED
    });
  });
});

describe("UpdateFilterAction", () => {
  it("should create an action", () => {
    const filter: LogbookFilters = {
      textSearch: "Hello",
      showBotMessages: true,
      showUserMessages: true,
      showImages: true
    };
    const action = new UpdateFilterAction(filter);
    expect({ ...action }).toEqual({ type: ActionTypes.UPDATE_FILTER, filter });
  });
});

describe("UpdateFilterCompleteAction", () => {
  it("should create an action", () => {
    const filter: LogbookFilters = {
      textSearch: "Hello",
      showBotMessages: true,
      showUserMessages: true,
      showImages: true
    };
    const action = new UpdateFilterCompleteAction(filter);
    expect({ ...action }).toEqual({
      type: ActionTypes.UPDATE_FILTER_COMPLETE,
      filter
    });
  });
});

describe("UpdateFilterFailedAction", () => {
  it("should create an action", () => {
    const action = new UpdateFilterFailedAction();
    expect({ ...action }).toEqual({ type: ActionTypes.UPDATE_FILTER_FAILED });
  });
});
