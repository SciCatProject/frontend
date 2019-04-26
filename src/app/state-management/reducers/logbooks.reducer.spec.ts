import { logbooksReducer } from "./logbooks.reducer";
import { initialLogbookState } from "../state/logbooks.store";
import * as logbooksActions from "../actions/logbooks.actions";
import { Logbook, LogbookFilters } from "../models";

describe("LogbooksReducer", () => {
  it("should fetch all available logbooks", () => {
    const logbooks = [new Logbook()];
    const action = new logbooksActions.FetchLogbooksAction();
    const state = logbooksReducer(initialLogbookState, action);
    expect(state.logbooks).toBe(logbooks);
  });

  it("should fetch a logbook", () => {
    const name = "string";
    const action = new logbooksActions.FetchLogbookAction(name);
    const state = logbooksReducer(initialLogbookState, action);
    expect(state.logbook.name).toEqual(name);
  });

  it("should fetch a filtered logbook", () => {
    const name = "string";
    const filter = {
      textSearch: "string",
      showBotMessages: true,
      showUserMessages: true,
      showImages: true
    };
    const action = new logbooksActions.FetchFilteredEntriesAction(name, filter);
    const state = logbooksReducer(initialLogbookState, action);
    expect(state.logbook.name).toEqual(name);
  });

  it("should update the logbook filter", () => {
    const filter: LogbookFilters = {
      textSearch: "string",
      showBotMessages: true,
      showUserMessages: true,
      showImages: true
    };
    const action = new logbooksActions.UpdateFilterAction(filter);
    const state = logbooksReducer(initialLogbookState, action);
    expect(state.filters).toEqual(filter);
  });
});
