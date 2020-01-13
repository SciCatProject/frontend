import * as fromSelectors from "./logbooks.selectors";
import { LogbookFilters, Logbook } from "state-management/models";
import { LogbookState } from "state-management/state/logbooks.store";

const logbook = new Logbook();

const logbookFilters: LogbookFilters = {
  textSearch: "test",
  showBotMessages: true,
  showUserMessages: true,
  showImages: true,
  skip: 0,
  limit: 25
};

const initialLogbookState: LogbookState = {
  logbooks: [],
  currentLogbook: logbook,

  totalCount: 0,

  hasPrefilledFilters: false,
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

  describe("getEntriesCount", () => {
    it("should get totalCount", () => {
      expect(
        fromSelectors.getEntriesCount.projector(initialLogbookState)
      ).toEqual(0);
    });
  });

  describe("getHasPrefilledFilters", () => {
    it("should return hasPrefilledFilters", () => {
      expect(
        fromSelectors.getHasPrefilledFilters.projector(initialLogbookState)
      ).toEqual(false);
    });
  });

  describe("getFilters", () => {
    it("should get filters", () => {
      expect(fromSelectors.getFilters.projector(initialLogbookState)).toEqual(
        logbookFilters
      );
    });
  });

  describe("getEntriesPerPage", () => {
    it("should get limit filter", () => {
      expect(
        fromSelectors.getEntriesPerPage.projector(initialLogbookState.filters)
      ).toEqual(25);
    });
  });

  describe("getPage", () => {
    it("should get page from skip and limit filters", () => {
      const { skip, limit } = initialLogbookState.filters;
      const page = skip / limit;

      expect(
        fromSelectors.getPage.projector(initialLogbookState.filters)
      ).toEqual(page);
    });
  });
});
