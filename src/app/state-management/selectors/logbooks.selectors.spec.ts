import * as fromSelectors from "./logbooks.selectors";
import { LogbookFilters, Logbook } from "state-management/models";
import { LogbookState } from "state-management/state/logbooks.store";

const logbook = new Logbook();

const logbookFilters: LogbookFilters = {
  textSearch: "test",
  showBotMessages: true,
  showUserMessages: true,
  showImages: true
};

const initialLogbookState: LogbookState = {
  logbooks: [],
  currentLogbook: logbook,

  filters: logbookFilters
};

describe("Logbook Selectors", () => {
  describe("getLogbooks", () => {
    it("should get logbooks", () => {
      expect(fromSelectors.getLogbooks.projector(initialLogbookState)).toEqual(
        []
      );
    });
  });

  describe("getCurrentLogbook", () => {
    it("should get the current logbook", () => {
      expect(
        fromSelectors.getCurrentLogbook.projector(initialLogbookState)
      ).toEqual(logbook);
    });
  });

  describe("getFilters", () => {
    it("should get filters", () => {
      expect(fromSelectors.getFilters.projector(initialLogbookState)).toEqual(
        logbookFilters
      );
    });
  });
});
