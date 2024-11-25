import { logbooksReducer } from "./logbooks.reducer";
import { initialLogbookState } from "../state/logbooks.store";
import * as fromActions from "../actions/logbooks.actions";
import { LogbookFilters } from "../models";
import { createMock } from "shared/MockStubs";
import { Logbook } from "@scicatproject/scicat-sdk-ts";

describe("LogbooksReducer", () => {
  const logbook = createMock<Logbook>({
    name: "test",
    roomId: "!test@site",
    messages: [],
  });

  describe("on fetchLogbooksComplete", () => {
    it("should set logbooks", () => {
      const firstTestMessage = { content: "First message" };
      const secondTestMessage = { content: "Second message" };
      const logbooks = [
        createMock<Logbook>({
          ...logbook,
          messages: [firstTestMessage, secondTestMessage],
        }),
      ];

      const action = fromActions.fetchLogbooksCompleteAction({ logbooks });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.logbooks).toEqual(logbooks);
      state.logbooks.forEach((logbook) => {
        expect(logbook.messages[0]).toEqual(secondTestMessage);
        expect(logbook.messages[1]).toEqual(firstTestMessage);
      });
    });

    it("should set logbooks even if the logbooks array is empty", () => {
      const logbooks = [];
      const action = fromActions.fetchLogbooksCompleteAction({ logbooks });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.logbooks).toEqual([]);
    });
  });

  describe("on fetchLogbookCompleteAction", () => {
    it("should set currentLogbook", () => {
      const action = fromActions.fetchLogbookCompleteAction({ logbook });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.currentLogbook).toEqual(logbook);
    });
  });

  describe("on fetchLogbookFailedAction", () => {
    it("should clear currentLogbook", () => {
      const action = fromActions.fetchLogbookFailedAction();
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.currentLogbook).toBeUndefined();
    });
  });

  describe("on clearLogbookAction", () => {
    it("should clear currentLogbook", () => {
      const action = fromActions.clearLogbookAction();
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.currentLogbook).toBeUndefined();
    });
  });

  describe("on fetchCountCompleteAction", () => {
    it("should set totalCount", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.totalCount).toEqual(count);
    });
  });

  describe("on prefillFiltersAction", () => {
    it("should set filters and set hasPrefilledFilters to true", () => {
      const values: Partial<LogbookFilters> = {
        textSearch: "test",
      };
      const action = fromActions.prefillFiltersAction({ values });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.filters.textSearch).toEqual(values.textSearch);
      expect(state.hasPrefilledFilters).toEqual(true);
    });
  });

  describe("on setTextFilterAction", () => {
    it("should set textSearch filter and set skip filter to 0", () => {
      const textSearch = "test";
      const action = fromActions.setTextFilterAction({ textSearch });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.filters.textSearch).toEqual(textSearch);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on setDisplayFiltersAction", () => {
    it("should set showBotMessages, showImages and showUserMessages filters, and set skip filter to 0", () => {
      const showBotMessages = true;
      const showImages = true;
      const showUserMessages = false;
      const action = fromActions.setDisplayFiltersAction({
        showBotMessages,
        showImages,
        showUserMessages,
      });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.filters.showBotMessages).toEqual(showBotMessages);
      expect(state.filters.showImages).toEqual(showImages);
      expect(state.filters.showUserMessages).toEqual(showUserMessages);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on changePageAction", () => {
    it("should set skip and limit filters", () => {
      const page = 1;
      const limit = 25;
      const skip = page * limit;
      const action = fromActions.changePageAction({ page, limit });
      const state = logbooksReducer(initialLogbookState, action);

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
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.filters.sortField).toEqual(sortField);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on clearLogbooksStateAction", () => {
    it("should set logbook state to initialLogbookState", () => {
      const action = fromActions.clearLogbooksStateAction();
      const state = logbooksReducer(initialLogbookState, action);

      expect(state).toEqual(initialLogbookState);
    });
  });
});
