import * as fromActions from "state-management/actions/instruments.actions";
import { instrumentsReducer } from "./instruments.reducer";
import { initialInstrumentState } from "state-management/state/instruments.store";
import { mockInstrument as instrument } from "shared/MockStubs";

describe("InstrumentsReducer", () => {
  describe("on fetchInstrumentsCompleteAction", () => {
    it("should set instruments property", () => {
      const instruments = [instrument];
      const action = fromActions.fetchInstrumentsCompleteAction({
        instruments,
      });
      const state = instrumentsReducer(initialInstrumentState, action);

      expect(state.instruments).toEqual(instruments);
    });
  });

  describe("on fetchCountCompleteAction", () => {
    it("should set totalCount property", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      const state = instrumentsReducer(initialInstrumentState, action);

      expect(state.totalCount).toEqual(count);
    });
  });

  describe("on fetchInstrumentCompleteAction", () => {
    it("should set currentInstrument property", () => {
      const action = fromActions.fetchInstrumentCompleteAction({
        instrument,
      });
      const state = instrumentsReducer(initialInstrumentState, action);

      expect(state.currentInstrument).toEqual(instrument);
    });
  });

  describe("on saveCustomMetadataCompleteAction", () => {
    it("should set currentInstrument property", () => {
      const action = fromActions.saveCustomMetadataCompleteAction({
        instrument,
      });
      const state = instrumentsReducer(initialInstrumentState, action);

      expect(state.currentInstrument).toEqual(instrument);
    });
  });

  describe("on changePageAction", () => {
    it("should set skip and limit filters", () => {
      const page = 1;
      const limit = 25;
      const skip = page * limit;
      const action = fromActions.changePageAction({ page, limit });
      const state = instrumentsReducer(initialInstrumentState, action);

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
      const state = instrumentsReducer(initialInstrumentState, action);

      expect(state.filters.sortField).toEqual(sortField);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on clearInstrumentsStateAction", () => {
    it("should set instrument state to initialInstrumentState", () => {
      const action = fromActions.clearInstrumentsStateAction();
      const state = instrumentsReducer(initialInstrumentState, action);

      expect(state).toEqual(initialInstrumentState);
    });
  });
});
