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

  describe("fetchFilteredEntriesAction", () => {
    it("should create an action", () => {
      const name = "testName";
      const filters: LogbookFilters = {
        textSearch: "test",
        showBotMessages: true,
        showUserMessages: true,
        showImages: true
      };
      const action = fromActions.fetchFilteredEntriesAction({ name, filters });
      expect({ ...action }).toEqual({
        type: "[Logbook] Fetch Filtered Entries",
        name,
        filters
      });
    });
  });

  describe("fetchFilteredEntriesCompleteAction", () => {
    it("should create an action", () => {
      const logbook = new Logbook();
      const action = fromActions.fetchFilteredEntriesCompleteAction({
        logbook
      });
      expect({ ...action }).toEqual({
        type: "[Logbook] Fetch Filtered Entries Complete",
        logbook
      });
    });
  });

  describe("fetchFilteredEntriesFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchFilteredEntriesFailedAction();
      expect({ ...action }).toEqual({
        type: "[Logbook] Fetch Filtered Entries Failed"
      });
    });
  });

  describe("setFilterAction", () => {
    it("should create an action", () => {
      const filters: LogbookFilters = {
        textSearch: "test",
        showBotMessages: true,
        showUserMessages: true,
        showImages: true
      };
      const action = fromActions.setFilterAction({ filters });
      expect({ ...action }).toEqual({
        type: "[Logbook] Update Filter",
        filters
      });
    });
  });
});
