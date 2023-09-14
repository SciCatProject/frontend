import * as fromSelectors from "./logbooks.selectors";
import { LogbookFilters, Logbook } from "state-management/models";
import { LogbookState } from "state-management/state/logbooks.store";

const logbook = new Logbook();

const logbookFilters: LogbookFilters = {
  textSearch: "test",
  showBotMessages: true,
  showUserMessages: true,
  showImages: true,
  sortField: "timestamp:desc",
  skip: 0,
  limit: 25,
};

const initialLogbookState: LogbookState = {
  logbooks: [],
  currentLogbook: logbook,

  totalCount: 0,

  hasPrefilledFilters: false,
  filters: logbookFilters,
};

describe("Logbook Selectors", () => {
  describe("selectLogbooks", () => {
    it("should select logbooks", () => {
      expect(
        fromSelectors.selectLogbooks.projector(initialLogbookState),
      ).toEqual([]);
    });
  });

  describe("selectCurrentLogbook", () => {
    it("should select the current logbook", () => {
      expect(
        fromSelectors.selectCurrentLogbook.projector(initialLogbookState),
      ).toEqual(logbook);
    });
  });

  describe("selectEntriesCount", () => {
    it("should select totalCount", () => {
      expect(
        fromSelectors.selectEntriesCount.projector(initialLogbookState),
      ).toEqual(0);
    });
  });

  describe("selectHasPrefilledFilters", () => {
    it("should return hasPrefilledFilters", () => {
      expect(
        fromSelectors.selectHasPrefilledFilters.projector(initialLogbookState),
      ).toEqual(false);
    });
  });

  describe("selectFilters", () => {
    it("should select filters", () => {
      expect(
        fromSelectors.selectFilters.projector(initialLogbookState),
      ).toEqual(logbookFilters);
    });
  });

  describe("selectEntriesPerPage", () => {
    it("should select limit filter", () => {
      expect(
        fromSelectors.selectEntriesPerPage.projector(
          initialLogbookState.filters,
        ),
      ).toEqual(25);
    });
  });

  describe("selectPage", () => {
    it("should select page from skip and limit filters", () => {
      const { skip, limit } = initialLogbookState.filters;
      const page = skip / limit;

      expect(
        fromSelectors.selectPage.projector(initialLogbookState.filters),
      ).toEqual(page);
    });
  });

  describe("selectLogbooksDashboardPageViewModel", () => {
    it("should select the logbooks dashboard page view model", () => {
      expect(
        fromSelectors.selectLogbooksDashboardPageViewModel.projector(
          fromSelectors.selectCurrentLogbook.projector(initialLogbookState),
          fromSelectors.selectEntriesCount.projector(initialLogbookState),
          fromSelectors.selectEntriesPerPage.projector(
            initialLogbookState.filters,
          ),
          fromSelectors.selectPage.projector(initialLogbookState.filters),
          fromSelectors.selectFilters.projector(initialLogbookState),
        ),
      ).toEqual({
        logbook,
        entriesCount: 0,
        entriesPerPage: 25,
        currentPage: 0,
        filters: logbookFilters,
      });
    });
  });
});
