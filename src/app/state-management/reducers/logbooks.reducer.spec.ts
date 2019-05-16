import { logbooksReducer } from "./logbooks.reducer";
import { initialLogbookState } from "../state/logbooks.store";
import * as logbooksActions from "../actions/logbooks.actions";
import { LogbookFilters } from "../models";

describe("LogbooksReducer", () => {
  it("should update the logbook filter", () => {
    const filter: LogbookFilters = {
      textSearch: "",
      showBotMessages: true,
      showUserMessages: true,
      showImages: true
    };
    const action = new logbooksActions.UpdateFilterAction(filter);
    const state = logbooksReducer(initialLogbookState, action);
    expect(state.filters).toEqual(filter);
  });
});
