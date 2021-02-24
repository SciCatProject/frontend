import { Logbook, LogbookFilters } from "../models";
import * as fromActions from "./logbooks.actions";

describe("Logbook Actions", () => {
  describe("fetchLogbooksAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchLogbooksAction();
      expect({ ...action }).toEqual({ type: "[Logbook] Fetch Logbooks" });
    });
  });

  describe("fetchLogbooksCompleteAction", () => {
    it("should create an action", () => {
      const logbooks = [new Logbook()];
      const action = fromActions.fetchLogbooksCompleteAction({ logbooks });
      expect({ ...action }).toEqual({
        type: "[Logbook] Fetch Logbooks Complete",
        logbooks,
      });
    });
  });

  describe("fetchLogbooksFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchLogbooksFailedAction();
      expect({ ...action }).toEqual({
        type: "[Logbook] Fetch Logbooks Failed",
      });
    });
  });

  describe("fetchLogbookAction", () => {
    it("should create an action", () => {
      const name = "testName";
      const action = fromActions.fetchLogbookAction({ name });
      expect({ ...action }).toEqual({ type: "[Logbook] Fetch Logbook", name });
    });
  });

  describe("fetchLogbookCompleteAction", () => {
    it("should create an action", () => {
      const logbook = new Logbook();
      const action = fromActions.fetchLogbookCompleteAction({ logbook });
      expect({ ...action }).toEqual({
        type: "[Logbook] Fetch Logbook Complete",
        logbook,
      });
    });
  });

  describe("fetchLogbookFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchLogbookFailedAction();
      expect({ ...action }).toEqual({ type: "[Logbook] Fetch Logbook Failed" });
    });
  });

  describe("clearLogbookAction", () => {
    it("should create an action", () => {
      const action = fromActions.clearLogbookAction();
      expect({ ...action }).toEqual({ type: "[Logbook] Clear Logbook" });
    });
  });

  describe("fetchCountAction", () => {
    it("should create an action", () => {
      const name = "test";
      const action = fromActions.fetchCountAction({ name });
      expect({ ...action }).toEqual({ type: "[Logbook] Fetch Count", name });
    });
  });

  describe("fetchCountCompleteAction", () => {
    it("should create an action", () => {
      const count = 0;
      const action = fromActions.fetchCountCompleteAction({ count });
      expect({ ...action }).toEqual({
        type: "[Logbook] Fetch Count Complete",
        count,
      });
    });
  });

  describe("fetchCountFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCountFailedAction();
      expect({ ...action }).toEqual({ type: "[Logbook] Fetch Count Failed" });
    });
  });

  describe("prefillFiltersAction", () => {
    it("should create an action", () => {
      const values: Partial<LogbookFilters> = {
        textSearch: "test",
      };
      const action = fromActions.prefillFiltersAction({ values });
      expect({ ...action }).toEqual({
        type: "[Logbook] Prefill Filters",
        values,
      });
    });
  });

  describe("setTextFilterAction", () => {
    it("should create an action", () => {
      const textSearch = "test";
      const action = fromActions.setTextFilterAction({ textSearch });
      expect({ ...action }).toEqual({
        type: "[Logbook] Set Text Filter",
        textSearch,
      });
    });
  });

  describe("setDisplayFiltersAction", () => {
    it("should create an action", () => {
      const showBotMessages = true;
      const showImages = true;
      const showUserMessages = false;
      const action = fromActions.setDisplayFiltersAction({
        showBotMessages,
        showImages,
        showUserMessages,
      });
      expect({ ...action }).toEqual({
        type: "[Logbook] Set Display Filters",
        showBotMessages,
        showImages,
        showUserMessages,
      });
    });
  });

  describe("changePageAction", () => {
    it("should create an action", () => {
      const page = 0;
      const limit = 25;
      const action = fromActions.changePageAction({ page, limit });
      expect({ ...action }).toEqual({
        type: "[Logbook] Change Page",
        page,
        limit,
      });
    });
  });

  describe("sortByColumnAction", () => {
    it("should create an action", () => {
      const column = "test";
      const direction = "asc";
      const action = fromActions.sortByColumnAction({ column, direction });
      expect({ ...action }).toEqual({
        type: "[Logbook] Sort By Column",
        column,
        direction,
      });
    });
  });

  describe("clearLogbooksStateAction", () => {
    it("should create an action", () => {
      const action = fromActions.clearLogbooksStateAction();

      expect({ ...action }).toEqual({ type: "[Logbook] Clear State" });
    });
  });
});
