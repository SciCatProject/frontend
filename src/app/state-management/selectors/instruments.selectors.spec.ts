import { InstrumentState } from "state-management/state/instruments.store";
import * as fromSelectors from "./instruments.selectors";
import { GenericFilters, Instrument } from "state-management/models";

const instrument = new Instrument();

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

  describe("selectInstrumentsDashboardPageViewModel", () => {
    it("should select the instruments dashboard page view model", () => {
      expect(
        fromSelectors.selectInstrumentsDashboardPageViewModel.projector(
          fromSelectors.selectInstruments.projector(initialInstrumentState),
          fromSelectors.selectPage.projector(initialInstrumentState.filters),
          fromSelectors.selectInstrumentsCount.projector(
            initialInstrumentState,
          ),
          fromSelectors.selectInstrumentsPerPage.projector(
            initialInstrumentState.filters,
          ),
        ),
      ).toEqual({
        instruments: [],
        currentPage: 0,
        instrumentsCount: 0,
        instrumentsPerPage: 25,
      });
    });
  });
});
