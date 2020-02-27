import { InstrumentState } from "state-management/state/instruments.store";
import * as fromSelectors from "./instruments.selectors";
import { InstrumentFilters, Instrument } from "state-management/models";

const instrument = new Instrument();

const instrumentFilters: InstrumentFilters = {
  sortField: "name desc",
  skip: 0,
  limit: 25
};

const initialInstrumentState: InstrumentState = {
  instruments: [],
  currentInstrument: instrument,
  totalCount: 0,

  filters: instrumentFilters
};

describe("Instrument Selectors", () => {
  describe("getInstruments", () => {
    it("should get instruments", () => {
      expect(
        fromSelectors.getInstruments.projector(initialInstrumentState)
      ).toEqual([]);
    });
  });

  describe("getCurrentInstrument", () => {
    it("should get current instrument", () => {
      expect(
        fromSelectors.getCurrentInstrument.projector(initialInstrumentState)
      ).toEqual(instrument);
    });
  });

  describe("getInstrumentsCount", () => {
    it("should get the total instruments count", () => {
      expect(
        fromSelectors.getInstrumentsCount.projector(initialInstrumentState)
      ).toEqual(0);
    });
  });

  describe("getFilters", () => {
    it("should get the filters", () => {
      expect(
        fromSelectors.getFilters.projector(initialInstrumentState)
      ).toEqual(instrumentFilters);
    });
  });

  describe("getPage", () => {
    it("should get the current page from filters", () => {
      const { skip, limit } = instrumentFilters;
      const page = skip / limit;
      expect(
        fromSelectors.getPage.projector(initialInstrumentState.filters)
      ).toEqual(page);
    });
  });

  describe("getInstrumentsPerPage", () => {
    it("should get the limit from filters", () => {
      const { limit } = instrumentFilters;
      expect(
        fromSelectors.getInstrumentsPerPage.projector(
          initialInstrumentState.filters
        )
      ).toEqual(limit);
    });
  });
});
