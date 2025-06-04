import { InstrumentState } from "state-management/state/instruments.store";
import * as fromSelectors from "./instruments.selectors";
import * as fromUserSelectors from "./user.selectors";
import { GenericFilters } from "state-management/models";
import { mockInstrument as instrument } from "shared/MockStubs";
import { initialUserState } from "./user.selectors.spec";

const instrumentFilters: GenericFilters = {
  sortField: "name desc",
  skip: 0,
  limit: 25,
};

const initialInstrumentState: InstrumentState = {
  instruments: [],
  currentInstrument: instrument,
  totalCount: 0,

  filters: instrumentFilters,
};

describe("Instrument Selectors", () => {
  describe("selectInstruments", () => {
    it("should select instruments", () => {
      expect(
        fromSelectors.selectInstruments.projector(initialInstrumentState),
      ).toEqual([]);
    });
  });

  describe("selectCurrentInstrument", () => {
    it("should select current instrument", () => {
      expect(
        fromSelectors.selectCurrentInstrument.projector(initialInstrumentState),
      ).toEqual(instrument);
    });
  });

  describe("selectInstrumentsCount", () => {
    it("should select the total instruments count", () => {
      expect(
        fromSelectors.selectInstrumentsCount.projector(initialInstrumentState),
      ).toEqual(0);
    });
  });

  describe("selectFilters", () => {
    it("should select the filters", () => {
      expect(
        fromSelectors.selectFilters.projector(initialInstrumentState),
      ).toEqual(instrumentFilters);
    });
  });

  describe("selectPage", () => {
    it("should select the current page from filters", () => {
      const { skip, limit } = instrumentFilters;
      const page = skip / limit;
      expect(
        fromSelectors.selectPage.projector(initialInstrumentState.filters),
      ).toEqual(page);
    });
  });

  describe("selectInstrumentsPerPage", () => {
    it("should select the limit from filters", () => {
      const { limit } = instrumentFilters;
      expect(
        fromSelectors.selectInstrumentsPerPage.projector(
          initialInstrumentState.filters,
        ),
      ).toEqual(limit);
    });
  });

  describe("selectInstrumentsWithCountAndTableSettings", () => {
    it("should select the instruments dashboard page view model", () => {
      expect(
        fromSelectors.selectInstrumentsWithCountAndTableSettings.projector(
          fromSelectors.selectInstruments.projector(initialInstrumentState),
          fromSelectors.selectInstrumentsCount.projector(
            initialInstrumentState,
          ),
          fromUserSelectors.selectTablesSettings.projector(initialUserState),
        ),
      ).toEqual({
        instruments: [],
        count: 0,
        tablesSettings: {},
      });
    });
  });
});
