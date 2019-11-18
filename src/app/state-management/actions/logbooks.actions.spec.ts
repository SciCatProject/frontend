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
        logbooks
      });
    });
  });

  describe("fetchLogbooksFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchLogbooksFailedAction();
      expect({ ...action }).toEqual({
        type: "[Logbook] Fetch Logbooks Failed"
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
        logbook
      });
    });
  });

  describe("fetchLogbookFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchLogbookFailedAction();
      expect({ ...action }).toEqual({ type: "[Logbook] Fetch Logbook Failed" });
    });
  });

  describe("prefillFiltersAction", () => {
    it("should create an action", () => {
      const values: Partial<LogbookFilters> = {
        textSearch: "test"
      };
      const action = fromActions.prefillFiltersAction({ values });
      expect({ ...action }).toEqual({
        type: "[Logbook] Prefill Filters",
        values
      });
    });
  });

  describe("setTextFilterAction", () => {
    it("should create an action", () => {
      const textSearch = "test";
      const action = fromActions.setTextFilterAction({ textSearch });
      expect({ ...action }).toEqual({
        type: "[Logbook] Set Text Filter",
        textSearch
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
        showUserMessages
      });
      expect({ ...action }).toEqual({
        type: "[Logbook] Set Display Filters",
        showBotMessages,
        showImages,
        showUserMessages
      });
    });
  });
});
